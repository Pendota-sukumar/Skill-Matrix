import React, { useState } from 'react';
import { LayoutGrid, Users, BrainCircuit, Bell, LogOut, Menu, ChevronDown, Search, Plug, Info, Grid3x3, BookOpen, Briefcase, FileText, PieChart, Clock, CreditCard, LifeBuoy, ShieldCheck, Award, UserPlus } from './components/Icons';
import { SkillMatrix } from './components/SkillMatrix';
import { Dashboard } from './components/Dashboard';
import { AssignmentAssistant } from './components/AssignmentAssistant';
import { Integrations } from './components/Integrations';
import { About } from './components/About';
import { Copilot } from './components/Copilot';
import { Operator, Skill, Machine, SkillLevel, ModuleId } from './types';
import { ModuleSelector, AVAILABLE_MODULES } from './components/ModuleSelector';

// --- MOCK DATA ---
const INITIAL_SKILLS: Skill[] = [
  { id: 's1', name: 'CNC Milling', category: 'Machine', description: 'Operate 3-axis CNC mill' },
  { id: 's2', name: 'Lathe Ops', category: 'Machine', description: 'Manual lathe operation' },
  { id: 's3', name: 'QC Inspection', category: 'Quality', description: 'Use calipers and micrometers' },
  { id: 's4', name: 'Forklift', category: 'Safety', description: 'Standard forklift license' },
  { id: 's5', name: 'Assembly', category: 'Process', description: 'Manual assembly line' },
  { id: 's6', name: 'Welding TIG', category: 'Process', description: 'TIG welding for aluminum' },
];

const INITIAL_MACHINES: Machine[] = [
  { id: 'm1', name: 'Haas VF-2', type: 'CNC Mill', requiredSkills: [{ skillId: 's1', minLevel: 3 }, { skillId: 's3', minLevel: 2 }], status: 'Operational' },
  { id: 'm2', name: 'Doosan Puma', type: 'Lathe', requiredSkills: [{ skillId: 's2', minLevel: 3 }, { skillId: 's3', minLevel: 2 }], status: 'Operational' },
  { id: 'm3', name: 'Assembly Line A', type: 'Assembly', requiredSkills: [{ skillId: 's5', minLevel: 2 }], status: 'Operational' },
  { id: 'm4', name: 'Warehouse Loader', type: 'Logistics', requiredSkills: [{ skillId: 's4', minLevel: 4 }], status: 'Operational' },
];

const INITIAL_OPERATORS: Operator[] = [
  { 
    id: 'op1', name: 'John Doe', role: 'Senior Machinist', shift: 'Morning', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: { 's1': 4, 's2': 3, 's3': 4, 's4': 2, 's5': 1, 's6': 0 },
    certifications: [{ id: 'c1', name: 'OSHA 30', issuedDate: '2023-01-01', expiryDate: '2025-01-01', isValid: true }]
  },
  { 
    id: 'op2', name: 'Jane Smith', role: 'Line Lead', shift: 'Morning', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: { 's1': 1, 's2': 1, 's3': 4, 's4': 0, 's5': 4, 's6': 0 },
    certifications: []
  },
  { 
    id: 'op3', name: 'Mike Johnson', role: 'Welder', shift: 'Evening', 
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: { 's1': 0, 's2': 0, 's3': 2, 's4': 3, 's5': 2, 's6': 4 },
    certifications: [{ id: 'c2', name: 'AWS D1.1', issuedDate: '2023-06-01', expiryDate: '2024-06-01', isValid: true }] // Expiring soon
  },
  { 
    id: 'op4', name: 'Sarah Lee', role: 'Apprentice', shift: 'Evening', 
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: { 's1': 2, 's2': 1, 's3': 1, 's4': 0, 's5': 2, 's6': 0 },
    certifications: []
  },
  {
      id: 'op5', name: 'Chris Evans', role: 'Logistics Lead', shift: 'Night',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skills: { 's1': 0, 's2': 0, 's3': 0, 's4': 4, 's5': 1, 's6': 0 },
      certifications: [{ id: 'c3', name: 'Forklift Cert', issuedDate: '2022-05-15', expiryDate: '2025-05-15', isValid: true }]
  }
];

// Changed to string to allow arbitrary view keys for generic modules
type ViewState = string;

