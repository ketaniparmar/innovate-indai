import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// STRICTLY FILTERED IMPORTS
import {
  Building2, Calculator, Grid, List, ClipboardCheck, Landmark, FileText, ShoppingCart,
  BarChart3, MapPin, Menu, X, TrendingUp, PieChart, Users, Layers, Cpu, Download,
  CheckCircle2, AlertCircle, FileWarning, Briefcase, ArrowRight, Clock, ClipboardList,
  Wallet, User, Phone, Mail, Globe, Activity, ShieldCheck, CreditCard, Settings,
  ArrowDown, Milestone
} from "lucide-react";

// --- 1. CORE CONFIGURATION ---
const supabaseUrl = "https://udljxsjkqdrpqmxamwkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbGp4c2prcWRycHFteGFtd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Mzg1NDAsImV4cCI6MjA4ODAxNDU0MH0.gXuw6cNBRr8HCAOOsB3Z3xYuUDeIvDlXXIcvhuTKe_c";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USER_CONFIG = { name: "Ketankumar Parmar", email: "director@hospitalprojectconsultancy.com" };

// --- 2. KNOWLEDGE BASE & ARRAYS ---
const GUJARAT_CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Vapi", "Bharuch"];
const PACKAGES = [
  { id: "free", name: "Basic Feasibility Brief", price: 0, desc: "High-level CAPEX & EBITDA snapshot." },
  { id: "standard", name: "Standard DPR", price: 2999, desc: "Includes NABH Spatial Benchmarks." },
  { id: "advanced", name: "Advanced NABH Report", price: 4999, desc: "Full Staffing & Department Zoning." }
];

// --- 3. UTILITY FUNCTIONS ---
const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl";
const formatINR = (val) => (!Number.isFinite(val) || val === 0) ? "₹0.00 Cr" : `₹${(val / 10000000).toFixed(2)} Cr`;
const safeToFixed = (val, decimals = 2) => (Number.isFinite(val) ? val : 0).toFixed(decimals);

function classifyHospital(beds) {
  const b = Math.max(1, beds);
  if (b <= 49) return { type: "Secondary Care", areaPerBed: 900, equipmentPercent: 0.35, operatingRatio: 0.65, arprob: 10000 };
  if (b <= 149) return { type: "Multi-Specialty", areaPerBed: 1100, equipmentPercent: 0.40, operatingRatio: 0.60, arprob: 15000 };
  return { type: "Tertiary Care", areaPerBed: 1400, equipmentPercent: 0.45, operatingRatio: 0.58, arprob: 22000 };
}

