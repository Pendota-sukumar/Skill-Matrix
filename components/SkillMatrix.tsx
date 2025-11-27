import React, { useState } from 'react';
import { Operator, Skill, SkillLevel, Machine } from '../types';
import { Search, Filter, Download, BrainCircuit, ChevronDown } from './Icons';

interface SkillMatrixProps {
  operators: Operator[];
  skills: Skill[];
  machines?: Machine[];
  onUpdateSkill: (operatorId: string, skillId: string, level: SkillLevel) => void;
}

const LEVEL_STYLES: Record<SkillLevel, string> = {
  0: 'bg-slate-100 text-slate-400 border-slate-200',
  1: 'bg-orange-50 text-orange-600 border-orange-200',
  2: 'bg-amber-50 text-amber-600 border-amber-200',
  3: 'bg-blue-50 text-blue-600 border-blue-200',
  4: 'bg-emerald-50 text-emerald-600 border-emerald-200 font-bold',
};

const LEVEL_LABELS: Record<SkillLevel, string> = {
  0: 'None',
  1: 'Novice',
  2: 'Supervised',
  3: 'Indep.',
  4: 'Expert',
};

const LEVEL_BADGE_COLORS: Record<SkillLevel, string> = {
    0: 'bg-slate-300',
    1: 'bg-orange-400',
    2: 'bg-amber-400',
    3: 'bg-blue-500',
    4: 'bg-emerald-500',
};

export const SkillMatrix: React.FC<SkillMatrixProps> = ({ operators, skills, machines = [], onUpdateSkill }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterMachine, setFilterMachine] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const roles = ['All', ...Array.from(new Set(operators.map(op => op.role)))];

  // Filtering Logic
  const filteredSkills = skills.filter(s => {
    if (filterMachine !== 'All') {
        const machine = machines.find(m => m.id === filterMachine);
        if (machine) {
            return machine.requiredSkills.some(req => req.skillId === s.id);
        }
    }
    return filterCategory === 'All' || s.category === filterCategory;
  });

  const filteredOperators = operators.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          op.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || op.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCellClick = (op: Operator, skillId: string) => {
    const currentLevel = op.skills[skillId] || 0;
    const nextLevel = ((currentLevel + 1) % 5) as SkillLevel;
    onUpdateSkill(op.id, skillId, nextLevel);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in ring-1 ring-slate-100">
      {/* Controls Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Competency Matrix</h2>
                <p className="text-sm text-slate-500 mt-1">Manage skill levels and training requirements</p>
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm bg-white flex items-center gap-2 group">
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                    Export CSV
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                </button>
            </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 items-center pt-2">
          <div className="relative flex-1 w-full lg:w-auto group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by operator name or role..."
              className="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
             {/* Machine Filter */}
             <div className="relative flex-1 min-w-[180px]">
                <select
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer transition-colors shadow-sm text-slate-700 font-medium"
                    value={filterMachine}
                    onChange={(e) => {
                        setFilterMachine(e.target.value);
                        if (e.target.value !== 'All') setFilterCategory('All');
                    }}
                >
                    <option value="All">All Machines</option>
                    {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <BrainCircuit className="h-3.5 w-3.5 text-slate-400" />
                </div>
             </div>

             {/* Category Filter */}
              <div className="relative flex-1 min-w-[160px]">
                  <select
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer transition-colors shadow-sm text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    disabled={filterMachine !== 'All'}
                  >
                    <option value="All">All Categories</option>
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>

             {/* Role Filter */}
             <div className="relative flex-1 min-w-[160px]">
                <select
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer transition-colors shadow-sm text-slate-700 font-medium"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto matrix-scroll relative bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-30 shadow-sm bg-slate-50">
            <tr>
              <th className="p-4 pl-6 text-left font-semibold text-slate-700 border-b border-r border-slate-200 sticky left-0 z-40 bg-slate-50 min-w-[280px] shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] uppercase tracking-wide text-[11px]">
                Operator Profile
              </th>
              {filteredSkills.map(skill => (
                <th key={skill.id} className="p-3 min-w-[140px] border-b border-r border-slate-200 font-semibold text-slate-600 text-center bg-slate-50/95 backdrop-blur-sm group hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col gap-1.5 items-center justify-center h-full">
                    <span className="text-slate-800 group-hover:text-indigo-700 block max-w-[120px] truncate" title={skill.name}>{skill.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium px-2 py-0.5 bg-slate-200/60 group-hover:bg-white rounded-md border border-transparent group-hover:border-indigo-100 transition-colors">
                        {skill.category}
                    </span>
                  </div>
                </th>
              ))}
              {filteredSkills.length === 0 && (
                  <th className="p-12 text-center text-slate-400 font-normal italic w-full">
                      No skills found matching current filters.
                  </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOperators.map(op => (
              <tr key={op.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="p-4 pl-6 border-r border-slate-200 sticky left-0 z-20 bg-white group-hover:bg-indigo-50/10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                        <img src={op.avatar} alt={op.name} className="w-9 h-9 rounded-full bg-slate-200 object-cover border border-slate-100 shadow-sm" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{op.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{op.role}</div>
                    </div>
                  </div>
                </td>
                {filteredSkills.map(skill => {
                  const level = op.skills[skill.id] || 0;
                  return (
                    <td 
                      key={skill.id} 
                      className="p-3 border-r border-slate-100 text-center cursor-pointer select-none relative"
                      onClick={() => handleCellClick(op, skill.id)}
                    >
                      <div className={`mx-auto w-28 py-1.5 rounded-md text-[11px] font-semibold border transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group-hover:shadow hover:scale-105 active:scale-95 ${LEVEL_STYLES[level]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_BADGE_COLORS[level]} ring-2 ring-white/50`}></span>
                        {LEVEL_LABELS[level]}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
             {filteredOperators.length === 0 && (
                <tr>
                    <td colSpan={filteredSkills.length + 1} className="p-16 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-50 rounded-full">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium">No operators match your criteria.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Legend */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-medium flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 text-[10px] font-bold">TIP</span>
            Click any cell to cycle through skill proficiency levels.
        </span>
        <div className="flex flex-wrap gap-6 justify-center">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-1 ring-slate-400/20"></span> None (L0)</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 ring-1 ring-orange-500/20"></span> Novice (L1)</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-amber-500/20"></span> Supervised (L2)</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-1 ring-blue-600/20"></span> Independent (L3)</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-emerald-600/20"></span> Expert (L4)</span>
        </div>
      </div>
    </div>
  );
};