import React, { useState } from 'react';
import { Machine, Operator, Skill, Recommendation } from '../types';
import { BrainCircuit, CheckCircle, AlertTriangle, ChevronRight, Filter } from './Icons';
import { getOperatorRecommendations } from '../services/geminiService';

interface AssignmentAssistantProps {
  machines: Machine[];
  operators: Operator[];
  skills: Skill[];
}

export const AssignmentAssistant: React.FC<AssignmentAssistantProps> = ({ machines, operators, skills }) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0]?.id || '');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  const handleGetRecommendations = async () => {
    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) return;

    setLoading(true);
    setHasSearched(true);
    const results = await getOperatorRecommendations(machine, operators, skills);
    setRecommendations(results);
    setLoading(false);
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId);
  
  const sortedRecommendations = [...recommendations].sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return 0; 
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full animate-fade-in">
      {/* Left Panel: Configuration */}
      <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-slate-200 xl:col-span-1 flex flex-col gap-8 h-fit sticky top-24 ring-1 ring-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md shadow-indigo-200">
                <BrainCircuit className="text-white w-6 h-6" />
            </div>
            Smart Assign
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            AI-powered workforce allocation. Select a machine to get real-time recommendations based on skill levels, certifications, and availability.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Workstation</label>
            <div className="relative group">
                <select 
                className="w-full p-4 pl-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none text-slate-700 font-semibold group-hover:bg-white shadow-sm cursor-pointer"
                value={selectedMachineId}
                onChange={(e) => {
                    setSelectedMachineId(e.target.value);
                    setHasSearched(false);
                    setRecommendations([]);
                }}
                >
                {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name} — {m.type}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
            </div>
          </div>

          {selectedMachine && (
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/60">
              <h3 className="text-xs font-bold uppercase text-indigo-900 mb-4 tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200"></span>
                  Required Competencies
              </h3>
              <ul className="space-y-3">
                {selectedMachine.requiredSkills.map((req, idx) => {
                  const skillName = skills.find(s => s.id === req.skillId)?.name;
                  return (
                    <li key={idx} className="text-sm text-slate-700 flex justify-between items-center group">
                      <span className="font-medium group-hover:text-indigo-700 transition-colors">{skillName}</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-indigo-700 border border-indigo-100/50 text-xs font-bold shadow-sm group-hover:shadow-md transition-all">
                        Level {req.minLevel}+
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <button
            onClick={handleGetRecommendations}
            disabled={loading || !selectedMachineId}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-3 text-sm tracking-wide
              ${loading ? 'bg-indigo-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'}`}
          >
            {loading ? (
                <>
                 <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                 Analyzing...
                </>
            ) : (
                <>
                <BrainCircuit className="w-5 h-5" />
                Generate Recommendations
                </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex justify-between items-end mb-2">
            <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {hasSearched ? 'AI Analysis Results' : 'Recommendation Engine'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    {hasSearched ? `Found ${recommendations.length} potential matches for ${selectedMachine?.name}` : 'Select a machine to start'}
                </p>
            </div>
            {hasSearched && recommendations.length > 0 && (
                 <div className="flex gap-2 text-sm text-slate-500 animate-fade-in bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="font-medium">Sorted by:</span>
                    <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Match Score</span>
                 </div>
            )}
        </div>

        {!hasSearched && (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/30 animate-fade-in">
                <div className="p-6 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
                    <BrainCircuit className="w-16 h-16 text-indigo-100" />
                </div>
                <h4 className="font-bold text-slate-600 text-lg">Ready to optimize</h4>
                <p className="text-sm mt-2 text-center max-w-sm leading-relaxed">The AI will analyze your entire workforce against the specific technical requirements of the selected machine.</p>
            </div>
        )}

        {hasSearched && !loading && recommendations.length === 0 && (
             <div className="p-8 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100 flex items-center gap-5 animate-fade-in shadow-sm">
                <div className="p-3 bg-amber-100 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                    <h4 className="font-bold text-lg">No Qualified Operators Found</h4>
                    <p className="text-sm mt-1 text-amber-700">Consider lowering the machine requirements or initiating a training plan for available staff.</p>
                </div>
             </div>
        )}

        {sortedRecommendations.map((rec, index) => {
          const op = operators.find(o => o.id === rec.operatorId);
          if (!op) return null;

          const isTopMatch = index === 0;
          const isCertified = op.certifications.length > 0 && op.certifications.every(c => c.isValid);
          
          return (
            <div key={rec.operatorId} className={`relative bg-white p-0 rounded-2xl border transition-all duration-300 group animate-slide-up overflow-hidden
                ${isTopMatch ? 'border-indigo-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-indigo-500/20' : 'border-slate-200/80 shadow-sm hover:border-indigo-200 hover:shadow-md'}
            `} style={{ animationDelay: `${index * 0.1}s` }}>
              
              {isTopMatch && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              )}

              <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                {/* Profile Section */}
                <div className="flex-shrink-0 flex flex-col items-center gap-4 min-w-[160px]">
                  <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <div className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity ${rec.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <img src={op.avatar} alt={op.name} className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                      <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md z-10">
                        <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${rec.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                             {rec.score > 80 ? 'A' : 'B'}
                        </div>
                      </div>
                  </div>
                  <div className="text-center w-full">
                      <h3 className="font-bold text-slate-900 truncate text-lg">{op.name}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{op.role}</p>
                  </div>
                  <div className="flex gap-2 justify-center w-full">
                      <span className="text-[10px] px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 font-bold uppercase">{op.shift}</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6">
                  {/* Suitability Score Bar */}
                  <div>
                      <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">AI Match Confidence</span>
                          <span className={`text-2xl font-black ${rec.score > 85 ? 'text-emerald-600' : rec.score > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {rec.score}<span className="text-sm text-slate-400 font-medium ml-1">%</span>
                          </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${rec.score > 85 ? 'bg-emerald-500' : rec.score > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${rec.score}%` }}
                          >
                             <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div> 
                          </div>
                      </div>
                  </div>

                  {/* AI Reasoning */}
                  <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-100 relative transition-colors">
                      <div className="absolute top-5 left-0 w-1 h-8 bg-indigo-400 rounded-r"></div>
                      <p className="text-sm text-slate-700 leading-relaxed pl-3 italic font-medium">
                          "{rec.reasoning}"
                      </p>
                  </div>
                  
                  {/* Footer Actions & Badges */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2">
                     <div className="flex flex-wrap gap-2">
                        {rec.score >= 90 && (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Top Talent
                            </span>
                        )}
                        {isCertified ? (
                             <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                <CheckCircle className="w-3 h-3" /> Fully Certified
                             </span>
                        ) : (
                             <span className="flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                                <AlertTriangle className="w-3 h-3" /> Cert Pending
                             </span>
                        )}
                        
                        {rec.missingSkills.length > 0 && (
                             <span className="flex items-center gap-1.5 text-[10px] text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 font-bold">
                                <span>Missing: {rec.missingSkills.slice(0, 1).join(', ')}</span>
                            </span>
                        )}
                     </div>
                    
                    <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 group/btn">
                        Assign Operator <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};