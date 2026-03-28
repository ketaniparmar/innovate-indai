// src/modules/LeadCRM.jsx
import React, { useMemo } from 'react';
import { 
  Users, TrendingUp, DollarSign, Phone, Mail, 
  MessageCircle, MoreVertical, Filter, Clock, CheckCircle2 
} from 'lucide-react';
import { calculatePipelineMetrics } from '../utils/crmEngine';

const formatINR = (val) => `₹${(val / 10000000).toFixed(2)} Cr`;
const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 shadow-xl";

export default function LeadCRM({ rawLeads }) {
  const crmData = useMemo(() => calculatePipelineMetrics(rawLeads), [rawLeads]);

  const stages = [
    { id: 'lead', name: 'New Leads', color: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    { id: 'qualified', name: 'Qualified', color: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    { id: 'proposal', name: 'Proposal Sent', color: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    { id: 'closed', name: 'Closed Won', color: 'border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      
      {/* Header & Ribbon */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white flex items-center gap-3">
              <Users className="text-[#D4AF37] w-8 h-8 md:w-10 md:h-10" /> Deal <span className="text-[#D4AF37]">Pipeline</span>
            </h2>
            <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Consultant Lead Management & CRM</p>
          </div>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors text-white flex items-center gap-2">
            <Filter size={14}/> Filter Pipeline
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={GLOW_CARD}>
            <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><DollarSign size={14}/> Total Pipeline Value</p>
            <p className="text-4xl font-black text-white">{formatINR(crmData.totalValue)}</p>
          </div>
          <div className={GLOW_CARD}>
            <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><Users size={14}/> Active Leads</p>
            <p className="text-4xl font-black text-blue-400">{crmData.totalLeads}</p>
          </div>
          <div className={GLOW_CARD}>
            <p className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14}/> Conversion Rate</p>
            <p className="text-4xl font-black text-emerald-400">{crmData.conversionRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {stages.map(stage => (
            <div key={stage.id} className="w-[320px] flex flex-col gap-4">
              
              {/* Column Header */}
              <div className={`p-4 rounded-xl border border-white/5 bg-[#010810]/50 flex justify-between items-center border-t-4 ${stage.color}`}>
                <h4 className={`font-black uppercase tracking-widest text-xs ${stage.text}`}>{stage.name}</h4>
                <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{crmData.pipeline[stage.id].length}</span>
              </div>

              {/* Column Cards */}
              <div className="flex flex-col gap-4 flex-1">
                {crmData.pipeline[stage.id].map(lead => (
                  <div key={lead.id} className="bg-[#0A2540] border border-white/5 p-5 rounded-2xl shadow-lg hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${stage.bg} ${stage.text} border-current/20`}>
                        {formatINR(lead.value)}
                      </span>
                      <button className="text-white/20 hover:text-white"><MoreVertical size={14}/></button>
                    </div>
                    
                    <h3 className="font-black text-white text-base leading-tight mb-1">{lead.project}</h3>
                    <p className="text-xs text-white/60 font-medium mb-4 flex items-center gap-1.5"><User size={12}/> {lead.name}</p>
                    
                    <div className="bg-[#010810] p-3 rounded-lg border border-white/5 mb-4 space-y-2">
                       <p className="text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Zap size={10} className="text-[#D4AF37]"/> Source: {lead.source}</p>
                       <p className="text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Clock size={10} className="text-blue-400"/> Activity: {lead.time}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-1.5 hover:bg-emerald-500 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest">
                        <MessageCircle size={12}/> WA
                      </button>
                      <button className="flex-1 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg flex items-center justify-center gap-1.5 hover:bg-blue-500 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest">
                        <Mail size={12}/> Email
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Empty State for Column */}
                {crmData.pipeline[stage.id].length === 0 && (
                  <div className="h-24 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/20 text-[10px] font-black uppercase tracking-widest">
                    Drop Leads Here
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}