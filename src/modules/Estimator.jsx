// src/modules/Estimator.jsx
import React from 'react';
import { AlertCircle, TrendingUp, PieChart, Users, Layers, Timer, ArrowRight } from 'lucide-react';

const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500";

const formatINR = (val) => val === 0 || isNaN(val) ? "₹0.00 Cr" : `₹${(val / 10000000).toFixed(2)} Cr`;
const safeToFixed = (val, decimals = 2) => (Number.isFinite(val) ? val : 0).toFixed(decimals);

export default function Estimator({ config, setConfig, engine, setActiveTab }) {
  // Fail-safe if engine hasn't loaded yet
  if (!engine) return <div className="text-white p-10 font-black animate-pulse">Loading Feasibility Engine Data...</div>;

  // Local calculations for the UI
  const delayCost = { 
    revLoss: formatINR((engine.totalRevenue / 12) * 6), 
    capexRise: formatINR(engine.totalProjectCost * 0.08) 
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      
      {/* Hero / Pain-Gain Banner */}
      <div className="bg-gradient-to-r from-red-500/10 to-[#051626] border border-red-500/20 p-6 md:p-10 rounded-2xl md:rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
         <div>
           <h2 className="text-2xl md:text-4xl font-black mb-2 text-white tracking-tighter uppercase">Are Bank Loans Giving You a <span className="text-red-500">Headache?</span></h2>
           <p className="text-white/70 text-sm max-w-3xl leading-relaxed">Stop guessing your project costs. Unrealistic revenue projections and missing market analysis lead to instant bank rejections. Use this engine to generate a mathematically flawless, Bank-Ready DPR in exactly 60 seconds.</p>
         </div>
         <button onClick={() => setActiveTab('dpr')} className="w-full md:w-auto px-8 py-4 bg-red-500 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-400 transition-colors shrink-0">Skip to Checkout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Sliders */}
        <div className="space-y-6 md:space-y-8">
            <div className={GLOW_CARD}>
              
              {/* 1. Beds Slider */}
              <div className="mb-6">
                <label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest">
                  <span>Project Scale</span><span className="text-white">{config.beds} Beds</span>
                </label>
                <input type="range" min="30" max="500" step="5" value={config.beds} onChange={e=>setConfig({...config, beds: Number(e.target.value)})} className="w-full accent-[#D4AF37]" />
              </div>
              
              {/* 2. Occupancy Slider */}
              <div className="mb-6">
                <label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest">
                  <span>Stabilized Occupancy</span><span className="text-white">{config.occupancyRate}%</span>
                </label>
                <input type="range" min="40" max="100" step="5" value={config.occupancyRate} onChange={e=>setConfig({...config, occupancyRate: Number(e.target.value)})} className="w-full accent-[#D4AF37]" />
              </div>
              
              {/* 3. Total Area Slider (WITH DYNAMIC RED LOGIC) */}
              <div className="mb-6">
                <label className={`text-[10px] font-black flex justify-between mb-3 uppercase tracking-widest transition-colors duration-300 ${engine.nabhReady ? 'text-[#D4AF37]' : 'text-red-500'}`}>
                  <span>Total Area</span>
                  <span className={engine.nabhReady ? 'text-white' : 'text-red-400'}>
                    {config.areaSqFt.toLocaleString()} Sqft
                  </span>
                </label>
                
                <input 
                  type="range" min="20000" max="400000" step="5000" 
                  value={config.areaSqFt} 
                  onChange={e=>setConfig({...config, areaSqFt: Number(e.target.value)})} 
                  className={`w-full transition-colors duration-300 ${engine.nabhReady ? 'accent-[#D4AF37]' : 'accent-red-500'}`} 
                />
                
                {/* 🔥 NABH 6TH EDITION COMPLIANCE ALERT */}
                {!engine.nabhReady && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in fade-in duration-300">
                     <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                       <AlertCircle size={12}/> NABH 6th Ed. Space Deficit
                     </p>
                     <p className="text-[11px] text-red-200/80 leading-relaxed">
                       Current area provides <strong className="text-white">{Math.round(engine.sqFtPerBed)} sq.ft/bed</strong>. The new NABH 6th Edition (Jan 2025) requires ~<strong className="text-white">{Math.round(engine.minAreaPerBed)} sq.ft/bed</strong> for a {engine.type} setup. Increase total area by <strong className="text-white">{Math.round(engine.areaShortfall).toLocaleString()} sq.ft</strong> or reduce your bed count to comply.
                     </p>
                  </div>
                )}
              </div>

              {/* City Tier Dropdown */}
              <div className="mb-6">
                <label className="text-[10px] text-[#D4AF37] font-black block mb-3 uppercase tracking-widest">City Tier Strategy</label>
                <select value={config.cityTier} onChange={e=>setConfig({...config, cityTier: Number(e.target.value)})} className="w-full bg-[#010810] border border-[#D4AF37]/30 p-4 rounded-xl text-sm font-bold text-white outline-none">
                  <option value={1}>Tier 1 (Metro)</option>
                  <option value={2}>Tier 2 (Smart City)</option>
                </select>
              </div>

            </div>
        </div>

        {/* RIGHT COLUMN: 4-Card Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          
          {/* Card 1: EBITDA */}
          <div className={GLOW_CARD}>
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white/10 mb-4 absolute right-8 top-8" />
            <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Projected Annual EBITDA</p>
            <p className="text-4xl md:text-5xl font-black text-white">{formatINR(engine.ebitda)}</p>
            <p className="text-[10px] text-[#4ade80] font-bold mt-4 border border-[#4ade80]/30 bg-[#4ade80]/10 inline-block px-3 py-1 rounded-md uppercase tracking-widest">{safeToFixed(engine.ebitdaMargin, 1)}% Margin</p>
          </div>
          
          {/* Card 2: DSCR / Bankability */}
          <div className={GLOW_CARD}>
            <PieChart className="w-6 h-6 md:w-8 md:h-8 text-white/10 mb-4 absolute right-8 top-8" />
            <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Stabilized Bankability</p>
            <p className={`text-4xl md:text-5xl font-black ${engine.dscr >= 1.3 ? 'text-[#4ade80]' : 'text-amber-500'}`}>{safeToFixed(engine.dscr)}x DSCR</p>
            <p className="text-xs text-white/50 font-medium mt-4">{safeToFixed(engine.breakEvenYears, 1)} Yrs Break-Even</p>
          </div>
          
          {/* Card 3: TOTAL MANPOWER PLANNING (FTE) */}
          <div className={GLOW_CARD}>
            <Users className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mb-5" />
            <div className="flex justify-between items-end mb-5">
               <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Total Manpower (FTE)</p>
               <p className="text-2xl font-black text-[#D4AF37]">{engine.totalStaff}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#010810] p-3 rounded-lg border border-white/5">
                 <span className="text-xs font-bold text-white/80">Clinical (Nurses, Doctors)</span>
                 <span className="text-sm font-black text-white">{engine.nursingStaff + engine.doctors}</span>
              </div>
              <div className="flex justify-between items-center bg-[#010810] p-3 rounded-lg border border-white/5">
                 <span className="text-xs font-bold text-white/80">Paramedical (Techs, Pharmacy)</span>
                 <span className="text-sm font-black text-[#4ade80]">{engine.paramedical}</span>
              </div>
              <div className="flex justify-between items-center bg-[#010810] p-3 rounded-lg border border-white/5">
                 <span className="text-xs font-bold text-white/80">Admin & Support</span>
                 <span className="text-sm font-black text-[#D4AF37]">{engine.adminSupport}</span>
              </div>
            </div>
          </div>

          {/* Card 4: SPATIAL ZONING & IPC BLOCK */}
          <div className={GLOW_CARD}>
            <Layers className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mb-6" />
            <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-6">NABH 6th Ed. Spatial Zoning</p>
            <p className="flex justify-between font-bold border-b border-white/5 pb-3 mb-3 text-sm md:text-base">
              <span>Sterile (IPC / OT / ICU)</span>
              <span className="text-white text-xl">{engine.icuOtArea.toLocaleString()}</span>
            </p>
            <p className="flex justify-between font-bold border-b border-white/5 pb-3 mb-3 text-sm md:text-base">
              <span>IPD Clinical Wards</span>
              <span className="text-white text-xl">{engine.ipdArea.toLocaleString()}</span>
            </p>
          </div>

        </div>
      </div>

      {/* COST OF DELAY / PAIN FOMO CARD */}
      <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-[#051626] border border-red-500/30 p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-[0_0_30px_rgba(239,68,68,0.1)] mt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-red-500/30">
              <Timer size={12} className="animate-pulse" /> Critical Opportunity Cost
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tighter flex items-center gap-3">
              The Cost of <span className="text-red-500">Inaction</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
              In the healthcare sector, time is equity. Delaying your hospital project by just 6 months not only forfeits massive operational revenue but also subjects your construction budget to an unavoidable 8% annual inflation penalty. <strong className="text-white">Every day you wait without a DPR costs you money.</strong>
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full lg:w-[350px] shrink-0">
            <div className="bg-[#010810]/80 p-5 rounded-xl border border-red-500/20 flex justify-between items-center shadow-inner">
               <div className="flex flex-col">
                 <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">Lost Revenue</span>
                 <span className="text-xs font-bold text-white/50">6-Month Delay Penalty</span>
               </div>
               <span className="text-xl font-black text-red-400">{delayCost.revLoss}</span>
            </div>
            <div className="bg-[#010810]/80 p-5 rounded-xl border border-amber-500/20 flex justify-between items-center shadow-inner">
               <div className="flex flex-col">
                 <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">CAPEX Inflation</span>
                 <span className="text-xs font-bold text-white/50">8% Material/Labor Rise</span>
               </div>
               <span className="text-xl font-black text-amber-400">{delayCost.capexRise}</span>
            </div>
            <button onClick={() => setActiveTab('dpr')} className="w-full mt-2 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-red-500/20">
              Lock Prices & Start DPR <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}