import React from 'react';
import { BrainCircuit, LayoutGrid, Users, Plug, CheckCircle } from './Icons';

export const About: React.FC = () => {
  return (
    <div className="h-full animate-fade-in flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500"></div>
         <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
         
         <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
               <BrainCircuit className="w-8 h-8 text-white" />
            </div>
         </div>
         
         <h1 className="text-3xl font-bold text-slate-900 mb-3">Vaibhora <span className="text-indigo-600">v1.0</span></h1>
         <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Skill. Insight. Evolution.
         </p>
         <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
            The next-generation workforce intelligence platform. We replace static spreadsheets with a dynamic, AI-powered system that ensures the right operator is on the right machine, every shift.
         </p>
      </div>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
             <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <LayoutGrid className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Live Skill Matrix</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
                A visual, real-time map of your shopfloor's capabilities. Drag, drop, and click to update proficiency levels (L0-L4) instantly. No more version control nightmares with Excel files.
             </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
             <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <BrainCircuit className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Assign AI</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
                Our Gemini-powered engine analyzes machine requirements against operator profiles to recommend the best assignments. It considers certification validity, skill gaps, and even shift availability.
             </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
             <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors">
                <CheckCircle className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Compliance & Certs</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
                Never miss an audit. Track expiring certifications automatically. The system alerts you 30 days in advance, ensuring your workforce is always compliant and safety-ready.
             </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
             <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <Plug className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Enterprise Connectors</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly integrate with SAP, Salesforce, PostgreSQL, and other enterprise systems. Sync operator data and machine status in real-time using our robust integration layer.
             </p>
          </div>
      </div>

      <div className="text-center pt-4 pb-8">
         <p className="text-sm text-slate-400 font-medium">
            © 2025 Vaibhora — Workforce Intelligence Platform. All rights reserved.
         </p>
      </div>

    </div>
  );
};