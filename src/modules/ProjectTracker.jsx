// src/modules/ProjectTracker.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Circle, Activity, 
  User, ListTodo, ArrowRight, ShieldCheck, 
  MessageSquare, FileText
} from 'lucide-react';

const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl";

export default function ProjectTracker() {
  const [role, setRole] = useState('consultant'); // 'consultant' or 'client'
  const [activeStage, setActiveStage] = useState('dpr');

  // --- MOCK DATABASE STATE ---
  const [stages, setStages] = useState([
    { id: 'lead', name: 'Lead Qualified', progress: 100, status: 'completed' },
    { id: 'planning', name: 'Clinical Planning', progress: 100, status: 'completed' },
    { id: 'estimation', name: 'Capex Estimation', progress: 100, status: 'completed' },
    { id: 'design', name: 'Architectural Design', progress: 100, status: 'completed' },
    { id: 'dpr', name: 'Master DPR', progress: 60, status: 'in_progress' },
    { id: 'review', name: 'Bank Review', progress: 0, status: 'pending' },
    { id: 'completed', name: 'Syndication Closed', progress: 0, status: 'pending' }
  ]);

  const [tasks, setTasks] = useState({
    dpr: [
      { id: 't1', name: 'Executive Summary & Vision', status: 'completed' },
      { id: 't2', name: 'Financial Projections (10-Yr)', status: 'completed' },
      { id: 't3', name: 'Medical Equipment BOQ', status: 'in_progress' },
      { id: 't4', name: 'NABH Compliance Matrix', status: 'in_progress' },
      { id: 't5', name: 'Risk & Sensitivity Analysis', status: 'pending' }
    ],
    design: [
      { id: 'd1', name: 'Zoning & Patient Flow', status: 'completed' },
      { id: 'd2', name: 'Department Area Statements', status: 'completed' },
      { id: 'd3', name: 'AutoCAD Export', status: 'completed' }
    ]
  });

  const [logs, setLogs] = useState([
    { id: 1, action: "DPR Stage progress updated to 60%", user: "Innovate IndAI Consultant", time: "2 hours ago", type: "update" },
    { id: 2, action: "Financial Projections marked as Completed", user: "Innovate IndAI Consultant", time: "3 hours ago", type: "task" },
    { id: 3, action: "Architectural Design approved by client", user: "Apex Group (Client)", time: "Yesterday", type: "approval" },
    { id: 4, action: "Capex Estimation finalized at ₹120 Cr", user: "System Auto-Trigger", time: "2 days ago", type: "system" }
  ]);

  // --- SMART PROGRESS ENGINE ---
  const updateTaskStatus = (stageId, taskId, newStatus) => {
    // 1. Update the specific task
    const updatedTasks = { ...tasks };
    const taskIndex = updatedTasks[stageId].findIndex(t => t.id === taskId);
    const taskName = updatedTasks[stageId][taskIndex].name;
    updatedTasks[stageId][taskIndex].status = newStatus;
    setTasks(updatedTasks);

    // 2. Auto-calculate overall stage progress
    const stageTasks = updatedTasks[stageId];
    const completedTasks = stageTasks.filter(t => t.status === 'completed').length;
    const newProgress = Math.round((completedTasks / stageTasks.length) * 100);

    // 3. Update macro stage status
    const updatedStages = [...stages];
    const stageIndex = updatedStages.findIndex(s => s.id === stageId);
    updatedStages[stageIndex].progress = newProgress;
    if (newProgress === 100) updatedStages[stageIndex].status = 'completed';
    else if (newProgress > 0) updatedStages[stageIndex].status = 'in_progress';
    else updatedStages[stageIndex].status = 'pending';
    setStages(updatedStages);

    // 4. Push to Audit Log (Activity Feed)
    const newLog = {
      id: Date.now(),
      action: `"${taskName}" marked as ${newStatus.replace('_', ' ')}`,
      user: role === 'consultant' ? 'Innovate IndAI Consultant' : 'Client',
      time: 'Just now',
      type: 'task'
    };
    setLogs([newLog, ...logs]);
  };

  const activeStageData = stages.find(s => s.id === activeStage);
  const activeTasks = tasks[activeStage] || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      
      {/* --- HEADER & ROLE TOGGLE --- */}
      <div className="bg-[#051626] border border-[#D4AF37]/30 p-8 rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-[#D4AF37] w-8 h-8" />
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Live Tracker</h2>
          </div>
          <p className="text-white/60 text-sm">Project: <strong className="text-white">Apex Greenfield Hospital</strong></p>
        </div>
        
        {/* The Role Switcher (For Demo Purposes) */}
        <div className="flex items-center bg-[#010810] p-1.5 rounded-full border border-white/10 relative z-10">
           <button onClick={() => setRole('consultant')} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${role === 'consultant' ? 'bg-[#D4AF37] text-[#051626] shadow-lg' : 'text-white/50 hover:text-white'}`}>Consultant View</button>
           <button onClick={() => setRole('client')} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${role === 'client' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>Client View</button>
        </div>
      </div>

      {/* --- MACRO RIBBON (TIMELINE) --- */}
      <div className={`${GLOW_CARD} overflow-x-auto custom-scrollbar`}>
        <div className="flex items-center justify-between min-w-max px-4">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div 
                onClick={() => setActiveStage(stage.id)}
                className={`flex flex-col items-center gap-3 cursor-pointer group w-32 ${activeStage === stage.id ? 'scale-110 transition-transform' : 'opacity-70 hover:opacity-100'}`}
              >
                {/* Status Icon Node */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-[#051626]
                  ${stage.status === 'completed' ? 'border-emerald-400 text-emerald-400' : 
                    stage.status === 'in_progress' ? 'border-amber-400 text-amber-400' : 
                    'border-white/20 text-white/20'}
                  ${activeStage === stage.id ? 'shadow-[0_0_15px_rgba(212,175,55,0.3)] border-[#D4AF37] text-[#D4AF37]' : ''}
                `}>
                  {stage.status === 'completed' ? <CheckCircle2 size={18} /> : 
                   stage.status === 'in_progress' ? <Activity size={18} className="animate-pulse" /> : 
                   <Clock size={18} />}
                </div>
                
                {/* Label & Progress */}
                <div className="text-center">
                  <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeStage === stage.id ? 'text-[#D4AF37]' : 'text-white/80'}`}>{stage.name}</p>
                  <p className="text-[9px] text-white/50 font-bold mt-1">{stage.progress}%</p>
                </div>
              </div>

              {/* Connecting Line */}
              {index < stages.length - 1 && (
                <div className="flex-1 h-1 bg-white/10 mx-2 relative min-w-[50px]">
                  <div className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-1000" style={{ width: stage.status === 'completed' ? '100%' : '0%' }}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- SPLIT VIEW: GRANULAR TASKS & AUDIT LOG --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* LEFT COLUMN: Granular Tasks */}
        <div className="lg:col-span-7 space-y-6">
          <div className={GLOW_CARD}>
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
               <div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                   {activeStageData.name} <span className="text-[#D4AF37]">{activeStageData.progress}%</span>
                 </h3>
                 <p className="text-white/50 text-xs mt-2 font-bold uppercase tracking-widest">Granular Task Breakdown</p>
               </div>
            </div>

            {activeTasks.length === 0 ? (
              <div className="py-12 text-center text-white/30 border-2 border-dashed border-white/10 rounded-2xl">
                 <ListTodo className="mx-auto w-10 h-10 mb-3 opacity-50" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No detailed tasks configured for this stage yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTasks.map(task => (
                  <div key={task.id} className="bg-[#010810] p-4 md:p-5 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-colors">
                     <div className="flex items-center gap-3">
                        {task.status === 'completed' ? <CheckCircle2 className="text-emerald-400 shrink-0" size={20}/> : 
                         task.status === 'in_progress' ? <Activity className="text-amber-400 shrink-0 animate-pulse" size={20}/> : 
                         <Circle className="text-white/20 shrink-0" size={20}/>}
                        <span className={`font-bold text-sm ${task.status === 'completed' ? 'text-white/60 line-through decoration-emerald-500/50' : 'text-white'}`}>{task.name}</span>
                     </div>
                     
                     {/* Interactive Controls for Consultant, Static Badges for Client */}
                     {role === 'consultant' ? (
                       <select 
                         value={task.status} 
                         onChange={(e) => updateTaskStatus(activeStage, task.id, e.target.value)}
                         className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg outline-none cursor-pointer border transition-colors
                           ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                             task.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                             'bg-white/5 text-white/50 border-white/10'}`}
                       >
                         <option value="pending">Pending</option>
                         <option value="in_progress">In Progress</option>
                         <option value="completed">Completed</option>
                       </select>
                     ) : (
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded border
                           ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                             task.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                             'bg-white/5 text-white/50 border-white/10'}`}>
                         {task.status.replace('_', ' ')}
                       </span>
                     )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Activity Feed (Audit Log) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`${GLOW_CARD} h-full`}>
             <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2"><Clock className="text-[#D4AF37]"/> Live Audit Log</h4>
             
             <div className="relative pl-6 border-l border-white/10 space-y-8 before:absolute before:top-0 before:bottom-0 before:left-[-1px] before:w-[2px] before:bg-gradient-to-b from-[#D4AF37] to-transparent">
                {logs.map((log, i) => (
                  <div key={log.id} className="relative animate-in fade-in slide-in-from-left-4">
                     {/* Timeline Dot */}
                     <div className={`absolute -left-[31px] w-3 h-3 rounded-full border-2 border-[#051626] ${i === 0 ? 'bg-[#D4AF37] animate-pulse' : 'bg-white/30'}`}></div>
                     
                     <div className="bg-[#010810] p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                        <p className="text-xs text-white/90 font-bold leading-relaxed mb-2">{log.action}</p>
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-black text-white/40">
                           <span className="flex items-center gap-1"><User size={10} className="text-[#D4AF37]"/> {log.user}</span>
                           <span>{log.time}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}