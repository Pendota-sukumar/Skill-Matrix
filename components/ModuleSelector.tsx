import React from 'react';
import { 
    BrainCircuit, ShieldCheck, Award, BookOpen, Briefcase, 
    Clock, CreditCard, LifeBuoy, X, Grid3x3
} from './Icons';
import { EnterpriseModule, ModuleId } from '../types';

export const AVAILABLE_MODULES: EnterpriseModule[] = [
    { 
        id: 'workforce', 
        name: 'Workforce Intelligence', 
        description: 'Skill matrix, operator assignments, and factory analytics.', 
        icon: BrainCircuit,
        color: 'bg-indigo-600'
    },
    { 
        id: 'core-hr', 
        name: 'Core HR & Profiles', 
        description: 'Employee records, org charts, and onboarding flows.', 
        icon: ShieldCheck,
        color: 'bg-blue-600'
    },
    { 
        id: 'talent', 
        name: 'Talent Management', 
        description: 'Performance reviews, goals, and succession planning.', 
        icon: Award,
        color: 'bg-emerald-600'
    },
    { 
        id: 'learning', 
        name: 'Learning (LMS)', 
        description: 'Course catalogs, compliance training, and skill development.', 
        icon: BookOpen,
        color: 'bg-amber-600'
    },
    { 
        id: 'recruiting', 
        name: 'Recruiting', 
        description: 'Job requisitions, candidate pipelines, and offer management.', 
        icon: Briefcase,
        color: 'bg-rose-600'
    },
    { 
        id: 'time', 
        name: 'Time & Absence', 
        description: 'Shift scheduling, timesheets, and leave requests.', 
        icon: Clock,
        color: 'bg-cyan-600'
    },
    { 
        id: 'payroll', 
        name: 'Payroll', 
        description: 'Pay slips, tax documents, and compensation planning.', 
        icon: CreditCard,
        color: 'bg-green-600'
    },
    { 
        id: 'service', 
        name: 'Service Desk', 
        description: 'IT tickets, HR cases, and knowledge base.', 
        icon: LifeBuoy,
        color: 'bg-purple-600'
    }
];

interface ModuleSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    activeModule: ModuleId;
    onSelectModule: (id: ModuleId) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ isOpen, onClose, activeModule, onSelectModule }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-80 sm:w-96 bg-[#F8FAFC] shadow-2xl h-full flex flex-col animate-[shimmer_0.3s_ease-out]">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Grid3x3 className="w-6 h-6 text-slate-700" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">App Launcher</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC] custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {AVAILABLE_MODULES.map((module) => {
                            const isActive = activeModule === module.id;
                            const Icon = module.icon;
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => {
                                        onSelectModule(module.id);
                                        onClose();
                                    }}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200 group text-center h-full
                                        ${isActive 
                                            ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20' 
                                            : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 hover:-translate-y-1'}
                                    `}
                                >
                                    <div className={`p-3.5 rounded-xl text-white shadow-sm transition-transform group-hover:scale-110 ${module.color}`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-sm font-bold ${isActive ? 'text-indigo-600' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                                            {module.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                                            {module.description}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                        <p className="text-xs text-indigo-700 font-medium">
                            Looking for more apps?
                            <br/>
                            <a href="#" className="underline hover:text-indigo-800">Visit the Enterprise Marketplace</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};