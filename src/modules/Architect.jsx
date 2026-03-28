import React from 'react';
import { Cpu, Zap, Layers, Grid, FileText, ShieldCheck, CheckCircle2, Activity, Settings, Download } from 'lucide-react';

export default function Architect({ config, archInputs, setArchInputs, engine, setActiveTab }) {
  
  if (!engine) return <div className="p-10 text-white">Loading Architect Engine...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* --- TOP SECTION: AI PLANNING ENGINE FORM --- */}
      <div className="bg-[#0A2540]/40 border border-[#D4AF37]/20 p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-xl">
        <div className="flex items-center gap-4 mb-2">
          <Cpu className="w-8 h-8 text-[#D4AF37]" />
          <h3 className="text-2xl font-black text-white tracking-tighter">AI Planning Engine</h3>
        </div>
        <p className="text-white/60 text-sm mb-8">A concept-to-DPR accelerator. Reduce months of planning to hours by embedding NABH rules directly into the AI design logic.</p>
        
        <div className="bg-[#051626] border border-white/5 rounded-2xl p-6 md:p-8">
          <h4 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
            <Zap size={16}/> Step 1: Define Project Parameters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Land Area (Sq.Ft)</label>
              <input type="text" value={archInputs.landArea} onChange={e=>setArchInputs({...archInputs, landArea: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Bed Capacity</label>
              <input type="text" value={config.beds} disabled className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white/50 font-bold outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Number of Floors</label>
              <input type="text" value={archInputs.floors} onChange={e=>setArchInputs({...archInputs, floors: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">City & Local By-Laws</label>
              <select className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]/50 transition-colors">
                <option>Surat (GDCR Rules)</option>
                <option>Ahmedabad (AMC By-laws)</option>
                <option>Mumbai (BMC Guidelines)</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Required Specialties & Departments</label>
            <input type="text" value={archInputs.specialties} onChange={e=>setArchInputs({...archInputs, specialties: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]/50 transition-colors" />
          </div>
          
         <div className="mb-8">
            <label className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Parking Requirements</label>
            <select 
              value={archInputs.parking} 
              onChange={e=>setArchInputs({...archInputs, parking: e.target.value})} 
              className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]/50 transition-colors"
            >
              <option>Basement + Surface Parking (Standard)</option>
              <option>Stilt Parking (Ground Floor Dedicated)</option>
              <option>Mechanized / Puzzle Parking (Tight Urban Spaces)</option>
              <option>Multi-level Car Parking (MLCP - Standalone)</option>
              <option>Off-site Leased Parking (With Valet Service)</option>
            </select>
          </div>

          <button className="w-full py-4 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase tracking-widest flex justify-center items-center gap-3 hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform">
            <Cpu size={18}/> Run AI Optimization & Download 2D Plan
          </button>
        </div>
      </div>

      {/* --- BOTTOM SECTION: ASYMMETRIC BENTO BOX LAYOUT --- */}
      <div className="space-y-6">
        
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Verified <span className="text-[#D4AF37]">AI Outputs</span></h3>
          <p className="text-white/60 text-sm">AI-generated deliverables aligned with NABH standards, ready for execution and approvals.</p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* 🟦 Top Row: Massive Full-Width Zoning Card (Blue) */}
          <div className="bg-[#051626] border border-blue-500/20 p-6 md:p-8 rounded-[30px] hover:border-blue-500/60 transition-all duration-300 group shadow-[0_0_15px_rgba(59,130,246,0.05)] flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Layers className="text-blue-400 w-6 h-6"/></div>
                <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                  Zoning Diagrams <br/><span className="text-[11px] text-white/50 normal-case tracking-normal">(Public, Clinical)</span>
                </h4>
              </div>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">AI-generated zoning layouts separating public, semi-restricted, and clinical areas for optimal hospital flow.</p>
              
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-3">Key Inclusions</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-xs text-white/80 font-bold flex items-center gap-3"><div className="w-2 h-2 rounded-sm bg-blue-400"></div> Public vs Clinical zoning</li>
                <li className="text-xs text-white/80 font-bold flex items-center gap-3"><div className="w-2 h-2 rounded-sm bg-blue-400"></div> Patient flow mapping</li>
                <li className="text-xs text-white/80 font-bold flex items-center gap-3"><div className="w-2 h-2 rounded-sm bg-amber-500"></div> Emergency access planning</li>
                <li className="text-xs text-white/80 font-bold flex items-center gap-3"><div className="w-2 h-2 rounded-sm bg-emerald-400"></div> Infection control zoning</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">View Zoning Diagram</button>
                <button className="px-6 py-3 bg-[#0A2540] text-white hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition border border-white/5">Export PDF</button>
              </div>
            </div>
            
            {/* Image Injection: Blue Zoning */}
            <div className="lg:w-[55%] min-h-[250px] bg-[#010810] rounded-2xl border border-white/10 overflow-hidden relative flex items-center justify-center group/img">
               <img src="/zoning-blue.jpg" alt="Zoning Diagram" className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity duration-300" />
               <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent group-hover/img:opacity-0 transition-opacity"></div>
            </div>
          </div>

          {/* 🟩 & 🟨 Bottom Row: 50/50 Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card B: Department Layouts (Green) */}
            <div className="bg-[#051626] border border-emerald-500/20 p-6 md:p-8 rounded-[30px] hover:border-emerald-500/60 transition-all duration-300 group shadow-[0_0_15px_rgba(16,185,129,0.05)] flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Grid className="text-emerald-400 w-6 h-6"/></div>
                <h4 className="text-lg font-black text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Department & <br/>Room Layouts</h4>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed">Detailed layouts with optimized room sizes and adjacency logic.</p>
              
              {/* Image Injection: Green Layout */}
              <div className="w-full h-32 bg-[#010810] rounded-xl border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
                 <img src="/layout-green.jpg" alt="Room Layouts" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-3">Key Inclusions</p>
              <ul className="space-y-3 mb-8 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-3">
                <li className="text-[10px] text-white/70 font-bold flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 mt-1 shrink-0"></div> OPD, ICU, OT Plans</li>
                <li className="text-[10px] text-white/70 font-bold flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 mt-1 shrink-0"></div> Room-wise area</li>
                <li className="text-[10px] text-white/70 font-bold flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 mt-1 shrink-0"></div> Equip. Ready Blocks</li>
                <li className="text-[10px] text-white/70 font-bold flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 mt-1 shrink-0"></div> Staff circulation</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button className="flex-1 py-3 bg-[#D4AF37] text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Explore Layouts</button>
                <button className="flex-1 py-3 bg-[#0A2540] border border-white/5 text-white/50 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition">Export CAD/PDF</button>
              </div>
            </div>

            {/* Card C: Space Reports (Gold) */}
            <div className="bg-[#051626] border border-[#D4AF37]/20 p-6 md:p-8 rounded-[30px] hover:border-[#D4AF37]/60 transition-all duration-300 group shadow-[0_0_15px_rgba(212,175,55,0.05)] flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="text-[#D4AF37] w-6 h-6"/></div>
                <h4 className="text-lg font-black text-white uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Space Reports & <br/>DPR Data</h4>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed">Comprehensive data tables for planning, budgeting, and bank approvals.</p>
              
              {/* Image Injection: Gold Report */}
              <div className="w-full h-32 bg-[#010810] rounded-xl border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
                 <img src="/report-gold.jpg" alt="Space Reports" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-3">Key Inclusions</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="text-[10px] text-white/70 font-bold flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-sm bg-[#D4AF37]"></div> Dept. wise area statements</li>
                <li className="text-[10px] text-white/70 font-bold flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-sm bg-[#D4AF37]"></div> Built-up area calculations</li>
                <li className="text-[10px] text-white/70 font-bold flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-sm bg-[#D4AF37]"></div> Cost estimation inputs</li>
                <li className="text-[10px] text-white/70 font-bold flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-sm bg-[#D4AF37]"></div> NABH compliance checklist</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button className="flex-1 py-3 bg-[#D4AF37] text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">View Reports</button>
                <button className="flex-1 py-3 bg-[#8B6508] border border-[#D4AF37]/50 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition hover:bg-[#D4AF37] hover:text-black">Get Approved Plans</button>
              </div>
            </div>

          </div>
        </div>

        {/* Trust Badge & Features Strip & CTA */}
        <div className="bg-gradient-to-r from-amber-500/20 to-[#0A2540] border border-amber-500/40 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden mt-8">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 border border-amber-500/30">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black text-amber-400 uppercase tracking-widest mb-2">100% NABH Compliant</h4>
            <p className="text-white/80 text-sm leading-relaxed mb-4">All outputs are generated using embedded 6th Edition guidelines and validated planning logic to ensure instant medical board approval readiness.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-black/30 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={12}/> Auto Rule Validation</span>
              <span className="bg-black/30 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={12}/> Medical Board Ready</span>
              <span className="bg-black/30 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={12}/> Error-Free Logic</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 py-8 border-y border-white/5 my-8">
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60"><Zap size={16} className="text-[#D4AF37]"/> Instant Generation</span>
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60"><Activity size={16} className="text-[#D4AF37]"/> Real-Time Updates</span>
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60"><Layers size={16} className="text-[#D4AF37]"/> Data-Backed Logic</span>
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60"><Settings size={16} className="text-[#D4AF37]"/> Specialty Customization</span>
        </div>

        <div className="bg-[#010810] border border-white/10 p-8 md:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-[#D4AF37]"></div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-8 mt-2">Ready to Download Your Hospital Plan?</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"><Cpu size={16}/> Run AI Optimization</button>
              <button onClick={() => setActiveTab('dpr')} className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><Download size={16}/> Download Full DPR</button>
            </div>
        </div>

      </div>
    </div>
  );
}