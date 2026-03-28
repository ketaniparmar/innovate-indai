import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

// ICON IMPORTS
import {
  Building2, Calculator, Grid, List, Brain, 
  BarChart3, FileText, Menu, Cloud, Lock, 
  CloudLightning, Users, Settings as SettingsIcon, 
  Activity, BellRing, ShieldCheck, User, Landmark, 
  Ruler, ChevronRight, X, LogOut
} from "lucide-react";

// MODULE IMPORTS [cite: 3-5]
import NABHAuditor from './modules/NABHAuditor';
import ProjectDashboard from './modules/ProjectDashboard';
import Estimator from './modules/Estimator';
import Architect from './modules/Architect';
import SmartBOQ from './modules/SmartBOQ';
import AIAssistant from './modules/AIAssistant';
import Dashboard from './modules/Dashboard';
import LeadCRM from './modules/LeadCRM';
import Settings from './modules/Settings'; 
import DPRBuilder from './modules/DPRBuilder';
import ProjectTracker from './modules/ProjectTracker';
import AuthModal from './modules/AuthModal'; 
import UpgradeDashboard from './modules/UpgradeDashboard';

// ============================================================================
// 1. CONFIGURATION & CONSTANTS [cite: 6-8]
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://udljxsjkqdrpqmxamwkd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbGp4c2prcWRycHFteGFtd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Mzg1NDAsImV4cCI6MjA4ODAxNDU0MH0.gXuw6cNBRr8HCAOOsB3Z3xYuUDeIvDlXXIcvhuTKe_c";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define missing classification logic for the math engine
const classifyHospital = (beds) => {
  if (beds <= 30) return { type: "Primary / Nursing Home", areaPerBed: 500, arprob: 8000, operatingRatio: 0.65 };
  if (beds <= 100) return { type: "Secondary Care", areaPerBed: 750, arprob: 15000, operatingRatio: 0.55 };
  return { type: "Tertiary Superspeciality", areaPerBed: 1000, arprob: 25000, operatingRatio: 0.45 };
};

const profiles = [
  { id: 'doctor', title: 'Doctor', icon: User, desc: 'Planning a private clinic or nursing home.' },
  { id: 'investor', title: 'Investor', icon: Landmark, desc: 'Exploring high-ROI healthcare assets.' },
  { id: 'architect', title: 'Architect', icon: Ruler, desc: 'NABH zoning & clinical infrastructure.' },
  { id: 'chain', title: 'Hospital Chain', icon: Building2, desc: 'Expansion & feasibility for 100+ beds.' }
];

