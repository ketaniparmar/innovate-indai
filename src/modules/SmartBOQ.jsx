// src/modules/SmartBOQ.jsx
import React, { useState, useMemo } from 'react';
import { List, Download, AlertTriangle, TrendingDown, CheckCircle2, ShoppingCart, Zap } from 'lucide-react';
import { generateSmartBOQ } from '../utils/boqEngine';

const formatINR = (val) => `₹${(val / 10000000).toFixed(2)} Cr`;
const formatNum = (val) => new Intl.NumberFormat('en-IN').format(val);
const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl hover:border-emerald-500/30 transition-all duration-500";

export default function SmartBOQ({ config, triggerLeadCapture }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [quality, setQuality] = useState("nabh"); // standard, premium, nabh

  const boqData = useMemo(() => generateSmartBOQ(config, quality), [config, quality]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner */}
      <div className="relative w-full h-[250px] rounded-[40px] overflow-hidden border border-emerald-500/20 shadow-2xl">
          <img src="/images/equipment-bg.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Equipment BOQ" />
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-center px-12">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Value Engineering <span className="text-emerald-400">BOQ</span></h2>
              <p className="max-w-lg text-white/60 text-sm mt-2">Dynamic procurement list benchmarked against real-time market rates for a {config.beds}-bed facility.</p>
          </div>
      </div>

      {/* Quality Toggles & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${GLOW_CARD} lg:col-span-2 flex flex-col justify-center`}>
           <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-4">Project Specification Level</p>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             <button onClick={()=>setQuality('standard')} className={`p-4 rounded-xl border text-left transition-colors ${quality === 'standard' ? 'bg-white/10 border-white text-white' : 'border-white/10 text-white/40 hover:bg-white/5'}`}><h4 className="font-black uppercase text-sm">Standard</h4><p className="text-[9px] mt-1 uppercase tracking-widest">Basic functional setup</p></button>
             <button onClick={()=>setQuality('nabh')} className={`p-4 rounded-xl border text-left transition-colors shadow-lg ${quality === 'nabh' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-white/40 hover:bg-white/5'}`}><h4 className="font-black uppercase text-sm">NABH Ready</h4><p className="text-[9px] mt-1 uppercase tracking-widest">Optimized for Accreditation</p></button>
             <button onClick={()=>setQuality('premium')} className={`p-4 rounded-xl border text-left transition-colors ${quality === 'premium' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'border-white/10 text-white/40 hover:bg-white/5'}`}><h4 className="font-black uppercase text-sm">Premium / Corporate</h4><p className="text-[9px] mt-1 uppercase tracking-widest">Luxury finishes & imported tech</p></button>
           </div>
        </div>

        <div className={`${GLOW_CARD} bg-gradient-to-br from-emerald-900/20 to-[#0A2540] border-emerald-500/30 flex flex-col justify-center`}>
           <div className="flex items-center gap-2 mb-2">
             <TrendingDown className="text-emerald-400 w-5 h-5"/>
             <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">Identified VE Savings</p>
           </div>
           <p className="text-4xl md:text-5xl font-black text-white">{formatINR(boqData.veSavings)}</p>
           <p className="text-[9px] text-white/50 uppercase tracking-widest mt-3 leading-relaxed">By implementing the AI Value Engineering suggestions below.</p>
        </div>
      </div>
      
      {/* Dynamic Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
          <button onClick={()=>setActiveCategory('all')} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shrink-0 transition-all ${activeCategory==='all' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>All Items</button>
          {boqData.categories.map(c => (
              <button key={c.id} onClick={()=>setActiveCategory(c.id)} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shrink-0 transition-all ${activeCategory===c.id ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{c.name.split('. ')[1]}</button>
          ))}
      </div>

      {/* Filtered Data Tables */}
      <div className="space-y-8">
          {boqData.categories.filter(c => activeCategory==='all' || activeCategory===c.id).map((cat, i) => (
              <div key={i} className="bg-[#051626]/80 border border-white/5 rounded-[30px] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 shadow-xl">
                  <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-white/5">
                      <h4 className="font-black text-white uppercase tracking-widest text-sm">{cat.name}</h4>
                      <div className="text-right">
                         <span className="text-white font-black text-2xl">{formatINR(cat.catTotal)}</span>
                         <p className="text-[9px] text-white/40 uppercase tracking-widest">Category Total</p>
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="text-[10px] uppercase tracking-widest text-white/30 bg-[#010810]/50">
                            <tr>
                              <th className="p-6 border-b border-white/5">Description</th>
                              <th className="p-6 border-b border-white/5">Qty</th>
                              <th className="p-6 border-b border-white/5 text-right">AI Est. Rate</th>
                              <th className="p-6 border-b border-white/5 text-center">Status</th>
                              <th className="p-6 border-b border-white/5 text-right text-emerald-400">Amount (₹)</th>
                              <th className="p-6 border-b border-white/5 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-bold">
                              {cat.items.map((item, j) => (
                                  <React.Fragment key={j}>
                                    <tr className="hover:bg-white/5 transition-colors">
                                      <td className="p-6 text-white/90">
                                        {item.desc}
                                        {item.veSuggestion && <span className="hidden md:inline-block ml-3 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] uppercase tracking-widest"><Zap size={10} className="inline mr-1 mb-0.5"/>VE Opportunity</span>}
                                      </td>
                                      <td className="p-6 text-white/50">{item.qty} <span className="text-[9px] uppercase">{item.unit}</span></td>
                                      <td className="p-6 text-right">₹{formatNum(item.rate)}</td>
                                      <td className="p-6 text-center">
                                        {item.priceAlert === 'high' ? <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded text-[10px] uppercase"><AlertTriangle size={12}/> High</span> : 
                                         item.priceAlert === 'low' ? <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-[10px] uppercase"><TrendingDown size={12}/> Below Avg</span> : 
                                         <span className="inline-flex items-center gap-1 text-white/40"><CheckCircle2 size={12}/> Normal</span>}
                                      </td>
                                      <td className="p-6 text-right text-emerald-400">₹{formatNum(item.amount)}</td>
                                      <td className="p-6 text-center">
                                        {item.isEquip ? (
                                          <button onClick={() => triggerLeadCapture(`B2B Quote for ${item.desc}`)} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-colors shadow-sm flex items-center gap-2 mx-auto">
                                            <ShoppingCart size={12}/> Get OEM Quote
                                          </button>
                                        ) : (
                                          <span className="text-white/20 text-[10px]">-</span>
                                        )}
                                      </td>
                                    </tr>
                                    {/* Mobile/Expanded View for VE Suggestion */}
                                    {item.veSuggestion && (
                                      <tr className="bg-blue-500/5">
                                        <td colSpan="6" className="px-6 py-3 border-l-2 border-blue-500 text-xs text-blue-300">
                                          <strong className="text-blue-400 uppercase text-[9px] tracking-widest mr-2">Engineer's Note:</strong> 
                                          {item.veSuggestion}
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}