import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Ruler, Info } from 'lucide-react';

const NABH_STANDARDS = {
  general_ward: { min: 7.0, label: "General Ward (per bed)", unit: "sq.m" },
  icu: { min: 12.0, label: "ICU Bed Space", unit: "sq.m" },
  major_ot: { min: 42.0, label: "Major OT (Super-specialty)", unit: "sq.m" },
  minor_ot: { min: 25.0, label: "Minor OT / Procedure Room", unit: "sq.m" },
  labor_room: { min: 20.0, label: "Labor/Delivery Room", unit: "sq.m" }
};

const NABHAuditor = () => {
  const [inputs, setInputs] = useState({ type: 'general_ward', width: '', length: '' });

  const currentArea = (inputs.width * inputs.length) || 0;
  const standard = NABH_STANDARDS[inputs.type];
  const isPassing = currentArea >= standard.min;
  const gap = standard.min - currentArea;

  return (
    <div className="bg-[#051626] border border-white/5 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]"><ShieldCheck /></div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">NABH AI Auditor</h2>
          <p className="text-white/40 text-xs uppercase font-bold tracking-widest">Structural Compliance Engine v5.1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* ROOM SELECTOR */}
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Room Type</label>
          <select 
            value={inputs.type}
            onChange={(e) => setInputs({...inputs, type: e.target.value})}
            className="w-full bg-[#0A2540] border border-white/10 text-white p-4 rounded-xl focus:border-[#D4AF37] outline-none"
          >
            {Object.entries(NABH_STANDARDS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* DIMENSIONS */}
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Width (Meters)</label>
          <input 
            type="number" 
            placeholder="eg. 3.5"
            value={inputs.width}
            onChange={(e) => setInputs({...inputs, width: e.target.value})}
            className="w-full bg-[#0A2540] border border-white/10 text-white p-4 rounded-xl focus:border-[#D4AF37] outline-none" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 font-black uppercase tracking-widest">Length (Meters)</label>
          <input 
            type="number" 
            placeholder="eg. 4.0"
            value={inputs.length}
            onChange={(e) => setInputs({...inputs, length: e.target.value})}
            className="w-full bg-[#0A2540] border border-white/10 text-white p-4 rounded-xl focus:border-[#D4AF37] outline-none" 
          />
        </div>
      </div>

      {/* AUDIT RESULT CARD */}
      <div className={`p-8 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${isPassing ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isPassing ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {isPassing ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase ${isPassing ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPassing ? 'Audit: PASS' : 'Audit: FAILED'}
            </h3>
            <p className="text-white text-lg font-bold">Current Area: {currentArea.toFixed(2)} sq.m</p>
            <p className="text-white/40 text-xs italic mt-1">NABH Minimum Required: {standard.min} {standard.unit}</p>
          </div>
        </div>

        {!isPassing && (
          <div className="bg-red-500 text-white font-black px-6 py-3 rounded-xl animate-pulse text-sm">
            CRITICAL GAP: {gap.toFixed(2)} SQ.M
          </div>
        )}
      </div>

      <div className="mt-8 flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
        <Info className="text-[#D4AF37] shrink-0" size={18} />
        <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-wider">
          Pro-Tip: NABH 5th Edition requires specific "Clearance Zones" around the bed for crash-cart access. 
          Simply meeting the area is not enough; your door width must be at least 1.2m for stretcher movement.
        </p>
      </div>
    </div>
  );
};

export default NABHAuditor;