// ============================================================================
// 2. THE MASTER APP COMPONENT [cite: 12]
// ============================================================================
export default function App() {
  // --- A. APP STATE [cite: 13-18] ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [session, setSession] = useState(null); 
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [intendedTab, setIntendedTab] = useState(null); 
  const [profileSelected, setProfileSelected] = useState(false);
  
  const [fomo, setFomo] = useState({ activeUsers: 14, reportsLeft: 2 });
  const [config, setConfig] = useState({ beds: 100, cityTier: 2, areaSqFt: 85000, occupancyRate: 70 });
  const [sim, setSim] = useState({ occ: 70, arpoB: 15000, equity: 30 }); 
  const [archInputs, setArchInputs] = useState({ landArea: "45000", floors: "4", specialties: "OPD, Trauma, Burn Unit, ICU, 3 OTs, Radiology", parking: "Basement + Surface Parking" });
  const [clientDetails, setClientDetails] = useState({ projectName: "New Greenfield Hospital", name: "", phone: "", email: "", city: "", state: "" });

  // Moved fetchCityIntelligence inside scope [cite: 9-11]
  const fetchCityIntelligence = async (cityName) => {
    const { data } = await supabase.from('city_intelligence').select('*').eq('city_name', cityName).single();
    if (data) {
      setSim(prev => ({ ...prev, arpoB: data.avg_arpo, occ: data.base_occupancy * 100 }));
      setConfig(prev => ({ ...prev, cityTier: data.tier }));
    }
  };

  // --- B. ENGINES [cite: 19-22] ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    
    const interval = setInterval(() => {
      setFomo(prev => ({ 
        activeUsers: Math.max(5, Math.min(24, prev.activeUsers + Math.floor(Math.random() * 3 - 1))),
        reportsLeft: Math.random() > 0.9 ? Math.max(1, prev.reportsLeft - 1) : prev.reportsLeft
      }));
    }, 8000);

    return () => { subscription.unsubscribe(); clearInterval(interval); };
  }, []);

  // --- C. MATH ENGINES  ---
  const engine = useMemo(() => {
    const beds = Math.max(1, Number(config.beds));
    const area = Math.max(1000, Number(config.areaSqFt));
    const tConf = classifyHospital(beds);
    const cps = config.cityTier === 1 ? 4200 : config.cityTier === 2 ? 3500 : 2800;
    
    const constructionCost = area * cps;
    const icuCount = Math.ceil(beds * 0.2); 
    const otCount = Math.ceil(beds / 30);
    const equipCost = (beds * 1200000) + (icuCount * 10000000) + (otCount * 25000000);
    const tCst = constructionCost + equipCost; 
    const rev = beds * (config.occupancyRate / 100) * (tConf.arprob + (icuCount * 2000)) * 365 * 1.35; 
    const ebitda = rev - (rev * tConf.operatingRatio);
    const loanAmt = tCst * (1 - (sim.equity / 100));
    const emi = (loanAmt * (0.105 / 12) * Math.pow(1 + 0.105/12, 120)) / (Math.pow(1 + 0.105/12, 120) - 1) * 12;

    return { 
      type: tConf.type, totalProjectCost: tCst, totalRevenue: rev, ebitda, beds, area,
      dscr: emi > 0 ? ebitda / emi : 0, annualEMI: emi, operatingRatio: tConf.operatingRatio 
    };
  }, [config, sim.equity]);

  const simEngine = useMemo(() => {
    const rev = (engine.beds * (sim.occ / 100) * sim.arpoB * 365 * 1.35); 
    const ebitda = rev - (rev * engine.operatingRatio); 
    const emiCr = engine.annualEMI / 10000000; 
    const dscr = emiCr > 0 ? (ebitda / 10000000) / emiCr : 0;
    return { ebitda: (ebitda/10000000).toFixed(2), dscr: dscr.toFixed(2) };
  }, [engine, sim]);

  // --- D. NAVIGATION [cite: 36-41] ---
  const navItems = [
    { id: "dashboard", label: "Project Command", icon: BarChart3, requiredPlan: "FREE" }, 
    { id: "audit", label: "NABH Auditor", icon: ShieldCheck, requiredPlan: "PRO" },
    { id: "estimator", label: "Feasibility Engine", icon: Calculator, requiredPlan: "FREE" }, 
    { id: "architect", label: "AI Architect", icon: Grid, requiredPlan: "PRO" },
    { id: "intelligence", label: "AI Co-Pilot", icon: Brain, requiredPlan: "PRO" }, 
    { id: "dpr", label: "DPR Checkout", icon: FileText, requiredPlan: "FREE" }, 
    { id: "crm", label: "Deal Pipeline", icon: Users, requiredPlan: "ENTERPRISE" },
    { id: "tracker", label: "Client Portal", icon: Activity, requiredPlan: "PRO" }
  ];

  const handleTabClick = (item) => {
    if (item.requiredPlan === "FREE" || session) {
      setActiveTab(item.id);
      setIsMobileMenuOpen(false);
    } else {
      setIntendedTab(item.id);
      setShowAuthModal(true);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#010810] text-white font-sans overflow-hidden">
      
      {/* FOMO BANNER [cite: 42] */}
      <div className="absolute top-0 left-0 w-full bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-[0.2em] py-1.5 flex justify-center items-center gap-4 z-50">
         <BellRing size={12} className="animate-bounce" /> 
         <span>LIVE: {fomo.activeUsers} PROMOTERS ONLINE</span> | <span>ONLY {fomo.reportsLeft} DPR SLOTS LEFT TODAY</span>
      </div>

      {/* SIDEBAR [cite: 43-52] */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-300 w-72 bg-[#051626] border-r border-white/5 flex flex-col pt-8 shrink-0`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3 mt-4 md:mt-0">
          <Building2 className="text-[#D4AF37]" size={32} />
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase">INNOVATE <span className="text-[#D4AF37]">INDAI</span></span>
            <span className="text-[7px] text-[#D4AF37] uppercase tracking-widest font-black">Hospital Operating System</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item)} className={`w-full flex items-center justify-between p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === item.id ? 'bg-[#0A2540] text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'text-white/40 hover:bg-white/5'}`}>
              <div className="flex items-center gap-4"><item.icon size={18} /><span>{item.label}</span></div>
              {(item.requiredPlan !== "FREE" && !session) && <Lock size={12} />}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT [cite: 52-53] */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_#0A2540_0%,_#010810_80%)]">
        
        <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 backdrop-blur-md shrink-0 mt-6 md:mt-0">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white"><Menu size={28} /></button>
          <div className="flex gap-4 items-center">
            {session ? (
              <button onClick={() => supabase.auth.signOut()} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase"><LogOut size={16}/> Logout</button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-[#D4AF37] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)]">Admin Login</button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {!profileSelected ? (
              <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full flex flex-col items-center justify-center p-10">
                <div className="text-center mb-16">
                  <h3 className="text-white/30 text-[10px] uppercase font-black tracking-[0.4em] mb-4">Identity Verification Required</h3>
                  <h1 className="text-5xl font-black italic">WHO ARE YOU <span className="text-[#D4AF37]">BUILDING</span> FOR?</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
                  {profiles.map((p) => (
                    <motion.button key={p.id} whileHover={{ scale: 1.05, y: -10 }} whileTap={{ scale: 0.95 }} onClick={() => setProfileSelected(true)}
                      className="group relative bg-[#051626] border border-white/10 p-10 rounded-[40px] text-left transition-all hover:border-[#D4AF37]/50 shadow-2xl overflow-hidden"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-amber-600 rounded-[40px] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-8 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                          <p.icon size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{p.title}</h3>
                        <p className="text-white/40 text-[10px] font-bold leading-relaxed mb-8">{p.desc}</p>
                        <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                          Launch Platform <ChevronRight size={14} />
                        </div>
                      </div>
                      <span className="absolute -bottom-6 -right-4 text-white/5 font-black text-8xl italic uppercase select-none pointer-events-none">{p.id}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="workspace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 max-w-[1600px] mx-auto">
                {activeTab === "dashboard" && <ProjectDashboard config={config} setConfig={setConfig} clientDetails={clientDetails} setClientDetails={setClientDetails} engine={engine} handleTabClick={handleTabClick} session={session} />}
                {activeTab === "audit" && <NABHAuditor />}
                {activeTab === "estimator" && <Estimator config={config} setConfig={setConfig} engine={engine} setActiveTab={setActiveTab} />}
                {activeTab === "architect" && <Architect config={config} archInputs={archInputs} setArchInputs={setArchInputs} engine={engine} setActiveTab={setActiveTab} />}
                {activeTab === "intelligence" && <AIAssistant config={config} engine={engine} sim={sim} simEngine={simEngine} />}
                {activeTab === "dpr" && <DPRBuilder config={config} engine={engine} sim={sim} simEngine={simEngine} clientDetails={clientDetails} setClientDetails={setClientDetails} />}
                {activeTab === "crm" && <LeadCRM rawLeads={[]} />}
                {activeTab === "tracker" && <ProjectTracker />}
                {activeTab === "upgrade" && <UpgradeDashboard config={config} engine={engine} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="h-12 border-t border-white/5 bg-[#010810] flex items-center justify-center text-[8px] text-white/20 uppercase font-bold tracking-[0.3em] shrink-0">
          &copy; {new Date().getFullYear()} Innovate IndAI | Hospital Project Consultancy Systems [cite: 59]
        </footer>
      </main>

      {showAuthModal && (
        <AuthModal 
          supabase={supabase} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={(s) => { 
            setSession(s); 
            setShowAuthModal(false); 
            if(intendedTab) setActiveTab(intendedTab); 
          }} 
        />
      )}
    </div>
  );
}