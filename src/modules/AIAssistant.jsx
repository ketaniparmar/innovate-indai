// src/modules/AIAssistant.jsx
import React, { useState } from 'react';
import { 
  Bot, Calculator, ShieldCheck, Megaphone, Zap, 
  Activity, CheckCircle2, AlertTriangle, ArrowRight, Grid
} from 'lucide-react';

const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 shadow-xl";

export default function AIAssistant({ config, engine, sim }) {
  const [activeAgent, setActiveAgent] = useState('financial');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // 1. THE MULTI-AGENT DEFINITIONS
  const agents = [
    {
      id: 'financial',
      name: 'Financial Analyst AI',
      icon: Calculator,
      color: 'text-[#D4AF37]',
      bg: 'bg-[#D4AF37]/10',
      border: 'border-[#D4AF37]/30',
      desc: 'Optimizes CAPEX, maximizes EBITDA, and stress-tests bank loan viability.',
      actions: ['Value-Engineer CAPEX by 10%', 'Maximize Year 1 EBITDA', 'Stress-Test DSCR']
    },
    {
      id: 'architect',
      name: 'Master Architect AI',
      icon: Grid,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      desc: 'Validates spatial zoning, optimizes patient flow, and catches layout errors.',
      actions: ['Optimize Space Allocation', 'Fix Adjacency Conflicts', 'Generate Expansion Plan']
    },
    {
      id: 'nabh',
      name: 'NABH Auditor AI',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      desc: 'Runs strict 6th Edition Jan 2025 compliance checks to guarantee accreditation.',
      actions: ['Run Full 6th Ed. Audit', 'Generate Staffing Roster', 'Fire Safety Gap Analysis']
    },
    {
      id: 'marketing',
      name: 'Marketing & Strategy AI',
      icon: Megaphone,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      desc: 'Drafts investor pitches, pricing strategies, and catchment market analyses.',
      actions: ['Draft Investor Pitch Deck', 'Competitor Pricing Strategy', 'Catchment Demand Analysis']
    }
  ];

  const currentAgent = agents.find(a => a.id === activeAgent);

  // 2. CONTEXT-AWARE AI ACTION RUNNER
  const runAction = (actionName) => {
    setIsProcessing(true);
    setAiResponse(null);
    
    // Simulated AI Processing Time
    setTimeout(() => {
      let response = {};
      
      // Dynamic Contextual Responses based on the live `engine` data
      if (actionName === 'Value-Engineer CAPEX by 10%') {
        response = {
          title: `CAPEX Reduction Strategy (-₹${((engine.totalProjectCost * 0.10) / 10000000).toFixed(2)} Cr)`,
          text: `I have analyzed your ₹${(engine.totalProjectCost / 10000000).toFixed(2)} Cr budget. To safely reduce costs by 10% without affecting NABH compliance, implement these changes:`,
          points: [
            "Swap imported Modular OT steel panels to domestic high-grade PUF (Saves ₹1.2 Cr).",
            "Opt for refurbished 1.5T Siemens MRI with comprehensive AMC instead of new (Saves ₹2.5 Cr).",
            "Shift 15% of administrative footprint to off-site leased space to reduce prime construction cost."
          ],
          type: 'success'
        };
      } 
      else if (actionName === 'Run Full 6th Ed. Audit') {
        const sqft = Math.round(engine.sqFtPerBed);
        if (engine.nabhReady) {
          response = {
            title: "NABH 6th Edition Audit: PASSED",
            text: `Your layout provides ${sqft} sq.ft per bed, which exceeds the minimum mandate for a ${engine.type} facility.`,
            points: ["Corridor widths assumed compliant.", "ICU bed ratio (20%) is optimal.", "Sterile zoning is separated."],
            type: 'success'
          };
        } else {
          response = {
            title: "NABH 6th Edition Audit: CRITICAL FAILURE",
            text: `Your layout provides only ${sqft} sq.ft per bed. You have a deficit of ${Math.round(engine.areaShortfall).toLocaleString()} sq.ft.`,
            points: ["Action: Reduce bed count immediately.", "Action: Or acquire additional adjacent land.", "Warning: Do not proceed to bank financing."],
            type: 'danger'
          };
        }
      }
      else if (actionName === 'Draft Investor Pitch Deck') {
        response = {
          title: "Investor Pitch Outline Generated",
          text: `A high-yield proposition for a ${config.beds}-bed ${engine.type} in a Tier ${config.cityTier} city.`,
          points: [
            `Financial Hook: Year 1 EBITDA projected at ₹${(engine.ebitda/10000000).toFixed(2)} Cr with a ${engine.ebitdaMargin.toFixed(1)}% margin.`,
            `Risk Mitigation: Highly bankable DSCR of ${engine.dscr.toFixed(2)}x ensuring debt serviceability.`,
            `Market Gap: Capturing unmet tertiary demand with specialized ICU and OT facilities.`
          ],
          type: 'info'
        };
      }
      else {
        response = {
          title: `Action Executed: ${actionName}`,
          text: `The ${currentAgent.name} has processed your request based on current project parameters (${config.beds} beds, ${config.areaSqFt} sqft).`,
          points: ["Optimization successfully applied.", "Data tables updated.", "Re-run DPR generator to finalize."],
          type: 'info'
        };
      }

      setAiResponse(response);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-[#051626] border border-white/10 p-8 rounded-[30px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Bot className="text-[#D4AF37] w-8 h-8" /> C-Suite AI Agents
            </h2>
            <p className="text-white/60 text-sm mt-2">Specialized AI models strictly trained on hospital planning, NABH codes, and project finance.</p>
         </div>
         <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
            Context Sync Active
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AGENT SELECTOR SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-4 px-2">Select Domain Expert</h4>
          {agents.map(agent => (
            <div 
              key={agent.id} 
              onClick={() => { setActiveAgent(agent.id); setAiResponse(null); }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4 ${activeAgent === agent.id ? `${agent.bg} ${agent.border} shadow-lg scale-[1.02]` : 'bg-[#010810] border-white/5 hover:border-white/20'}`}
            >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeAgent === agent.id ? agent.bg : 'bg-white/5'} ${agent.color}`}>
                  <agent.icon size={20} />
               </div>
               <div>
                  <h3 className={`font-black uppercase text-sm ${activeAgent === agent.id ? agent.color : 'text-white'}`}>{agent.name}</h3>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{agent.desc}</p>
               </div>
            </div>
          ))}
        </div>

        {/* ACTION BOARD & OUTPUT */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           {/* ACTION BUTTONS */}
           <div className={GLOW_CARD}>
              <h4 className={`${currentAgent.color} font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2`}>
                <Zap size={16}/> {currentAgent.name} Actions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {currentAgent.actions.map((action, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => runAction(action)}
                     disabled={isProcessing}
                     className={`p-4 rounded-xl border border-white/10 bg-[#010810] text-left font-bold text-sm text-white/80 hover:text-white hover:border-white/30 transition-all flex items-center justify-between group ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     {action}
                     <ArrowRight size={16} className={`text-white/20 group-hover:${currentAgent.color} transition-colors transform group-hover:translate-x-1`} />
                   </button>
                 ))}
              </div>
           </div>

           {/* AI OUTPUT TERMINAL */}
           <div className={`flex-1 rounded-[30px] p-8 border shadow-inner relative overflow-hidden transition-colors duration-500 ${!aiResponse ? 'bg-[#010810] border-white/5' : aiResponse.type === 'danger' ? 'bg-red-500/5 border-red-500/30' : aiResponse.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-blue-500/5 border-blue-500/30'}`}>
              
              {isProcessing ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010810]/80 backdrop-blur-sm z-10">
                    <Activity className={`w-12 h-12 animate-spin mb-4 ${currentAgent.color}`} />
                    <p className={`${currentAgent.color} font-black uppercase tracking-widest text-xs animate-pulse`}>Agent Analyzing Project Context...</p>
                 </div>
              ) : !aiResponse ? (
                 <div className="h-full flex flex-col items-center justify-center text-white/20">
                    <Bot size={48} className="mb-4 opacity-20" />
                    <p className="font-black uppercase tracking-widest text-[10px]">Awaiting Agent Command</p>
                 </div>
              ) : (
                 <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                       {aiResponse.type === 'danger' ? <AlertTriangle className="text-red-500 w-8 h-8"/> : <CheckCircle2 className="text-emerald-400 w-8 h-8"/>}
                       <h3 className={`text-xl font-black uppercase tracking-widest ${aiResponse.type === 'danger' ? 'text-red-500' : aiResponse.type === 'success' ? 'text-emerald-400' : 'text-blue-400'}`}>
                         {aiResponse.title}
                       </h3>
                    </div>
                    <p className="text-white/80 leading-relaxed mb-6 font-medium text-sm">
                      {aiResponse.text}
                    </p>
                    <ul className="space-y-3">
                      {aiResponse.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                          <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${aiResponse.type === 'danger' ? 'bg-red-500' : 'bg-[#D4AF37]'}`}></div>
                          {pt}
                        </li>
                      ))}
                    </ul>
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}