// src/modules/Settings.jsx
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Shield, Database, CreditCard, 
  Bot, Save, Users, Building2, Key, CheckCircle2, AlertCircle, Activity 
} from 'lucide-react';
import { defaultSystemConfig } from '../utils/configEngine';

const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl";

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState('assumptions');
  const [sysConfig, setSysConfig] = useState(defaultSystemConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save config to Supabase
    setTimeout(() => {
      setIsSaving(false);
      alert("System Configuration successfully updated across all engines.");
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      
      {/* Header */}
      <div className="bg-[#051626] border border-[#D4AF37]/30 p-8 rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <SettingsIcon className="text-[#D4AF37] w-8 h-8" /> System <span className="text-[#D4AF37]">Config</span>
          </h2>
          <p className="text-white/60 text-sm mt-2">Global parameters, API integrations, and Role-Based Access Control.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="px-8 py-4 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform flex items-center gap-2 relative z-10 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          {isSaving ? <Activity className="animate-spin w-4 h-4"/> : <Save size={16}/>} 
          {isSaving ? 'Syncing...' : 'Deploy Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          {[
            { id: 'assumptions', label: 'Cost Assumptions', icon: Building2, color: 'text-blue-400' },
            { id: 'nabh', label: 'NABH Engine Rules', icon: Shield, color: 'text-emerald-400' },
            { id: 'prompts', label: 'AI Prompt Engineering', icon: Bot, color: 'text-purple-400' },
            { id: 'integrations', label: 'API Integrations', icon: Key, color: 'text-amber-400' },
            { id: 'rbac', label: 'User Roles & Access', icon: Users, color: 'text-[#D4AF37]' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveSubTab(tab.id)}
              className={`w-full p-4 rounded-xl border font-bold text-sm flex items-center gap-3 transition-all ${activeSubTab === tab.id ? `bg-[#0A2540] border-white/20 text-white shadow-lg` : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'}`}
            >
              <tab.icon size={18} className={tab.color} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-9">
          
          {/* 1. COST ASSUMPTIONS */}
          {activeSubTab === 'assumptions' && (
            <div className={`${GLOW_CARD} animate-in fade-in slide-in-from-bottom-2`}>
              <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">Global Cost Engine Variables</h3>
              <p className="text-sm text-white/60 mb-8">These values dynamically feed into the Feasibility Engine and BOQ generator.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#010810] p-5 rounded-xl border border-white/5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-2 block">Tier 1 Construction (₹/Sqft)</label>
                  <input type="number" value={sysConfig.costEngine.tier1Construction} onChange={(e) => setSysConfig({...sysConfig, costEngine: {...sysConfig.costEngine, tier1Construction: Number(e.target.value)}})} className="w-full bg-transparent text-xl font-black text-white outline-none border-b border-white/10 focus:border-[#D4AF37] pb-1 transition-colors" />
                </div>
                <div className="bg-[#010810] p-5 rounded-xl border border-white/5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-2 block">Tier 2 Construction (₹/Sqft)</label>
                  <input type="number" value={sysConfig.costEngine.tier2Construction} onChange={(e) => setSysConfig({...sysConfig, costEngine: {...sysConfig.costEngine, tier2Construction: Number(e.target.value)}})} className="w-full bg-transparent text-xl font-black text-white outline-none border-b border-white/10 focus:border-[#D4AF37] pb-1 transition-colors" />
                </div>
                <div className="bg-[#010810] p-5 rounded-xl border border-white/5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-2 block">Base Interest Rate (%)</label>
                  <input type="number" step="0.1" value={sysConfig.costEngine.interestRate} onChange={(e) => setSysConfig({...sysConfig, costEngine: {...sysConfig.costEngine, interestRate: Number(e.target.value)}})} className="w-full bg-transparent text-xl font-black text-blue-400 outline-none border-b border-white/10 focus:border-[#D4AF37] pb-1 transition-colors" />
                </div>
                <div className="bg-[#010810] p-5 rounded-xl border border-white/5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-2 block">Standard Equip/Bed (₹)</label>
                  <input type="number" value={sysConfig.costEngine.standardEquipPerBed} onChange={(e) => setSysConfig({...sysConfig, costEngine: {...sysConfig.costEngine, standardEquipPerBed: Number(e.target.value)}})} className="w-full bg-transparent text-xl font-black text-emerald-400 outline-none border-b border-white/10 focus:border-[#D4AF37] pb-1 transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* 2. NABH RULES */}
          {activeSubTab === 'nabh' && (
            <div className={`${GLOW_CARD} animate-in fade-in slide-in-from-bottom-2`}>
              <h3 className="text-xl font-black uppercase tracking-widest text-emerald-400 mb-6 border-b border-white/10 pb-4">Compliance Architecture</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-5 bg-[#010810] border border-white/5 rounded-xl">
                   <div>
                     <p className="font-bold text-white">Minimum Area Per Bed</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Triggers the Red Warning on Estimator</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="number" value={sysConfig.nabhRules.minAreaPerBed} className="w-20 bg-white/5 border border-white/10 rounded text-center font-black text-white p-2 outline-none" />
                     <span className="text-xs text-white/50">Sq.Ft</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between p-5 bg-[#010810] border border-white/5 rounded-xl">
                   <div>
                     <p className="font-bold text-white">ICU Bed Ratio</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Percentage of total beds required for critical care</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="number" value={sysConfig.nabhRules.icuBedPercentage} className="w-20 bg-white/5 border border-white/10 rounded text-center font-black text-white p-2 outline-none" />
                     <span className="text-xs text-white/50">%</span>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* 3. API INTEGRATIONS */}
          {activeSubTab === 'integrations' && (
            <div className={`${GLOW_CARD} animate-in fade-in slide-in-from-bottom-2`}>
              <h3 className="text-xl font-black uppercase tracking-widest text-amber-400 mb-6 border-b border-white/10 pb-4">External Connections</h3>
              <p className="text-sm text-white/60 mb-8">Manage API keys and secure connections to third-party services.</p>
              
              <div className="space-y-4">
                 {/* Supabase */}
                 <div className="p-5 rounded-xl border border-white/10 bg-[#010810] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400"><Database /></div>
                     <div><h4 className="font-black text-white">Supabase (PostgreSQL)</h4><p className="text-[10px] uppercase text-white/50 tracking-widest mt-1">Primary Database & Auth</p></div>
                   </div>
                   <div className="flex items-center gap-4 w-full md:w-auto">
                     <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/30"><CheckCircle2 size={12}/> Connected</span>
                     <button className="text-[10px] font-bold text-white/50 hover:text-white uppercase">Edit Key</button>
                   </div>
                 </div>

                 {/* Razorpay */}
                 <div className="p-5 rounded-xl border border-white/10 bg-[#010810] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><CreditCard /></div>
                     <div><h4 className="font-black text-white">Razorpay</h4><p className="text-[10px] uppercase text-white/50 tracking-widest mt-1">Payment Gateway for DPRs</p></div>
                   </div>
                   <div className="flex items-center gap-4 w-full md:w-auto">
                     <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/30"><AlertCircle size={12}/> Disconnected</span>
                     <button className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase rounded shadow-lg hover:bg-blue-400 transition-colors">Connect</button>
                   </div>
                 </div>

                 {/* OpenAI */}
                 <div className="p-5 rounded-xl border border-white/10 bg-[#010810] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400"><Bot /></div>
                     <div><h4 className="font-black text-white">OpenAI / LLM</h4><p className="text-[10px] uppercase text-white/50 tracking-widest mt-1">Powers the AIAssistant Agents</p></div>
                   </div>
                   <div className="flex items-center gap-4 w-full md:w-auto">
                     <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/30"><CheckCircle2 size={12}/> Connected</span>
                     <button className="text-[10px] font-bold text-white/50 hover:text-white uppercase">Edit Key</button>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* 4. RBAC (Roles) */}
          {activeSubTab === 'rbac' && (
            <div className={`${GLOW_CARD} animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center justify-center py-20 text-center`}>
               <Users className="w-16 h-16 text-[#D4AF37] mb-6 opacity-50" />
               <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Role-Based Access Control</h3>
               <p className="text-white/50 text-sm max-w-md mx-auto mb-8">Manage permissions for Admins, Master Consultants, and End-Clients. (Requires Supabase Auth Integration).</p>
               <button className="px-6 py-3 bg-[#0A2540] border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">Launch IAM Portal</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}