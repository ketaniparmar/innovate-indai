import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Zap, ArrowRight, Activity, 
  Lock, PieChart, FileText, Grid, List, MessageCircle,
  BrainCircuit, TrendingUp, Target, LayoutDashboard
} from 'lucide-react';

export default function ProjectDashboard({ config, setConfig, clientDetails, setClientDetails, engine, handleTabClick, session }) {
  // If they already have a project name (not default), skip onboarding and show the dashboard (Step 4)
  const isAlreadySetup = clientDetails.projectName !== "New Greenfield Hospital" && clientDetails.projectName !== "";
  const [step, setStep] = useState(isAlreadySetup ? 4 : 1);
  const [loadingText, setLoadingText] = useState("");

  const handleSetupComplete = (e) => {
    e.preventDefault();
    setStep(3); // Show AI Loader
    
    const states = [
      "Analyzing regional healthcare data...", 
      "Calculating tier-specific construction costs...", 
      "Structuring compliance roadmap...",
      "Initializing Project Command Center..."
    ];
    
    let i = 0;
    setLoadingText(states[0]);
    const timer = setInterval(() => {
      i++;
      if (i < states.length) {
        setLoadingText(states[i]);
      } else {
        clearInterval(timer);
        setStep(4); // Show Full Dashboard
      }
    }, 1000);
  };

  // ------------------------------------------------------------------------
  // STEP 1: ONBOARDING INTENT
  // ------------------------------------------------------------------------
  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
             <Target className="text-[#D4AF37] w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Initialize <span className="text-[#D4AF37]">Workspace</span></h2>
          <p className="text-white/50 text-sm font-bold uppercase tracking-widest">What is your primary objective today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Estimate Hospital Cost", desc: "Calculate Total CAPEX & ROI", icon: PieChart },
            { title: "Generate Master BOQ", desc: "Equipment & Civil Breakdown", icon: List },
            { title: "Draft Bank-Ready DPR", desc: "For Loan Syndication", icon: FileText },
            { title: "Plan Spatial Layouts", desc: "NABH Compliant Zoning", icon: Grid }
          ].map((item, idx) => (
            <div key={idx} onClick={() => setStep(2)} className="bg-[#051626] border border-white/10 hover:border-[#D4AF37]/50 p-6 rounded-2xl cursor-pointer group hover:-translate-y-1 transition-all shadow-xl">
              <item.icon className="w-8 h-8 text-[#D4AF37] mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">{item.title}</h3>
              <p className="text-xs text-white/50 font-bold">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // STEP 2: PROJECT PARAMETERS
  // ------------------------------------------------------------------------
  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="bg-[#051626] border border-[#D4AF37]/30 rounded-[30px] p-8 md:p-12 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative overflow-hidden">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white">Project <span className="text-[#D4AF37]">Parameters</span></h2>
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-8">Step 2 of 2: Define your constraints</p>
          
          <form onSubmit={handleSetupComplete} className="space-y-6">
            <div>
              <label className="block text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-2">Project Codename</label>
              <input type="text" required value={clientDetails.projectName === "New Greenfield Hospital" ? "" : clientDetails.projectName} onChange={(e) => setClientDetails({...clientDetails, projectName: e.target.value})} placeholder="e.g., Apollo Annex Surat" className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 px-5 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-2">Target City</label>
                <input type="text" required value={clientDetails.city} onChange={(e) => setClientDetails({...clientDetails, city: e.target.value})} placeholder="e.g., Ahmedabad" className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 px-5 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50" />
              </div>
              <div>
                <label className="block text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-2">City Tier (Pricing)</label>
                <select value={config.cityTier} onChange={(e) => setConfig({...config, cityTier: Number(e.target.value)})} className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 px-5 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50 appearance-none">
                  <option value="1">Tier 1 (Metro)</option>
                  <option value="2">Tier 2 (Urban)</option>
                  <option value="3">Tier 3 (Rural)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-2 flex justify-between">
                <span>Planned Bed Capacity</span>
                <span className="text-white">{config.beds} Beds</span>
              </label>
              <input type="range" min="20" max="500" step="10" value={config.beds} onChange={(e) => setConfig({...config, beds: Number(e.target.value)})} className="w-full h-2 bg-[#010810] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" />
            </div>
            
            <button type="submit" className="w-full mt-4 py-5 bg-[#D4AF37] text-[#010810] rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Initialize Command Center <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // STEP 3: AI LOADER
  // ------------------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin">
          <BrainCircuit className="text-[#D4AF37] w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Architecting Engine</h2>
        <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase animate-pulse">{loadingText}</p>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // STEP 4: THE MASTER DASHBOARD (ENTERPRISE OS)
  // ------------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-20">
      
      {/* OS HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-3 border border-[#D4AF37]/20">
             <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span> Planning Phase Active
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">{clientDetails.projectName || "New Project"}</h1>
          <p className="text-white/50 text-xs font-bold tracking-widest uppercase flex items-center gap-2 mt-3">
             <MapPin size={14}/> {clientDetails.city || "Pending Location"} • Tier {config.cityTier} • {config.beds} Beds
          </p>
        </div>
        <div className="bg-[#051626] border border-white/10 px-6 py-3 rounded-xl text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Project Readiness</p>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">25% <TrendingUp size={16}/></div>
        </div>
      </div>

      {/* CORE FINANCIAL KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#051626] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 relative z-10">Estimated Total CAPEX</p>
           <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">₹{(engine.totalProjectCost/10000000).toFixed(2)} <span className="text-lg text-white/50">Cr</span></h3>
        </div>
        <div className="bg-[#051626] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 relative z-10">Projected Monthly Revenue</p>
           <h3 className="text-3xl font-black text-emerald-400 tracking-tighter relative z-10">₹{((engine.totalRevenue/12)/10000000).toFixed(2)} <span className="text-lg text-emerald-400/50">Cr</span></h3>
        </div>
        <div className="bg-[#051626] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 blur-2xl rounded-full"></div>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 relative z-10">Est. Break-Even Timeline</p>
           <h3 className="text-3xl font-black text-[#D4AF37] tracking-tighter relative z-10">{engine.breakEvenYears.toFixed(1)} <span className="text-lg text-[#D4AF37]/50">Years</span></h3>
        </div>
      </div>

      {/* AI INTELLIGENCE LAYER */}
      <div className="bg-gradient-to-r from-[#0A2540] to-[#051626] border border-[#D4AF37]/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
           <BrainCircuit size={24} />
        </div>
        <div>
           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-2">AI Strategic Recommendation</h4>
           <p className="text-sm text-white/80 leading-relaxed font-bold">Based on your <span className="text-white">₹{(engine.totalProjectCost/10000000).toFixed(2)} Cr</span> budget and Tier-{config.cityTier} location, allocating <span className="text-emerald-400">35% of CAPEX</span> to high-yield ICU and Radiology equipment will improve your DSCR (Debt Service Coverage Ratio) to 1.5x, accelerating bank syndication approval by ~3 weeks.</p>
        </div>
      </div>

      {/* MODULE ROUTING SYSTEM */}
      <div>
        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-4">Workspace Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Module 1: Feasibility */}
          <div onClick={() => handleTabClick({ id: 'estimator', requiredPlan: 'FREE' })} className="bg-[#051626] border border-white/10 p-6 rounded-2xl hover:border-[#D4AF37]/50 cursor-pointer transition-colors group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><PieChart size={20}/></div>
               <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-black uppercase tracking-widest">Active</span>
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">Feasibility Engine</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Edit Beds, Area & City</p>
            <div className="text-xs font-black text-white/50 group-hover:text-white flex items-center gap-2">Refine Model <ArrowRight size={14}/></div>
          </div>

          {/* Module 2: AI Architect */}
          <div onClick={() => handleTabClick({ id: 'architect', requiredPlan: 'PRO' })} className="bg-[#051626] border border-white/10 p-6 rounded-2xl hover:border-[#D4AF37]/50 cursor-pointer transition-colors group relative overflow-hidden">
            {!session && <div className="absolute top-4 right-4 text-white/20"><Lock size={16}/></div>}
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform"><Grid size={20}/></div>
               {!session && <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded font-black uppercase tracking-widest border border-[#D4AF37]/20">Pro</span>}
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">AI Architect</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">NABH Spatial Zoning</p>
            <div className="text-xs font-black text-[#D4AF37] flex items-center gap-2">Generate Layouts <ArrowRight size={14}/></div>
          </div>

          {/* Module 3: Smart BOQ */}
          <div onClick={() => handleTabClick({ id: 'boq', requiredPlan: 'PRO' })} className="bg-[#051626] border border-white/10 p-6 rounded-2xl hover:border-[#D4AF37]/50 cursor-pointer transition-colors group relative overflow-hidden">
            {!session && <div className="absolute top-4 right-4 text-white/20"><Lock size={16}/></div>}
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform"><List size={20}/></div>
               {!session && <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded font-black uppercase tracking-widest border border-[#D4AF37]/20">Pro</span>}
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">Master BOQ</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Civil & Equip Costs</p>
            <div className="text-xs font-black text-[#D4AF37] flex items-center gap-2">View Breakdown <ArrowRight size={14}/></div>
          </div>

          {/* Module 4: DPR */}
          <div onClick={() => handleTabClick({ id: 'dpr', requiredPlan: 'PRO' })} className="bg-[#051626] border border-white/10 p-6 rounded-2xl hover:border-[#D4AF37]/50 cursor-pointer transition-colors group relative overflow-hidden">
            {!session && <div className="absolute top-4 right-4 text-white/20"><Lock size={16}/></div>}
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><FileText size={20}/></div>
               {!session && <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded font-black uppercase tracking-widest border border-[#D4AF37]/20">Enterprise</span>}
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">Bank-Ready DPR</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Full Financial Model</p>
            <div className="text-xs font-black text-[#D4AF37] flex items-center gap-2">Download PDF <ArrowRight size={14}/></div>
          </div>

        </div>
      </div>

      {/* HIGH-TICKET CONSULTATION UPGRADE */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F1CF6D] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center text-[#010810] shadow-[0_10px_40px_rgba(212,175,55,0.2)] mt-8">
        <div className="mb-6 md:mb-0 text-center md:text-left">
           <h4 className="font-black uppercase tracking-tighter text-2xl mb-1">Need Execution Support?</h4>
           <p className="font-bold text-sm opacity-90 max-w-xl">Our senior consultants can take your AI-generated blueprint and execute the entire ₹{(engine.totalProjectCost/10000000).toFixed(2)} Cr project, from architecture to bank syndication.</p>
        </div>
        <button className="px-8 py-4 bg-[#010810] text-[#D4AF37] rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl whitespace-nowrap">
           <MessageCircle size={18} /> WhatsApp Expert
        </button>
      </div>

    </div>
  );
}