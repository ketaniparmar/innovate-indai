// src/modules/Dashboard.jsx
import React, { useMemo } from 'react';
import { 
  BarChart3, TrendingUp, PieChart, Activity, ShieldAlert, Target, 
  DollarSign, Users, Layers, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { generatePortfolioAnalytics } from '../utils/analyticsEngine';

const formatINR = (val) => `₹${(val / 10000000).toFixed(2)} Cr`;
const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl hover:border-blue-500/30 transition-all duration-500";

export default function Dashboard({ adminProjects, setActiveTab }) {
  const analytics = useMemo(() => generatePortfolioAnalytics(adminProjects), [adminProjects]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white flex items-center gap-3">
            <BarChart3 className="text-[#D4AF37] w-8 h-8 md:w-10 md:h-10" /> Portfolio <span className="text-[#D4AF37]">Intelligence</span>
          </h2>
          <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Macro-level predictive analytics & pipeline visibility</p>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${GLOW_CARD} border-l-4 border-l-blue-500`}>
          <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><Target size={14}/> Total Pipeline</p>
          <p className="text-4xl font-black text-white">{analytics.totalProjects}</p>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{analytics.totalBeds} Total Beds Planned</p>
        </div>
        <div className={`${GLOW_CARD} border-l-4 border-l-[#D4AF37]`}>
          <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><DollarSign size={14}/> Estimated CAPEX</p>
          <p className="text-4xl font-black text-[#D4AF37]">{formatINR(analytics.totalCapex)}</p>
          <p className="text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest">Across all active models</p>
        </div>
        <div className={`${GLOW_CARD} border-l-4 border-l-emerald-500`}>
          <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14}/> Avg. Viability (DSCR)</p>
          <p className="text-4xl font-black text-emerald-400">{analytics.avgDscr.toFixed(2)}x</p>
          <p className="text-[10px] text-emerald-400/50 mt-2 font-bold uppercase tracking-widest">Healthy Portfolio Status</p>
        </div>
        <div className={`${GLOW_CARD} border-l-4 border-l-purple-500`}>
          <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><PieChart size={14}/> Projected EBITDA</p>
          <p className="text-4xl font-black text-purple-400">{analytics.avgEbitdaMargin}%</p>
          <p className="text-[10px] text-purple-400/50 mt-2 font-bold uppercase tracking-widest">Average Margin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cost Distribution Chart (Built with Tailwind) */}
        <div className={`${GLOW_CARD} lg:col-span-2`}>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><Layers className="text-[#D4AF37]"/> Portfolio CAPEX Distribution</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-white/70 mb-2"><span>Civil & Infrastructure (45%)</span> <span>{formatINR(analytics.costDistribution.civil)}</span></div>
              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full" style={{width: '45%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-white/70 mb-2"><span>Medical Equipment (35%)</span> <span>{formatINR(analytics.costDistribution.equipment)}</span></div>
              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{width: '35%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-white/70 mb-2"><span>MEP & Specialized Systems (20%)</span> <span>{formatINR(analytics.costDistribution.mep)}</span></div>
              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden"><div className="bg-amber-500 h-full rounded-full" style={{width: '20%'}}></div></div>
            </div>
          </div>
        </div>

        {/* Predictive Risk Analytics */}
        <div className={GLOW_CARD}>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><Activity className="text-[#D4AF37]"/> Predictive Risk Scoring</h4>
          <div className="flex items-end justify-between mb-8">
            <div className="w-1/3 flex flex-col items-center gap-2">
              <div className="w-full h-24 bg-red-500/20 rounded-t-xl relative flex items-end justify-center pb-2 border-b border-red-500/50"><span className="text-2xl font-black text-red-500">{analytics.riskProfile.high}</span></div>
              <span className="text-[9px] uppercase tracking-widest font-black text-white/50">High Risk</span>
            </div>
            <div className="w-1/3 flex flex-col items-center gap-2">
              <div className="w-full h-32 bg-amber-500/20 rounded-t-xl relative flex items-end justify-center pb-2 border-b border-amber-500/50"><span className="text-2xl font-black text-amber-500">{analytics.riskProfile.medium}</span></div>
              <span className="text-[9px] uppercase tracking-widest font-black text-white/50">Medium</span>
            </div>
            <div className="w-1/3 flex flex-col items-center gap-2">
              <div className="w-full h-40 bg-emerald-500/20 rounded-t-xl relative flex items-end justify-center pb-2 border-b border-emerald-500/50"><span className="text-2xl font-black text-emerald-400">{analytics.riskProfile.low}</span></div>
              <span className="text-[9px] uppercase tracking-widest font-black text-white/50">Low Risk</span>
            </div>
          </div>
          <p className="text-xs text-white/60 leading-relaxed text-center">Projects with a Bank Approval Score &lt; 60 are flagged as High Risk due to poor DSCR or low equity.</p>
        </div>

      </div>

      {/* Project Log Table */}
      <div className={`${GLOW_CARD} !p-0 overflow-hidden`}>
         <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#010810]/50">
           <h3 className="text-lg font-black uppercase tracking-widest text-[#D4AF37]">Recent Project Feasibility Logs</h3>
           <button onClick={() => setActiveTab('estimator')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors text-white">Create New</button>
         </div>
         {analytics.raw.length === 0 ? (
           <div className="p-10 text-center text-white/40 font-bold uppercase text-xs tracking-widest">No projects saved yet.</div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left whitespace-nowrap">
               <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/50">
                 <tr>
                   <th className="p-6">Client / Project</th>
                   <th className="p-6">Scale</th>
                   <th className="p-6 text-right">Est. CAPEX</th>
                   <th className="p-6 text-center">AI Risk Status</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y divide-white/5">
                 {analytics.raw.slice(0, 5).map((p, idx) => {
                   const loanScore = p.engine?.loanScore || 0;
                   const isHighRisk = loanScore < 60;
                   const isLowRisk = loanScore >= 80;
                   return (
                     <tr key={idx} className="hover:bg-white/5 transition-colors cursor-pointer">
                       <td className="p-6">
                         <div className="font-black text-white">{p.project_name || `Project Protocol ${idx + 1}`}</div>
                         <div className="text-[10px] uppercase tracking-widest mt-1 text-white/40">{new Date(p.created_at).toLocaleDateString()}</div>
                       </td>
                       <td className="p-6">
                         <div className="font-black text-[#D4AF37]">{p.config?.beds} Beds</div>
                         <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mt-1">Multi-Specialty</div>
                       </td>
                       <td className="p-6 font-black text-white text-right">{formatINR(p.engine?.totalProjectCost || 0)}</td>
                       <td className="p-6 text-center">
                         {isLowRisk ? (
                           <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={12}/> Bankable</span>
                         ) : isHighRisk ? (
                           <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest"><ShieldAlert size={12}/> High Risk</span>
                         ) : (
                           <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest"><AlertTriangle size={12}/> Needs Optimization</span>
                         )}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
      </div>

    </div>
  );
}