import React, { useMemo } from 'react';
import { Operator, Skill } from '../types';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { AlertTriangle, CheckCircle, Users, BrainCircuit } from './Icons';

interface DashboardProps {
    operators: Operator[];
    skills: Skill[];
}

export const Dashboard: React.FC<DashboardProps> = ({ operators, skills }) => {
    
    // Calculate Skill Level Distribution
    const skillDistribution = useMemo(() => {
        const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
        operators.forEach(op => {
            Object.values(op.skills).forEach(val => {
                const level = val as number;
                if (level >= 0 && level <= 4) counts[level as 0|1|2|3|4]++;
            });
        });
        return [
            { name: 'Expert (L4)', value: counts[4] },
            { name: 'Independent (L3)', value: counts[3] },
            { name: 'Supervised (L2)', value: counts[2] },
            { name: 'Novice (L1)', value: counts[1] },
            { name: 'No Skill (L0)', value: counts[0] },
        ];
    }, [operators]);

    // Calculate Expiring Certifications
    const expiringCerts = useMemo(() => {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);

        const expiring: {opName: string, certName: string, daysLeft: number}[] = [];

        operators.forEach(op => {
            op.certifications.forEach(cert => {
                const expiry = new Date(cert.expiryDate);
                if (expiry <= nextMonth && expiry >= today) {
                    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
                    expiring.push({ opName: op.name, certName: cert.name, daysLeft });
                }
            });
        });
        return expiring;
    }, [operators]);

    // Calculate Average Skill Level per Category
    const categoryAverages = useMemo(() => {
        const catTotals: Record<string, {sum: number, count: number}> = {};
        
        skills.forEach(skill => {
            if (!catTotals[skill.category]) catTotals[skill.category] = { sum: 0, count: 0 };
        });

        operators.forEach(op => {
            Object.entries(op.skills).forEach(([skillId, val]) => {
                const level = val as number;
                const skill = skills.find(s => s.id === skillId);
                if (skill && catTotals[skill.category]) {
                    catTotals[skill.category].sum += level;
                    catTotals[skill.category].count += 1;
                }
            });
        });

        return Object.entries(catTotals).map(([cat, data]) => ({
            name: cat,
            avg: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : 0
        }));
    }, [operators, skills]);

    // SaaS Palette Colors: Expert(Green) -> Independent(Blue) -> Supervised(Amber) -> Novice(Orange) -> None(Gray)
    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#94A3B8'];

    return (
        <div className="space-y-6 animate-fade-in text-slate-800">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Operators Card */}
                <div title="Count of active operators in plant" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-100/50 transition-colors"></div>
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Workforce</p>
                            <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">{operators.length}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                </span>
                                <span className="text-xs text-slate-400 font-medium">in current plant</span>
                            </div>
                        </div>
                        <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Avg Skill Level Card */}
                <div title="Weighted average skill score" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-emerald-100/50 transition-colors"></div>
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg Proficiency</p>
                            <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                                { (skillDistribution.reduce((acc, curr) => {
                                    const levelMap: Record<string, number> = { 'Expert (L4)': 4, 'Independent (L3)': 3, 'Supervised (L2)': 2, 'Novice (L1)': 1, 'No Skill (L0)': 0 };
                                    return acc + (curr.value * levelMap[curr.name]);
                                }, 0) / (operators.length * skills.length)).toFixed(1) }
                                <span className="text-xl font-medium text-slate-400"> / 4.0</span>
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                                    +12% vs last month
                                </span>
                            </div>
                        </div>
                        <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Expiring Certs Card */}
                <div title="Certificates requiring attention soon" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-amber-100/50 transition-colors"></div>
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Compliance Risks</p>
                            <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">{expiringCerts.length}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                                    Action Required
                                </span>
                                <span className="text-xs text-slate-400 font-medium">next 30 days</span>
                            </div>
                        </div>
                        <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {/* Skill Distribution Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-[450px] flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Skill Level Breakdown</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Distribution of competency across the plant</p>
                        </div>
                        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View Details</button>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={skillDistribution}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {skillDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }} 
                                    itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '13px' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle" 
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Strength Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-[450px] flex flex-col">
                     <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Competency by Category</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Average skill proficiency (0-4.0)</p>
                        </div>
                        <button className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">Export</button>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryAverages} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} 
                                    dy={15} 
                                />
                                <YAxis 
                                    domain={[0, 4]} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 11}} 
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                    labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
                                />
                                <Bar 
                                    dataKey="avg" 
                                    fill="#4F46E5" 
                                    radius={[6, 6, 0, 0]} 
                                    barSize={48} 
                                    animationDuration={1500} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Expiring Certs List */}
            {expiringCerts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-red-600 shadow-sm">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Critical Compliance Alerts</h3>
                                <p className="text-xs text-slate-500 mt-0.5">The following certifications require immediate renewal.</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 shadow-sm">
                            {expiringCerts.length} Items
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Operator</th>
                                    <th className="px-6 py-4">Certification</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {expiringCerts.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {item.opName.charAt(0)}
                                            </div>
                                            {item.opName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{item.certName}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 group-hover:bg-red-100 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                Expires in {item.daysLeft} days
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs border border-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow bg-white">
                                                Schedule Renewal
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};