// Generic Dashboard for Simulated Modules
const GenericModuleDashboard = ({ moduleName, icon: Icon, features, currentView }: { moduleName: string, icon: any, features: string[], currentView: string }) => {
    
    // Determine the title based on the active sidebar selection
    const viewTitle = currentView === 'dashboard' 
        ? `${moduleName} Dashboard` 
        : currentView.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Icon className="w-64 h-64 text-slate-900" />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                            <Icon className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{viewTitle}</h1>
                    </div>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        {currentView === 'dashboard' 
                            ? `This is the dedicated enterprise module for ${moduleName.toLowerCase()}. Manage your specific workflows, compliance, and reporting here.`
                            : `Manage ${viewTitle} settings and records. This section is currently in active simulation mode.`
                        }
                    </p>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                <PieChart className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">Active</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{feature}</h3>
                        <p className="text-sm text-slate-500">View real-time analytics and manage {feature.toLowerCase()} records.</p>
                    </div>
                ))}
            </div>
            
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <p className="font-semibold">Workspace Context Loaded: {viewTitle}</p>
                <p className="text-sm">Connected to Vaibhora Enterprise Backend</p>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeModule, setActiveModule] = useState<ModuleId>('workforce');
  const [isModuleSelectorOpen, setIsModuleSelectorOpen] = useState(false);
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [skills] = useState<Skill[]>(INITIAL_SKILLS);
  const [machines] = useState<Machine[]>(INITIAL_MACHINES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleUpdateSkill = (operatorId: string, skillId: string, level: SkillLevel) => {
    setOperators(prev => prev.map(op => {
      if (op.id === operatorId) {
        return { ...op, skills: { ...op.skills, [skillId]: level } };
      }
      return op;
    }));
  };

  const activeModuleConfig = AVAILABLE_MODULES.find(m => m.id === activeModule) || AVAILABLE_MODULES[0];

  const NavItem = ({ view, icon: Icon, label, onClick }: { view?: ViewState; icon: any; label: string, onClick?: () => void }) => {
    const isActive = view ? currentView === view : false;
    return (
        <button 
          onClick={() => {
              if (onClick) onClick();
              if (view) {
                  setCurrentView(view);
                  setIsSidebarOpen(false);
              }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative rounded-lg mx-2 mb-1 w-[calc(100%-16px)]
            ${isActive 
              ? 'bg-indigo-600/10 text-indigo-400' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
        >
          {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
          )}
          <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
          <span className={`font-medium text-sm tracking-wide transition-colors ${isActive ? 'text-white' : ''}`}>{label}</span>
        </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      
      <ModuleSelector 
        isOpen={isModuleSelectorOpen} 
        onClose={() => setIsModuleSelectorOpen(false)}
        activeModule={activeModule}
        onSelectModule={(id) => {
            setActiveModule(id);
            setCurrentView('dashboard'); // Reset view when switching modules
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white flex flex-col transition-transform duration-300 shadow-2xl lg:shadow-none border-r border-slate-800
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-24 flex items-center px-6 border-b border-slate-800/60 bg-[#0F172A] relative z-20 gap-3.5">
          <div className="w-10 h-10 flex-shrink-0">
            {/* Custom SVG Logo: Monitor with Swoosh & Star */}
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                {/* Computer Monitor */}
                <rect x="15" y="25" width="70" height="45" rx="4" fill="#E2E8F0" opacity="0.9" />
                <path d="M50 70 L50 85 M35 85 L65 85" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
                
                {/* Swoosh */}
                <path d="M10 50 C 20 100, 80 100, 95 20" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                
                {/* Star */}
                <path d="M95 20 L97 15 L99 20 L104 20 L100 23 L101 28 L97 25 L93 28 L94 23 L90 20 Z" fill="#10B981" />
            </svg>
          </div>
          <div className="flex flex-col">
              <h1 className="font-bold text-2xl leading-none tracking-tight text-white">Vaibhora</h1>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wide mt-1">Skill. Insight. Evolution.</p>
          </div>
        </div>
        
        {/* App Switcher Button */}
        <div className="p-4 border-b border-slate-800/60">
            <button 
                onClick={() => setIsModuleSelectorOpen(true)}
                className="w-full bg-slate-800/50 hover:bg-slate-800 hover:text-white text-slate-300 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 transition-all shadow-sm group"
            >
                <div className={`p-1.5 rounded-lg ${activeModuleConfig.color}`}>
                    <activeModuleConfig.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current App</div>
                    <div className="text-sm font-bold truncate group-hover:text-indigo-300 transition-colors">{activeModuleConfig.name}</div>
                </div>
                <Grid3x3 className="w-5 h-5 text-slate-500 group-hover:text-white" />
            </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          
          {/* DYNAMIC MODULE NAVIGATION */}
          {activeModule === 'workforce' ? (
              <>
                <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Workspace</div>
                <NavItem view="dashboard" icon={LayoutGrid} label="Dashboard" />
                <NavItem view="matrix" icon={Users} label="Skill Matrix" />
                <NavItem view="assistant" icon={BrainCircuit} label="Smart Assign" />
                
                <div className="my-6 border-t border-slate-800/60 mx-6"></div>
                
                <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Configuration</div>
                <NavItem view="integrations" icon={Plug} label="Connectors" />
                <NavItem view="about" icon={Info} label="System Info" />
              </>
          ) : activeModule === 'learning' ? (
              <>
                 <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">My Learning</div>
                 <NavItem view="dashboard" icon={LayoutGrid} label="LMS Dashboard" />
                 <NavItem view="course-catalog" icon={BookOpen} label="Course Catalog" />
                 <NavItem view="my-certifications" icon={Award} label="Certifications" />
                 <div className="my-6 border-t border-slate-800/60 mx-6"></div>
                 <NavItem view="transcripts" icon={FileText} label="Transcripts" />
              </>
          ) : activeModule === 'recruiting' ? (
              <>
                 <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hiring</div>
                 <NavItem view="dashboard" icon={LayoutGrid} label="Pipeline Overview" />
                 <NavItem view="job-requisitions" icon={Briefcase} label="Job Requisitions" />
                 <NavItem view="candidates" icon={UserPlus} label="Candidates" />
                 <NavItem view="offers" icon={FileText} label="Offer Management" />
              </>
          ) : activeModule === 'core-hr' ? (
              <>
                 <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">People</div>
                 <NavItem view="dashboard" icon={LayoutGrid} label="HR Overview" />
                 <NavItem view="directory" icon={Users} label="Directory" />
                 <NavItem view="org-chart" icon={Grid3x3} label="Org Chart" />
                 <NavItem view="compliance" icon={ShieldCheck} label="Compliance" />
              </>
          ) : (
              // Default Generic Nav
              <>
                 <div className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Module Menu</div>
                 <NavItem view="dashboard" icon={LayoutGrid} label="Overview" />
                 <NavItem view="reports" icon={PieChart} label="Reports" />
                 <NavItem view="records" icon={FileText} label="Records" />
              </>
          )}

        </nav>
        
        {/* User Profile Snippet */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0B1120]">
            <div 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-700/80 group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
                <div className="relative">
                    <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User" 
                        className="w-10 h-10 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-colors object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B1120] shadow-sm"></div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-bold truncate text-slate-200 group-hover:text-white transition-colors">Alex Morgan</div>
                    <div className="text-xs text-slate-500 truncate group-hover:text-indigo-400 transition-colors font-medium">Plant Manager</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
                <div className="absolute bottom-20 left-4 right-4 bg-[#1E293B] border border-slate-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-up z-50 ring-1 ring-white/10">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">alex.morgan@factory.ai</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/20 rounded-lg transition-colors flex items-center gap-2 group">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-indigo-400"></span>
                            My Profile
                        </button>
                        <button className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/20 rounded-lg transition-colors flex items-center gap-2 group">
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-indigo-400"></span>
                            Settings
                        </button>
                        <div className="h-px bg-slate-700/50 my-1"></div>
                        <button className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2">
                           <LogOut className="w-4 h-4" /> <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar - Glassmorphism */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 z-30 sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                        {activeModule === 'workforce' ? (
                            currentView === 'assistant' ? 'Smart Assignment' : 
                            currentView === 'matrix' ? 'Skill Matrix' : 
                            currentView === 'integrations' ? 'Integrations' : 
                            currentView === 'about' ? 'System Information' : 'Dashboard'
                        ) : activeModuleConfig.name}
                    </h2>
                     <p className="text-[11px] text-slate-500 font-medium">
                        {activeModule === 'workforce' 
                            ? (currentView === 'dashboard' ? 'Overview & Metrics' : 'Workforce Management') 
                            : 'Enterprise Module'}
                     </p>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {/* Search Bar (Hidden on mobile) */}
                <div className="hidden md:flex items-center relative group">
                    <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search operators, skills, or machines..." 
                        className="pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 focus:w-72 transition-all placeholder:text-slate-400 text-slate-700 shadow-sm"
                    />
                </div>

                <div className="h-8 w-px bg-slate-200/80 hidden md:block"></div>

                <div className="flex items-center gap-3">
                   <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full transition-all focus:outline-none">
                       <Bell className="w-5 h-5" />
                       <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                   </button>
                   
                   <div className="bg-white/50 px-3 py-1.5 rounded-full border border-slate-200/80 hidden sm:flex items-center gap-2 shadow-sm backdrop-blur-sm">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-xs font-semibold text-slate-600">System Online</span>
                   </div>
                </div>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-[#F8FAFC] flex flex-col scroll-smooth">
          <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <div className="h-full">
                
                {/* WORKFORCE MODULE (MAIN APP) */}
                {activeModule === 'workforce' && (
                    <>
                        {currentView === 'dashboard' && (
                            <Dashboard operators={operators} skills={skills} />
                        )}
                        
                        {currentView === 'matrix' && (
                            <SkillMatrix 
                                operators={operators} 
                                skills={skills} 
                                machines={machines}
                                onUpdateSkill={handleUpdateSkill}
                            />
                        )}

                        {currentView === 'assistant' && (
                            <AssignmentAssistant 
                                machines={machines} 
                                operators={operators} 
                                skills={skills} 
                            />
                        )}

                        {currentView === 'integrations' && (
                            <Integrations />
                        )}

                        {currentView === 'about' && (
                            <About />
                        )}
                    </>
                )}

                {/* OTHER MODULE SIMULATIONS */}
                {activeModule === 'core-hr' && (
                    <GenericModuleDashboard 
                        moduleName="Core HR" 
                        icon={ShieldCheck} 
                        features={['Employee Directory', 'Organizational Chart', 'Onboarding Workflows', 'Document Management']} 
                        currentView={currentView}
                    />
                )}
                {activeModule === 'talent' && (
                    <GenericModuleDashboard 
                        moduleName="Talent Management" 
                        icon={Award} 
                        features={['Performance Reviews', 'Goal Tracking', 'Succession Planning', '360 Feedback']} 
                        currentView={currentView}
                    />
                )}
                {activeModule === 'learning' && (
                    <GenericModuleDashboard 
                        moduleName="Learning (LMS)" 
                        icon={BookOpen} 
                        features={['Course Catalog', 'Compliance Tracking', 'Skill Paths', 'Instructor Led Training']} 
                        currentView={currentView}
                    />
                )}
                {activeModule === 'recruiting' && (
                    <GenericModuleDashboard 
                        moduleName="Recruiting" 
                        icon={Briefcase} 
                        features={['Job Requisitions', 'Candidate Pipeline', 'Career Site', 'Interview Scheduling']} 
                        currentView={currentView}
                    />
                )}
                {activeModule === 'time' && (
                    <GenericModuleDashboard 
                        moduleName="Time & Absence" 
                        icon={Clock} 
                        features={['Timesheets', 'Shift Scheduling', 'Time Off Requests', 'Clock In/Out']} 
                        currentView={currentView}
                    />
                )}
                {activeModule === 'payroll' && (
                    <GenericModuleDashboard 
                        moduleName="Payroll" 
                        icon={CreditCard} 
                        features={['Pay Slips', 'Tax Documents', 'Benefits Admin', 'Compensation Planning']} 
                        currentView={currentView}
                    />
                )}
                 {activeModule === 'service' && (
                    <GenericModuleDashboard 
                        moduleName="Service Desk" 
                        icon={LifeBuoy} 
                        features={['HR Case Management', 'IT Tickets', 'Knowledge Base', 'SLA Tracking']} 
                        currentView={currentView}
                    />
                )}

            </div>
          </div>

           {/* Footer */}
           <footer className="py-6 text-center border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-slate-400 font-medium">
                        &copy; 2025 Vaibhora — Workforce Intelligence Platform
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">Terms of Service</a>
                        <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">Support</a>
                    </div>
                </div>
           </footer>
        </main>
        
        {/* Floating AI Copilot */}
        <Copilot operators={operators} skills={skills} machines={machines} />

      </div>
    </div>
  );
};

export default App;