import React, { useState, useEffect } from 'react';
import { Users, IndianRupee, Activity, Box, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalLeads: 142,
    revenue: 285000,
    dprConversions: 18,
    equipmentRequests: 7
  });

  const [recentLeads, setRecentLeads] = useState([
    { id: 1, name: "Dr. Sharma", city: "Bharuch", beds: 50, tier: "Advanced (₹4,999)", status: "Hot - Nurture Sequence Day 2" },
    { id: 2, name: "Apex Healthcare", city: "Ankleshwar", beds: 120, tier: "DPR Pro (₹75K)", status: "Paid - Awaiting Strategy Call" },
    { id: 3, name: "City Care Clinic", city: "Navsari", beds: 30, tier: "Free Feasibility", status: "Cold" },
  ]);

  const [equipmentLeads, setEquipmentLeads] = useState([
    { id: 101, hospital: "Novalifeline Superspeciality", item: "Diacare Solution / Lepu OCI Dialyzers", quantity: "Bulk (50 units)", region: "South Gujarat", urgency: "High" }
  ]);

  return (
    <div className="min-h-screen bg-[#010810] p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">Innovate India <span className="text-[#D4AF37]">Command Center</span></h1>
            <p className="text-white/50 text-sm mt-2 uppercase tracking-widest">Live Revenue & Project Operating System</p>
          </div>
          <div className="text-right">
            <p className="text-[#D4AF37] font-bold">Admin: Ketan</p>
            <p className="text-white/40 text-xs">System Status: Online & Tracking</p>
          </div>
        </div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <MetricCard icon={Users} title="Total Leads (30d)" value={metrics.totalLeads} trend="+12%" color="text-blue-400" />
          <MetricCard icon={IndianRupee} title="SaaS Revenue" value={`₹${metrics.revenue.toLocaleString()}`} trend="+8.4%" color="text-emerald-400" />
          <MetricCard icon={Activity} title="DPR Conversions" value={metrics.dprConversions} trend="+3" color="text-[#D4AF37]" />
          <MetricCard icon={Box} title="Equipment RFQs" value={metrics.equipmentRequests} trend="Needs Action" color="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT LEADS CRM (Takes up 2/3 width) */}
          <div className="lg:col-span-2 bg-[#051626] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white uppercase">SaaS Pipeline & Conversions</h2>
              <button className="text-[#D4AF37] text-sm hover:underline flex items-center gap-1">View All <ArrowUpRight size={16}/></button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/10">
                    <th className="pb-4">Client / Project</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4">Capacity</th>
                    <th className="pb-4">Current Tier</th>
                    <th className="pb-4">Funnel Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-white font-bold">{lead.name}</td>
                      <td className="py-4 text-white/70">{lead.city}</td>
                      <td className="py-4 text-white/70">{lead.beds} Beds</td>
                      <td className="py-4 text-[#D4AF37]">{lead.tier}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.status.includes('Paid') ? 'bg-emerald-500/10 text-emerald-400' : lead.status.includes('Hot') ? 'bg-orange-500/10 text-orange-400' : 'bg-white/10 text-white/50'}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* VENDOR & EQUIPMENT DISTRIBUTION DESK */}
          <div className="bg-[#0A2540] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white uppercase mb-2">Distribution Desk</h2>
            <p className="text-white/50 text-xs mb-6">Live Procurement Inquiries</p>
            
            <div className="flex-1 space-y-4">
              {equipmentLeads.map((req) => (
                <div key={req.id} className="bg-[#010810] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                  <h3 className="text-white font-bold text-sm mb-1">{req.hospital}</h3>
                  <p className="text-white/60 text-xs mb-3">{req.region} Territory</p>
                  
                  <div className="bg-white/5 p-3 rounded-lg mb-3 border border-white/5">
                    <p className="text-[#D4AF37] text-xs font-bold">{req.item}</p>
                    <p className="text-white/80 text-xs mt-1">Req: {req.quantity}</p>
                  </div>
                  
                  <button className="w-full bg-purple-500/20 text-purple-300 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all">
                    Process Quotation
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ icon: Icon, title, value, trend, color }) {
  return (
    <div className="bg-[#051626] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
          <Icon size={24} />
        </div>
        <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">{trend}</span>
      </div>
      <div>
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}