// --- 4. MAIN APPLICATION ---
export default function App() {
  const [activeTab, setActiveTab] = useState("estimator");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadActionType, setLeadActionType] = useState("");

  const [config, setConfig] = useState({ beds: 100, cityTier: 2, areaSqFt: 85000, occupancyRate: 70 });
  const [clientDetails, setClientDetails] = useState({ projectName: "Dahej Public Hospital", name: "", phone: "", email: "", city: "", state: "" });
  const [pricingState, setPricingState] = useState({ packageId: "free", promoCode: "", discountApplied: false });

  // DYNAMIC LOADING MESSAGES
  const loadingMessages = [
    "Waking up AI Engine...",
    "Analyzing NABH Protocols...",
    "Calculating CAPEX...",
    "Drafting Expert DPR...",
    "Generating Secure PDF...",
    "Finalizing Download..."
  ];
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isSyncing) {
      setLoadingIndex(0);
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isSyncing]);

  useEffect(() => {
    const hash = window.location.hash.replace('#/', '').toLowerCase();
    const validTabs = ['estimator', 'dpr', 'contact'];
    if (validTabs.includes(hash)) setActiveTab(hash);
  }, []);

  const engine = useMemo(() => {
    try {
      const b = Math.max(1, Number(config.beds) || 100);
      const a = Math.max(1, Number(config.areaSqFt) || 85000);
      const o = Math.max(1, Number(config.occupancyRate) || 70);
      const tConf = classifyHospital(b);
      const cps = config.cityTier === 1 ? 4200 : 3500;
      
      const sqFtPerBed = a / b;
      const nabhReady = sqFtPerBed >= (tConf.areaPerBed * 0.85);
      
      const constructionCost = a * cps;
      const hardCost = constructionCost + (constructionCost * tConf.equipmentPercent);
      const tCst = hardCost * 1.15; 
      
      const rev = b * (o / 100) * tConf.arprob * 365 * 1.35;
      const ebitda = rev - (rev * tConf.operatingRatio);
      
      return { type: tConf.type, nabhReady, totalProjectCost: tCst, ebitda };
    } catch (e) { return { type: "Error", nabhReady: false, totalProjectCost: 0, ebitda: 0 }; }
  }, [config]);

  // --- THE DIRECT DOWNLOAD CHECKOUT FUNCTION ---
  const handleDPRCheckout = async () => {
    if (!clientDetails.email || !clientDetails.name) return alert("Please enter your Name and Email.");
    setIsSyncing(true);
    
    try {
      const apiUrl = "https://innovate-india-suite.onrender.com/api/admin/generate-pdf"; 
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clientDetails.email,
          projectName: clientDetails.projectName || "New Hospital Project",
          bedCount: config.beds,
          specialtyFocus: engine.type,
          cityTier: config.cityTier,
          totalArea: config.areaSqFt,
          numFloors: "4"
        })
      });

      const result = await response.json();

      if (result.success && result.pdfBase64) {
        // TRIGGER BROWSER DOWNLOAD
        const linkSource = `data:application/pdf;base64,${result.pdfBase64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = `${(clientDetails.projectName || "Innovate_India").replace(/[^a-z0-9]/gi, '_')}_DPR_Report.pdf`;
        downloadLink.click();
        
        alert("Success! Your DPR Report has been downloaded to your device.");
      } else {
        alert("Failed to generate PDF. Check server logs.");
      }
    } catch (e) {
      alert("Could not connect to the backend engine.");
    }
    setIsSyncing(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#010810] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-300 w-72 bg-[#051626] border-r border-white/5 flex flex-col flex-shrink-0`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F1CF6D] flex items-center justify-center text-[#0A2540]"><Building2 className="w-6 h-6" /></div>
          <div><h1 className="font-black text-xl uppercase leading-none">Innovate <span className="text-[#D4AF37]">India</span></h1></div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setActiveTab("estimator")} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold uppercase text-[11px] ${activeTab === "estimator" ? 'bg-[#0A2540] text-[#D4AF37] border border-[#D4AF37]/30' : 'text-white/40 hover:text-white'}`}><Calculator className="w-5 h-5" /><span>Estimator</span></button>
            <button onClick={() => setActiveTab("dpr")} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold uppercase text-[11px] ${activeTab === "dpr" ? 'bg-[#0A2540] text-[#D4AF37] border border-[#D4AF37]/30' : 'text-white/40 hover:text-white'}`}><FileText className="w-5 h-5" /><span>DPR Checkout</span></button>
            <button onClick={() => setActiveTab("contact")} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold uppercase text-[11px] ${activeTab === "contact" ? 'bg-[#0A2540] text-[#D4AF37] border border-[#D4AF37]/30' : 'text-white/40 hover:text-white'}`}><MapPin className="w-5 h-5" /><span>Contact Us</span></button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {activeTab === "estimator" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={GLOW_CARD}>
              <h2 className="text-3xl font-black mb-6 uppercase text-[#D4AF37]">Project Parameters</h2>
              <div className="mb-6"><label className="text-[10px] uppercase font-bold text-white/50 block mb-2">Beds ({config.beds})</label><input type="range" min="30" max="500" step="5" value={config.beds} onChange={e=>setConfig({...config, beds: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
              <div className="mb-6"><label className="text-[10px] uppercase font-bold text-white/50 block mb-2">Area SqFt ({config.areaSqFt})</label><input type="range" min="20000" max="200000" step="5000" value={config.areaSqFt} onChange={e=>setConfig({...config, areaSqFt: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
            </div>
            <div className={GLOW_CARD}>
              <p className="text-[10px] uppercase font-bold text-white/50 mb-2">Total CAPEX Output</p>
              <p className="text-5xl font-black text-[#D4AF37] mb-6">{formatINR(engine.totalProjectCost)}</p>
              <button onClick={() => setActiveTab("dpr")} className="w-full bg-[#D4AF37] text-[#051626] font-black uppercase py-4 rounded-xl hover:scale-105 transition-transform">Generate DPR</button>
            </div>
          </div>
        )}

        {activeTab === "dpr" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className={GLOW_CARD}>
              <h2 className="text-2xl font-black uppercase mb-6 text-white">Packages</h2>
              {PACKAGES.map(pkg => (
                <button key={pkg.id} onClick={() => setPricingState({ packageId: pkg.id, promoCode: "", discountApplied: false })} className={`w-full text-left p-5 rounded-xl border-2 mb-4 ${pricingState.packageId === pkg.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/5 bg-[#051626]'}`}>
                  <div className="flex justify-between items-center mb-1"><span className="font-bold">{pkg.name}</span><span className={`font-black text-xl ${pricingState.packageId === pkg.id ? 'text-[#D4AF37]' : 'text-emerald-400'}`}>{pkg.price === 0 ? 'FREE' : `₹${pkg.price}`}</span></div>
                  <p className="text-[10px] text-white/50">{pkg.desc}</p>
                </button>
              ))}
            </div>

            <div className="bg-white text-[#0A2540] rounded-[30px] p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase mb-6">Client Details</h2>
                <input placeholder="Full Name" value={clientDetails.name} onChange={e=>setClientDetails({...clientDetails, name: e.target.value})} className="w-full border-b-2 border-gray-200 py-3 mb-4 outline-none text-lg font-bold text-[#0A2540]"/>
                <input placeholder="WhatsApp Number" value={clientDetails.phone} onChange={e=>setClientDetails({...clientDetails, phone: e.target.value})} className="w-full border-b-2 border-gray-200 py-3 mb-4 outline-none text-lg font-bold text-[#0A2540]"/>
                <input placeholder="Email Address" value={clientDetails.email} onChange={e=>setClientDetails({...clientDetails, email: e.target.value})} className="w-full border-b-2 border-gray-200 py-3 mb-4 outline-none text-lg font-bold text-[#0A2540]"/>
                <input placeholder="Project Name" value={clientDetails.projectName} onChange={e=>setClientDetails({...clientDetails, projectName: e.target.value})} className="w-full border-b-2 border-gray-200 py-3 mb-8 outline-none text-lg font-bold text-[#0A2540]"/>
              </div>
              <div>
                <button onClick={handleDPRCheckout} disabled={isSyncing} className="w-full bg-[#0A2540] text-[#D4AF37] py-5 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center gap-3 hover:scale-105 transition-transform overflow-hidden relative">
                  {isSyncing ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin shrink-0"/>
                      <span className="animate-pulse">{loadingMessages[loadingIndex]}</span>
                    </>
                  ) : "Claim Free Brief"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}