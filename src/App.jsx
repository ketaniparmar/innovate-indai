import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// STRICTLY FILTERED IMPORTS
import {
  Building2, Calculator, Grid, List, ClipboardCheck, Landmark, FileText, ShoppingCart,
  BarChart3, MapPin, Menu, X, TrendingUp, PieChart, Users, Layers, Cpu, Download,
  CheckCircle2, AlertCircle, FileWarning, Briefcase, ArrowRight, Clock, ClipboardList,
  Wallet, User, Phone, Mail, Globe, Activity, ShieldCheck, CreditCard, Zap, Star, Check, 
  PlusCircle, Brain, FileSearch, ShieldAlert, Target, Map, Box, Save, Timer, BellRing, 
  TrendingDown, Cloud, Database, Settings
} from "lucide-react";

// ============================================================================
// 1. CORE CONFIGURATION (SECURED)
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:10000" : "https://innovate-india-suite.onrender.com";

const USER_CONFIG = { email: "director@hospitalprojectconsultancy.com", role: "VERIFIED CONSULTANT" };// ============================================================================
// 2. FULL DATA ARRAYS
// ============================================================================
const GUJARAT_CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Gandhidham", "Anand", "Navsari", "Morbi", "Bharuch", "Vapi"];

const PACKAGES = [
  { id: "free", name: "Free Insight", basePrice: 0, promoPrice: 0, tag: "Basic", features: ["Feasibility Score", "Basic Costing", "Location AI"] },
  { id: "standard", name: "Standard DPR", basePrice: 4999, promoPrice: 3449, tag: "Entry", features: ["Detailed PDF", "Revenue Model", "Basic Planning"] },
  { id: "advanced", name: "Professional", basePrice: 8999, promoPrice: 5749, tag: "Most Popular", popular: true, features: ["NABH Gaps", "Staffing Plan", "Infection Layout"] },
  { id: "financial", name: "Investor Pack", basePrice: 14999, promoPrice: 11499, tag: "Bank Ready", features: ["5-Year P&L", "Investor PPT", "Break-Even Analysis"] },
  { id: "complete", name: "Complete Kit", basePrice: 24999, promoPrice: 17249, tag: "Priority Delivery", features: ["CAD DXF Exports", "Full AI Audit", "Bank Syndication"] }
];

const ADD_ONS_LIST = [{ id: "excel", name: "Financial Excel", price: 999 }, { id: "script", name: "Investor Pitch Script", price: 1999 }, { id: "layout", name: "Layout Concepts", price: 2999 }, { id: "nabh", name: "NABH Toolkit", price: 4999 }];

const VENDOR_DIRECTORY = [
  { id: 1, name: "Lepu Medical", category: "Equipment Supplier", location: "Surat, India", rating: 4.9 },
  { id: 2, name: "Diacare Solutions", category: "Turnkey Setup", location: "Ahmedabad, India", rating: 4.8 },
  { id: 3, name: "BuildMed Infra", category: "Contractor", location: "Mumbai, India", rating: 4.7 },
  { id: 4, name: "CareArch Planners", category: "Architect", location: "Delhi, India", rating: 4.9 }
];

const LOAN_TYPES = [
  { title: "1. Project Finance Loan", desc: "For construction & infra. 10-15 yrs tenure, 12-24 months moratorium." },
  { title: "2. Medical Equipment Loan", desc: "For CT, MRI, Cath Lab, ICU. 5-7 yrs tenure. Equipment used as collateral." },
  { title: "3. Term Loan for Business", desc: "Expansion, renovation, adding ICUs, or building additional floors." },
  { title: "4. Working Capital Loan", desc: "Daily operations (staff, pharmacy, consumables). Cash Credit or Overdraft." },
  { title: "5. Doctor Professional Loan", desc: "Fast approval, less collateral, based on professional income." },
  { title: "6. Commercial Property Loan", desc: "Specifically for buying a hospital building or medical office space." },
  { title: "7. Lease Financing", desc: "Medical Equipment Leasing for lower upfront cost and tax advantages." },
  { title: "8. Government Subsidy Loans", desc: "Capital Subsidy (Max ₹10 Cr) & Interest Subvention (7 years) via state policies." },
  { title: "9. Private Equity / Investment", desc: "Hospitals raising funds from investors like TPG Capital or KKR." },
  { title: "10. Vendor Financing", desc: "Equipment OEMs offer financing through partner banks." }
];

const DPR_STRUCTURE = ["1. Executive Summary", "2. Promoter Profile", "3. Market Analysis", "4. Hospital Concept", "5. Infrastructure Plan", "6. Medical Equipment BOQ", "7. Manpower Strategy", "8. Regulatory & Compliance", "9. Project Cost (CAPEX)", "10. Revenue Model", "11. 10-Year Projections", "12. ROI Analysis", "13. SWOT Analysis", "14. Subsidies"];

const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500 relative overflow-hidden";

const formatINR = (val) => val === 0 || isNaN(val) ? "₹0.00 Cr" : `₹${(val / 10000000).toFixed(2)} Cr`;
const safeToFixed = (val, decimals = 2) => (Number.isFinite(val) ? val : 0).toFixed(decimals);

function classifyHospital(beds) {
  const b = Math.max(1, beds);
  if (b <= 49) return { type: "Secondary Care", areaPerBed: 900, operatingRatio: 0.82, arprob: 8000 }; 
  if (b <= 149) return { type: "Multi-Specialty", areaPerBed: 1100, operatingRatio: 0.78, arprob: 12000 }; 
  if (b <= 300) return { type: "Tertiary Care", areaPerBed: 1400, operatingRatio: 0.75, arprob: 18000 }; 
  return { type: "Corporate / Teaching", areaPerBed: 1700, operatingRatio: 0.70, arprob: 25000 }; 
}

const formatTimer = (sec) => { const m = Math.floor(sec / 60); const s = sec % 60; return `${m}:${s.toString().padStart(2, "0")}`; };

// ============================================================================
// 3. MAIN APPLICATION
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState("estimator");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadActionType, setLeadActionType] = useState("");

  const [config, setConfig] = useState({ beds: 100, cityTier: 2, areaSqFt: 85000, occupancyRate: 70, pincode: "" });
  const [sim, setSim] = useState({ occ: 70, arpoB: 15000, equity: 30 }); 
  const [clientDetails, setClientDetails] = useState({ projectName: "Your Dream Hospital", name: "", phone: "", email: "", city: "", state: "" });
  const [vendorDetails, setVendorDetails] = useState({ company: "", category: "Hospital Planning Consultant", contact: "" });
  
  const [pricingState, setPricingState] = useState({ packageId: "advanced", promoCode: "", discountApplied: false });
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [archInputs, setArchInputs] = useState({ landArea: "45000", floors: "4", specialties: "OPD, Trauma, Burn Unit, ICU, 3 OTs, Radiology", parking: "Basement + Surface Parking (Standard)" });
  const [activeBoqCategory, setActiveBoqCategory] = useState("all");

  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [adminProjects, setAdminProjects] = useState([]);
  const [adminVendors, setAdminVendors] = useState([]);

  const [fomo, setFomo] = useState({ activeUsers: 14, reportsLeft: 2, lastPurchase: "2 min ago", timer: 580, urgencyLevel: "high" });

  useEffect(() => {
    const hash = window.location.hash.replace('#/', '').toLowerCase();
    const validTabs = ['estimator', 'intelligence', 'architect', 'boq', 'compliance', 'funding', 'dpr', 'vendors', 'admin', 'contact'];
    if (validTabs.includes(hash)) setActiveTab(hash);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (activeTab === 'admin') {
        try {
          const { data: pData } = await supabase.from('projects').select('*');
          if (pData) setAdminProjects(pData.reverse()); 
          const { data: vData } = await supabase.from('vendors').select('*');
          if (vData) setAdminVendors(vData);
        } catch (error) { console.error(error); }
      }
    }
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFomo(prev => {
        let newUsers = Math.max(5, Math.min(24, prev.activeUsers + Math.floor(Math.random() * 3 - 1)));
        let newReports = prev.reportsLeft; let newLastPurchase = prev.lastPurchase;
        if (Math.random() > 0.9 && prev.reportsLeft > 1) { newReports -= 1; newLastPurchase = `Just now`; }
        let newTimer = prev.timer > 0 ? prev.timer - 1 : 0;
        return { ...prev, activeUsers: newUsers, reportsLeft: newReports, lastPurchase: newLastPurchase, timer: newTimer, urgencyLevel: newReports <= 2 ? "high" : "medium" };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (activeTab === "dpr") setFomo(prev => ({ ...prev, timer: 600, urgencyLevel: "high" })); }, [activeTab]);

  const engine = useMemo(() => {
    const beds = Math.max(1, Number(config.beds));
    const area = Math.max(1000, Number(config.areaSqFt));
    const o = Math.max(1, Number(config.occupancyRate));
    
    const tConf = classifyHospital(beds);
    const cps = config.cityTier === 1 ? 4200 : config.cityTier === 2 ? 3500 : 2800;
    
    const sqFtPerBed = area / beds;
    const minAreaPerBed = tConf.areaPerBed * 0.85;
    const nabhReady = sqFtPerBed >= minAreaPerBed;
    const maturityScore = Math.min(100, (sqFtPerBed / tConf.areaPerBed) * 100);
    const areaShortfall = nabhReady ? 0 : (beds * minAreaPerBed) - area;
    
    const constructionCost = area * cps;
    const icuCount = Math.ceil(beds * 0.2); 
    const otCount = Math.ceil(beds / 30);
    const equipCost = (beds * 1200000) + (icuCount * 10000000) + (otCount * 25000000);
    const tCst = constructionCost + equipCost; 
    
    const arpoB = tConf.arprob + (icuCount * 2000) + (otCount * 3000);
    const rev = beds * (o / 100) * arpoB * 365 * 1.35; 
    const ebitda = rev - (rev * tConf.operatingRatio);
    
    const loanAmt = tCst * (1 - (sim.equity / 100));
    const r = 0.105 / 12; const n = 120;
    const emiMonthly = loanAmt > 0 ? (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1;
    const emi = emiMonthly * 12;
    
    const dscr = emi > 0 ? (ebitda / emi) : 0;
    const netCashflow = (ebitda - emi) / 10000000;
    const loanScore = Math.round(Math.min(95, Math.max(40, dscr * 50)));

    const nursingStaff = Math.ceil(beds * 1.5);
    const doctors = Math.ceil(beds * 0.15); 
    const paramedical = Math.ceil(beds * 0.5); 
    const adminSupport = Math.ceil(beds * 0.85); 
    const totalStaff = nursingStaff + doctors + paramedical + adminSupport;

    return {
        type: tConf.type, sqFtPerBed, minAreaPerBed, nabhReady, maturityScore, areaShortfall,
        isSaturated: config.cityTier === 1 && beds < 50, dailyOPD: Math.ceil(beds * 3), loanScore, operatingRatio: tConf.operatingRatio,
        nursingStaff, doctors, paramedical, adminSupport, totalStaff,
        ipdArea: area * 0.45, icuOtArea: area * 0.20, area, beds,
        totalProjectCost: tCst, totalRevenue: rev, ebitda, ebitdaMargin: rev > 0 ? (ebitda / rev) * 100 : 0,
        dscr, breakEvenYears: ebitda > 0 ? (tCst / ebitda) : 0, loanAmount: loanAmt, equity: tCst - loanAmt, annualEMI: emi, netCashflow
    };
  }, [config, sim.equity]);

  const simEngine = useMemo(() => {
      const rev = (engine.beds * (sim.occ / 100) * sim.arpoB * 365 * 1.35); 
      const ebitda = rev - (rev * engine.operatingRatio); 
      const emiCr = engine.annualEMI / 10000000; 
      const net = (ebitda / 10000000) - emiCr;
      const dscr = emiCr > 0 ? (ebitda / 10000000) / emiCr : 0;
      let score = 20; if(sim.equity >= 30) score += 30; if(dscr >= 1.3) score += 30; if(net > 0) score += 20;
      return { ebitda: (ebitda/10000000).toFixed(2), emi: emiCr.toFixed(2), net: net.toFixed(2), dscr: dscr.toFixed(2), score: Math.round(score) };
  }, [engine, sim]);

  const delayCost = useMemo(() => {
      const monthlyRevLoss = engine.totalRevenue / 12;
      const sixMonthLoss = monthlyRevLoss * 6;
      const inflationCost = engine.totalProjectCost * 0.08; 
      return { revLoss: formatINR(sixMonthLoss), capexRise: formatINR(inflationCost) };
  }, [engine.totalRevenue, engine.totalProjectCost]);

  const boqData = useMemo(() => {
    const area = engine.area; const beds = engine.beds;
    const categories = [
      { id: 'civil', name: '1. Civil & Structural Works', items: [{ desc: 'Site Clearing & Excavation', unit: 'LS', qty: 1, rate: area * 50 }, { desc: 'RCC Columns, Beams & Slabs', unit: 'sq.ft', qty: area, rate: 1200 }, { desc: 'Brickwork & Plastering', unit: 'sq.ft', qty: area * 2.5, rate: 180 }] },
      { id: 'arch', name: '2. Architectural Finishes', items: [{ desc: 'Flooring Tiles', unit: 'sq.ft', qty: area, rate: 160 }, { desc: 'Wall Painting', unit: 'sq.ft', qty: area * 3, rate: 45 }, { desc: 'False Ceiling', unit: 'sq.ft', qty: area * 0.85, rate: 110 }] },
      { id: 'mep', name: '3. MEP (Plumbing, Elec, HVAC)', items: [{ desc: 'HVAC (AHU & HEPA for ICU/Burn Unit)', unit: 'TR', qty: Math.ceil(area / 400), rate: 55000 }, { desc: 'Electrical Cabling & Panels', unit: 'LS', qty: 1, rate: area * 350 }, { desc: 'Plumbing & Sanitary', unit: 'LS', qty: 1, rate: area * 280 }] },
      { id: 'specialized', name: '4. Hospital Special Systems', items: [{ desc: 'Medical Gas Pipeline (MGPS)', unit: 'Beds', qty: beds, rate: 25000 }, { desc: 'Modular OTs (Laminar Flow)', unit: 'Nos', qty: Math.max(1, Math.ceil(beds / 30)), rate: 3500000 }, { desc: 'ETP / STP (Biomedical Waste)', unit: 'LS', qty: 1, rate: area * 80 }, { desc: 'Fire Safety & Sprinklers', unit: 'LS', qty: 1, rate: area * 120 }] },
      { id: 'equip', name: '5. Medical Equipment', items: [{ desc: 'ICU Ventilators & Multipara Monitors', unit: 'Beds', qty: Math.ceil(beds * 0.2), rate: 800000 }, { desc: 'Trauma Crash Carts & Defibrillators', unit: 'Nos', qty: 5, rate: 285000 }, { desc: 'Radiology (CT / MRI / X-Ray)', unit: 'LS', qty: 1, rate: beds >= 100 ? 50000000 : 15000000 }, { desc: 'Burn Unit / Isolation Beds', unit: 'Nos', qty: Math.ceil(beds * 0.1), rate: 150000 }] }
    ];
    let grandTotal = 0;
    const processedCats = categories.map(cat => {
      let catTotal = 0; const items = cat.items.map(item => { const amount = item.qty * item.rate; catTotal += amount; grandTotal += amount; return { ...item, amount }; });
      return { ...cat, catTotal, items };
    });
    return { categories: processedCats, grandTotal };
  }, [engine.area, engine.beds]);
  
  const activePackage = PACKAGES.find(p => p.id === pricingState.packageId) || PACKAGES[0];
  const totalAmountDue = useMemo(() => {
    let dynamicPrice = fomo.timer > 0 ? activePackage.promoPrice : activePackage.basePrice;
    const addons = selectedAddOns.reduce((t, id) => t + (ADD_ONS_LIST.find(a => a.id === id)?.price || 0), 0);
    return dynamicPrice + addons;
  }, [activePackage, selectedAddOns, fomo.timer]);

  const handleLeadSubmit = async () => {
    if (!clientDetails.name || !clientDetails.phone) return alert("Please provide Name and Phone.");
    setIsSyncing(true);
    try { await supabase.from('leads').insert([{ name: clientDetails.name, phone: clientDetails.phone, action_type: leadActionType }]); } catch(e) {}
    setShowLeadModal(false); setIsSyncing(false); alert(`Thank you! Our expert will contact you regarding ${leadActionType}.`);
  };

  const handleRazorpayCheckout = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/export/dpr-pdf`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: clientDetails.projectName || "Apex Healthcare Greenfield", clientName: clientDetails.name || "Promoter Group", config, engine, sim, boqData })
      });
      if (!response.ok) throw new Error(await response.text() || "Failed to generate document");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${(clientDetails.projectName || 'Hospital').replace(/\s+/g, '_')}_Master_DPR.pdf`; document.body.appendChild(a); a.click(); a.remove();
      alert("✅ Master DPR Successfully Generated & Downloaded!");
    } catch (error) { alert("Error generating DPR: " + error.message); }
    setIsSyncing(false);
  };

  const runAIAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/analyze-project`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config, engine, sim }) });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server connection failed.");
      setAiReport(data.result);
    } catch (e) { alert(`AI analysis failed: ${e.message}`); }
    setAiLoading(false);
  };

  const triggerLeadCapture = (actionType) => { setLeadActionType(actionType); setShowLeadModal(true); };

  const navItems = [
    { id: "estimator", label: "Feasibility Engine", icon: Calculator }, 
    { id: "architect", label: "AI Architect", icon: Grid },
    { id: "boq", label: "Smart BOQ", icon: List },
    { id: "intelligence", label: "AI Intelligence", icon: Brain }, 
    { id: "compliance", label: "NABH Compliance", icon: ClipboardCheck }, 
    { id: "funding", label: "Funding & Loans", icon: Landmark },
    { id: "vendors", label: "Supply Chain", icon: ShoppingCart },
    { id: "admin", label: "Dashboard", icon: BarChart3 }, 
    { id: "contact", label: "Contact Us", icon: MapPin },
    { id: "dpr", label: "DPR Checkout", icon: FileText }
  ];

  return (
    <div className="flex h-screen w-full bg-[#010810] text-white font-sans selection:bg-[#D4AF37] selection:text-[#010810] overflow-hidden">
      
      {/* SOCIAL PROOF BANNER */}
      <div className="absolute top-0 left-0 w-full bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest py-1.5 flex justify-center items-center gap-4 z-50 shadow-[0_0_10px_rgba(212,175,55,0.5)]">
         <BellRing size={12} className="animate-bounce" /> 
         <span>🔥 {fomo.activeUsers} promoters evaluating projects right now</span> | 
         <span>Only {fomo.reportsLeft} Expert DPR Slots Remaining Today</span>
      </div>

      {/* LEAD MODAL */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0A2540] border border-[#D4AF37]/50 rounded-[30px] p-8 md:p-10 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowLeadModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={24}/></button>
            <h2 className="text-2xl font-black text-[#D4AF37] mb-2 uppercase">Unlock Feature</h2>
            <p className="text-sm text-white/70 mb-6">Proceed with: <strong className="text-white">{leadActionType}</strong></p>
            <div className="space-y-4">
              <div className="flex items-center border-b border-white/20 pb-2"><User className="w-5 h-5 text-[#D4AF37] mr-3" /><input placeholder="Full Name*" value={clientDetails.name} onChange={e=>setClientDetails({...clientDetails, name: e.target.value})} className="w-full bg-transparent outline-none font-bold" /></div>
              <div className="flex items-center border-b border-white/20 pb-2"><Phone className="w-5 h-5 text-[#D4AF37] mr-3" /><input type="tel" placeholder="WhatsApp Number*" value={clientDetails.phone} onChange={e=>setClientDetails({...clientDetails, phone: e.target.value})} className="w-full bg-transparent outline-none font-bold" /></div>
              <button onClick={handleLeadSubmit} disabled={isSyncing} className="w-full mt-4 py-4 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase tracking-widest flex justify-center gap-2">{isSyncing ? <Activity className="animate-spin" /> : "Proceed"}</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-300 w-72 bg-[#051626] border-r border-white/5 flex flex-col shrink-0 mt-6 md:mt-0 pt-2 md:pt-0 shadow-2xl`}>
        <a href="https://hospitalprojectconsultancy.com/index.html" className="p-6 border-b border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group decoration-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F1CF6D] flex items-center justify-center text-[#0A2540] shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0 group-hover:scale-105 transition-transform"><Building2 /></div>
          <div className="flex flex-col"><span className="text-xl font-black tracking-widest uppercase text-white">INNOVATE <span className="text-[#FBC02D]">INDAI</span></span><span className="text-[7px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-semibold">Hospital Project OS</span></div>
        </a>
        <div className="p-6 border-b border-white/5 bg-[#0A2540]/30 flex justify-between items-center">
          <div><p className="text-xs text-white/40 uppercase tracking-widest font-black mb-1">Authenticated</p><p className="text-sm font-black text-white truncate">{USER_CONFIG.email}</p><p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mt-2">{USER_CONFIG.role}</p></div>
          <Cloud className="w-6 h-6 text-emerald-400" />
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); window.location.hash = `/${item.id}`; setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest uppercase text-[11px] transition-all ${isActive ? 'bg-[#0A2540] text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <item.icon className="w-5 h-5 shrink-0" /><span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0A2540]/40 via-[#010810] to-[#010810] pt-6 md:pt-0">
        
        <header className="h-20 flex items-center justify-between md:justify-end px-6 md:px-10 border-b border-white/5 bg-[#010810]/50 backdrop-blur-md z-30 shrink-0">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white"><Menu className="w-8 h-8" /></button>
          
          <div className="flex gap-4 md:gap-8 items-center text-xs font-bold tracking-widest uppercase">
             <a href="https://hospitalprojectconsultancy.com/index.html" className="hidden md:flex items-center gap-2 text-white/50 hover:text-white transition-colors">
               <Globe size={14} /> Main Website
             </a>
             <button onClick={() => setActiveTab('dpr')} className="px-6 py-2.5 bg-[#D4AF37] text-[#0A2540] rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2">
               <Download size={14}/> Secure DPR
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative custom-scrollbar flex flex-col p-6 md:p-10">
          <div className="max-w-[1600px] w-full mx-auto animate-in fade-in duration-500 relative z-10">
            
            {activeTab !== 'contact' && activeTab !== 'admin' && activeTab !== 'dpr' && activeTab !== 'vendors' && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-8 gap-4">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter flex items-center gap-4">{navItems.find(i => i.id === activeTab)?.label.replace('AI ', '') || activeTab}</h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`px-3 py-1.5 rounded-md text-[9px] font-black tracking-widest uppercase border shadow-sm ${engine.nabhReady ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/50 bg-amber-500/10 text-amber-500'}`}>{engine.nabhReady ? "NABH COMPLIANT AREA" : "OPTIMIZATION NEEDED"}</span>
                    <span className="bg-white/5 border border-white/10 text-white/50 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest">{engine.type}</span>
                  </div>
                </div>
                <div className="bg-[#0A2540]/80 border border-white/10 rounded-2xl p-4 md:p-5 text-right shadow-xl">
                   <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1">Total CAPEX Estimate</p>
                   <p className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-tight">{formatINR(engine.totalProjectCost)}</p>
                </div>
              </div>
            )}

            {/* TAB 1: ESTIMATOR (FEASIBILITY ENGINE) */}
            {activeTab === "estimator" && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
                <div className="relative w-full h-[300px] rounded-[40px] overflow-hidden border border-[#D4AF37]/30 shadow-2xl group">
                    <img src="/images/start-bg.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" alt="Start Journey" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#010810] via-[#010810]/60 to-transparent flex flex-col justify-center p-12">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Precision <span className="text-[#D4AF37]">Modeling</span></h2>
                        <p className="max-w-xl text-white/80 text-lg leading-relaxed">Turn your vision into a bank-ready financial model. Adjust parameters to see real-time impact on ROI.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className={GLOW_CARD}>
                    <div className="mb-6">
                      <label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest">
                        <span>Project Scale</span><span className="text-white">{config.beds} Beds</span>
                      </label>
                      <input type="range" min="30" max="500" step="5" value={config.beds} onChange={e=>setConfig({...config, beds: Number(e.target.value)})} className="w-full accent-[#D4AF37]" />
                    </div>
                    
                    <div className="mb-6">
                      <label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest">
                        <span>Stabilized Occupancy</span><span className="text-white">{config.occupancyRate}%</span>
                      </label>
                      <input type="range" min="40" max="100" step="5" value={config.occupancyRate} onChange={e=>setConfig({...config, occupancyRate: Number(e.target.value)})} className="w-full accent-[#D4AF37]" />
                    </div>
                    
                    <div className="mb-6">
                      <label className={`text-[10px] font-black flex justify-between mb-3 uppercase tracking-widest transition-colors duration-300 ${engine.nabhReady ? 'text-[#D4AF37]' : 'text-red-500'}`}>
                        <span>Total Area</span>
                        <span className={engine.nabhReady ? 'text-white' : 'text-red-400'}>
                          {config.areaSqFt.toLocaleString()} Sqft
                        </span>
                      </label>
                      
                      <input 
                        type="range" min="20000" max="400000" step="5000" 
                        value={config.areaSqFt} 
                        onChange={e=>setConfig({...config, areaSqFt: Number(e.target.value)})} 
                        className={`w-full transition-colors duration-300 ${engine.nabhReady ? 'accent-[#D4AF37]' : 'accent-red-500'}`} 
                      />
                      
                      {!engine.nabhReady && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in fade-in duration-300">
                           <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                             <AlertCircle size={12}/> NABH 6th Ed. Space Deficit
                           </p>
                           <p className="text-[11px] text-red-200/80 leading-relaxed">
                             Current area provides <strong className="text-white">{Math.round(engine.sqFtPerBed)} sq.ft/bed</strong>. The new NABH 6th Edition (Jan 2025) requires ~<strong className="text-white">{Math.round(engine.minAreaPerBed)} sq.ft/bed</strong> for a {engine.type} setup. Increase total area by <strong className="text-white">{Math.round(engine.areaShortfall).toLocaleString()} sq.ft</strong> or reduce your bed count to comply.
                           </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="text-[10px] text-[#D4AF37] font-black block mb-3 uppercase tracking-widest">City Tier Strategy</label>
                      <select value={config.cityTier} onChange={e=>setConfig({...config, cityTier: Number(e.target.value)})} className="w-full bg-[#010810] border border-[#D4AF37]/30 p-4 rounded-xl text-sm font-bold text-white outline-none">
                        <option value={1}>Tier 1 (Metro)</option>
                        <option value={2}>Tier 2 (Smart City)</option>
                      </select>
                    </div>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className={GLOW_CARD}>
                      <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white/10 mb-4 absolute right-8 top-8" />
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Projected Annual EBITDA</p>
                      <p className="text-4xl md:text-5xl font-black text-white">{formatINR(engine.ebitda)}</p>
                      <p className="text-[10px] text-[#4ade80] font-bold mt-4 border border-[#4ade80]/30 bg-[#4ade80]/10 inline-block px-3 py-1 rounded-md uppercase tracking-widest">{safeToFixed(engine.ebitdaMargin, 1)}% Margin</p>
                    </div>
                    
                    <div className={GLOW_CARD}>
                      <PieChart className="w-6 h-6 md:w-8 md:h-8 text-white/10 mb-4 absolute right-8 top-8" />
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Stabilized Bankability</p>
                      <p className={`text-4xl md:text-5xl font-black ${engine.dscr >= 1.3 ? 'text-[#4ade80]' : 'text-amber-500'}`}>{safeToFixed(engine.dscr)}x DSCR</p>
                      <p className="text-xs text-white/50 font-medium mt-4">{safeToFixed(engine.breakEvenYears, 1)} Yrs Break-Even</p>
                    </div>
                    
                    <div className={GLOW_CARD}>
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mb-5" />
                      <div className="flex justify-between items-end mb-5">
                         <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Total Manpower (FTE)</p>
                         <p className="text-2xl font-black text-[#D4AF37]">{engine.totalStaff}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-[#010810] p-3 rounded-lg border border-white/5">
                           <span className="text-xs font-bold text-white/80">Clinical (Nurses, Doctors)</span>
                           <span className="text-sm font-black text-white">{engine.nursingStaff + engine.doctors}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#010810] p-3 rounded-lg border border-white/5">
                           <span className="text-xs font-bold text-white/80">Paramedical (Techs, Pharmacy)</span>
                           <span className="text-sm font-black text-[#4ade80]">{engine.paramedical}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#010810] p-3 rounded-lg border border-white/5">
                           <span className="text-xs font-bold text-white/80">Admin & Support</span>
                           <span className="text-sm font-black text-[#D4AF37]">{engine.adminSupport}</span>
                        </div>
                      </div>
                    </div>

                    <div className={GLOW_CARD}>
                      <Layers className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mb-6" />
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-6">NABH Spatial Zoning</p>
                      <p className="flex justify-between font-bold border-b border-white/5 pb-3 mb-3 text-sm md:text-base">
                        <span>Sterile (IPC / OT / ICU)</span>
                        <span className="text-white text-xl">{engine.icuOtArea.toLocaleString()}</span>
                      </p>
                      <p className="flex justify-between font-bold border-b border-white/5 pb-3 mb-3 text-sm md:text-base">
                        <span>IPD Clinical Wards</span>
                        <span className="text-white text-xl">{engine.ipdArea.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-[#051626] border border-red-500/30 p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-[0_0_30px_rgba(239,68,68,0.1)] mt-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-red-500/30">
                        <Timer size={12} className="animate-pulse" /> Critical Opportunity Cost
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tighter flex items-center gap-3">
                        The Cost of <span className="text-red-500">Inaction</span>
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                        In the healthcare sector, time is equity. Delaying your hospital project by just 6 months not only forfeits massive operational revenue but also subjects your construction budget to an unavoidable 8% annual inflation penalty. <strong className="text-white">Every day you wait without a DPR costs you money.</strong>
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full lg:w-[350px] shrink-0">
                      <div className="bg-[#010810]/80 p-5 rounded-xl border border-red-500/20 flex justify-between items-center shadow-inner">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">Lost Revenue</span>
                           <span className="text-xs font-bold text-white/50">6-Month Delay Penalty</span>
                         </div>
                         <span className="text-xl font-black text-red-400">{delayCost.revLoss}</span>
                      </div>
                      <div className="bg-[#010810]/80 p-5 rounded-xl border border-amber-500/20 flex justify-between items-center shadow-inner">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">CAPEX Inflation</span>
                           <span className="text-xs font-bold text-white/50">8% Material/Labor Rise</span>
                         </div>
                         <span className="text-xl font-black text-amber-400">{delayCost.capexRise}</span>
                      </div>
                      <button onClick={() => setActiveTab('dpr')} className="w-full mt-2 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-red-500/20">
                        Lock Prices & Start DPR <ArrowRight size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI ARCHITECT */}
            {activeTab === "architect" && (
              <div className="space-y-12 animate-in fade-in duration-500">
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
                      <select value={archInputs.parking} onChange={e=>setArchInputs({...archInputs, parking: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]/50 transition-colors">
                        <option>Basement + Surface Parking (Standard)</option>
                        <option>Multi-level Car Parking (MLCP)</option>
                      </select>
                    </div>

                    <button className="w-full py-4 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase tracking-widest flex justify-center items-center gap-3 hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform">
                      <Cpu size={18}/> Run AI Optimization & Download 2D Plan
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="mb-8 border-b border-white/10 pb-6">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Verified <span className="text-[#D4AF37]">AI Outputs</span></h3>
                    <p className="text-white/60 text-sm">AI-generated deliverables aligned with NABH standards, ready for execution and approvals.</p>
                  </div>

                  <div className="flex flex-col gap-6">
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
                      <div className="lg:w-[55%] min-h-[250px] bg-[#010810] rounded-2xl border border-white/10 overflow-hidden relative flex items-center justify-center group/img">
                         <img src="/images/design-bg.jpg" alt="Zoning Diagram" className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity duration-300" />
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent group-hover/img:opacity-0 transition-opacity"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#051626] border border-emerald-500/20 p-6 md:p-8 rounded-[30px] hover:border-emerald-500/60 transition-all duration-300 group shadow-[0_0_15px_rgba(16,185,129,0.05)] flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Grid className="text-emerald-400 w-6 h-6"/></div>
                          <h4 className="text-lg font-black text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Department & <br/>Room Layouts</h4>
                        </div>
                        <p className="text-xs text-white/50 mb-6 leading-relaxed">Detailed layouts with optimized room sizes and adjacency logic.</p>
                        <div className="w-full h-32 bg-[#010810] rounded-xl border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
                           <img src="/images/start-bg.jpg" alt="Room Layouts" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
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

                      <div className="bg-[#051626] border border-[#D4AF37]/20 p-6 md:p-8 rounded-[30px] hover:border-[#D4AF37]/60 transition-all duration-300 group shadow-[0_0_15px_rgba(212,175,55,0.05)] flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="text-[#D4AF37] w-6 h-6"/></div>
                          <h4 className="text-lg font-black text-white uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Space Reports & <br/>DPR Data</h4>
                        </div>
                        <p className="text-xs text-white/50 mb-6 leading-relaxed">Comprehensive data tables for planning, budgeting, and bank approvals.</p>
                        <div className="w-full h-32 bg-[#010810] rounded-xl border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
                           <img src="/images/consultant-bg.jpg" alt="Space Reports" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
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
                       <button onClick={() => setActiveTab('contact')} className="w-full sm:w-auto px-8 py-4 bg-transparent text-[#D4AF37] hover:underline font-black text-xs uppercase tracking-widest transition-colors">Consult Expert</button>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SMART BOQ (FULLY FILTERABLE) */}
            {activeTab === "boq" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="relative w-full h-[250px] rounded-[40px] overflow-hidden border border-emerald-500/20 shadow-2xl">
                    <img src="/images/equipment-bg.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Equipment BOQ" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center px-12">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Equipment <span className="text-emerald-400">BOQ</span></h2>
                        <p className="max-w-lg text-white/60 text-sm mt-2">Comprehensive procurement list calculated specifically for {config.beds} beds.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0A2540]/60 border border-white/5 p-6 rounded-2xl md:rounded-[30px] flex flex-col justify-center shadow-xl">
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Total BOQ Value</p>
                    <p className="text-4xl md:text-5xl font-black text-[#D4AF37]">{formatINR(boqData.grandTotal)}</p>
                  </div>
                  <div className="bg-[#0A2540]/60 border border-white/5 p-6 rounded-2xl md:rounded-[30px] flex flex-col justify-center shadow-xl">
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Cost per Sq.ft</p>
                    <p className="text-4xl md:text-5xl font-black text-white">₹{Math.round(boqData.grandTotal / engine.area).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0A2540]/60 border border-white/5 p-6 rounded-2xl md:rounded-[30px] flex flex-col justify-center shadow-xl">
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-4">Export Detailed BOQ</p>
                    <div className="flex gap-4">
                      <button className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-colors"><Download size={14}/> Excel</button>
                      <button className="flex-1 py-3 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D4AF37]/20 transition-colors"><Download size={14}/> PDF</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  <button 
                    onClick={() => setActiveBoqCategory("all")}
                    className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shrink-0 transition-colors ${activeBoqCategory === "all" ? "bg-[#D4AF37] text-[#051626] shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-[#0A2540] border border-white/5 text-white/50 hover:text-white"}`}
                  >
                    All Categories
                  </button>
                  {boqData.categories.map((c) => (
                    <button 
                      key={c.id} 
                      onClick={() => setActiveBoqCategory(c.id)}
                      className={`px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shrink-0 transition-colors ${activeBoqCategory === c.id ? "bg-[#D4AF37] text-[#051626] shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-[#0A2540] border border-white/5 text-white/50 hover:text-white"}`}
                    >
                      {c.name.split('. ')[1] || c.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {boqData.categories
                    .filter(cat => activeBoqCategory === "all" || cat.id === activeBoqCategory)
                    .map((cat, idx) => (
                    <div key={idx} className="bg-[#0A2540]/40 border border-white/5 rounded-2xl md:rounded-[30px] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-[#051626]/50">
                          <h4 className="font-black text-[#D4AF37] uppercase tracking-widest text-sm">{cat.name}</h4>
                          <span className="text-white font-black text-lg">{formatINR(cat.catTotal)}</span>
                       </div>
                       <div className="p-6 md:p-8">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                               <thead className="text-[10px] uppercase tracking-widest text-white/40">
                                 <tr>
                                   <th className="pb-4 border-b border-white/5">Item Description</th>
                                   <th className="pb-4 border-b border-white/5 text-center">Unit</th>
                                   <th className="pb-4 border-b border-white/5 text-center">Qty</th>
                                   <th className="pb-4 border-b border-white/5 text-right">Rate (₹)</th>
                                   <th className="pb-4 border-b border-white/5 text-right text-[#D4AF37]">Amount (₹)</th>
                                 </tr>
                               </thead>
                               <tbody className="text-white divide-y divide-white/5 font-bold">
                                 {cat.items.map((item, i) => (
                                   <tr key={i} className="hover:bg-white/5 transition-colors">
                                     <td className="py-4 pr-4">{item.desc}</td>
                                     <td className="py-4 text-white/50 text-center">{item.unit}</td>
                                     <td className="py-4 text-center">{item.qty.toLocaleString()}</td>
                                     <td className="py-4 text-right">{item.rate.toLocaleString()}</td>
                                     <td className="py-4 text-right text-[#D4AF37]">{item.amount.toLocaleString()}</td>
                                   </tr>
                                 ))}
                               </tbody>
                            </table>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: AI INTELLIGENCE (MATCHING SCREENSHOT WITH SIMULATOR) */}
            {activeTab === "intelligence" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`p-6 md:p-8 rounded-2xl md:rounded-[30px] border flex items-center gap-6 shadow-xl ${simEngine.net > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${simEngine.net > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                      {simEngine.net > 0 ? <ShieldCheck size={28}/> : <ShieldAlert size={28}/>}
                   </div>
                   <div>
                      <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${simEngine.net > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                        {simEngine.net > 0 ? "PROJECT VIABLE: POSITIVE YEAR 1 CASHFLOW" : "HIGH RISK: NEGATIVE CASHFLOW"}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {simEngine.net > 0 
                          ? `Your Year 1 operations safely cover all debt obligations with a surplus of ₹${simEngine.net} Cr. Your DSCR is healthy. This project is ready for bank syndication.`
                          : `Warning: Your Year 1 EMI (₹${simEngine.emi} Cr) exceeds your projected EBITDA (₹${simEngine.ebitda} Cr). You must increase promoter equity or occupancy to avoid default.`
                        }
                      </p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Col: Simulator */}
                  <div className="bg-[#051626] border border-[#D4AF37]/30 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                      <img src="/images/cost-bg.jpg" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="ROI Analysis" />
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3"><Activity className="text-[#D4AF37]"/> ROI Simulator</h3>
                      <div className="space-y-10 relative z-10">
                          <div><div className="flex justify-between mb-4"><span className="text-[10px] text-white/50 uppercase font-black">Occupancy Ramp</span><span className="text-[#D4AF37] font-black">{sim.occ}%</span></div><input type="range" min="30" max="90" step="5" value={sim.occ} onChange={e=>setSim({...sim, occ: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
                          <div><div className="flex justify-between mb-4"><span className="text-[10px] text-white/50 uppercase font-black">Pricing (ARPOB)</span><span className="text-[#D4AF37] font-black">₹{sim.arpoB.toLocaleString()}</span></div><input type="range" min="8000" max="30000" step="1000" value={sim.arpoB} onChange={e=>setSim({...sim, arpoB: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
                          <div><div className="flex justify-between mb-4"><span className="text-[10px] text-white/50 uppercase font-black">Promoter Equity</span><span className="text-[#D4AF37] font-black">{sim.equity}%</span></div><input type="range" min="20" max="100" step="5" value={sim.equity} onChange={e=>setSim({...sim, equity: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
                      </div>
                  </div>

                  {/* Right Col: Outputs */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0A2540]/40 border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-xl">
                        <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-4">Bank Approval Score</p>
                        <p className={`text-6xl md:text-7xl font-black ${simEngine.score >= 70 ? 'text-emerald-400' : 'text-amber-500'}`}>{simEngine.score}<span className="text-2xl text-white/30">/100</span></p>
                        <div className="w-full bg-white/5 h-2 rounded-full mt-6 overflow-hidden">
                          <div className={`h-full ${simEngine.score >= 70 ? 'bg-emerald-400' : 'bg-amber-500'}`} style={{ width: `${simEngine.score}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-[#0A2540]/40 border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-xl">
                        <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-4">Year 1 DSCR</p>
                        <p className={`text-5xl font-black ${simEngine.dscr >= 1.3 ? 'text-[#D4AF37]' : 'text-red-500'}`}>{simEngine.dscr}x</p>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-6">Required Minimum is 1.30x</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-[#0A2540]/40 border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-xl">
                      <p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest mb-6">Industry Benchmarking</p>
                      <table className="w-full text-left text-sm">
                         <thead className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                           <tr><th className="pb-4">Metric</th><th className="pb-4">Your Simulation</th><th className="pb-4">Industry Avg</th></tr>
                         </thead>
                         <tbody className="text-white font-bold divide-y divide-white/5">
                           <tr><td className="py-5">Year 1 Occupancy</td><td className="py-5 text-[#D4AF37]">{sim.occ}%</td><td className="py-5 text-white/50">40% - 50%</td></tr>
                           <tr><td className="py-5">ARPOB</td><td className="py-5 text-[#D4AF37]">₹{sim.arpoB.toLocaleString()}</td><td className="py-5 text-white/50">₹12,000 - ₹25,000</td></tr>
                           <tr><td className="py-5 border-b-0">Promoter Equity</td><td className="py-5 text-[#D4AF37]">{sim.equity}%</td><td className="py-5 text-white/50">25% - 35%</td></tr>
                         </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: NABH COMPLIANCE (NABH 6TH ED ENHANCED) */}
            {activeTab === "compliance" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* Space Compliance Hero */}
                <div className={`p-8 rounded-[30px] border flex flex-col md:flex-row items-center gap-6 shadow-xl ${engine.nabhReady ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${engine.nabhReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                       {engine.nabhReady ? <ShieldCheck size={32}/> : <ShieldAlert size={32}/>}
                    </div>
                    <div>
                       <h3 className={`text-2xl font-black uppercase tracking-widest mb-2 ${engine.nabhReady ? 'text-emerald-400' : 'text-red-500'}`}>
                         {engine.nabhReady ? "Space Compliant (6th Edition)" : "Critical Space Deficit"}
                       </h3>
                       <p className="text-white/80 leading-relaxed text-sm">
                         Your current layout provides <strong className="text-white">{Math.round(engine.sqFtPerBed)} sq.ft per bed</strong>. 
                         The NABH 6th Edition minimum requirement for a {engine.type} facility is <strong className="text-white">{Math.round(engine.minAreaPerBed)} sq.ft per bed</strong>.
                         {!engine.nabhReady && ` You have a deficit of ${Math.round(engine.areaShortfall).toLocaleString()} sq.ft.`}
                       </p>
                    </div>
                </div>
                
                {/* NABH 6th Ed Infrastructure & Staffing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                   {/* INFRASTRUCTURE STANDARDS */}
                   <div className="bg-[#0A2540]/40 border border-[#D4AF37]/30 p-6 md:p-8 rounded-[30px] shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">6th Ed. Updates</div>
                      <h4 className="text-xl font-black text-[#D4AF37] mb-6 flex items-center gap-3"><Building2 /> Core Infrastructure Specs</h4>
                      <div className="space-y-4">
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Stretcher Lifts</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">Min. Size: 1.5m x 2m (15 Passenger)</p>
                            </div>
                            <span className="bg-red-500/20 text-red-400 text-[9px] font-black px-2 py-1 rounded uppercase border border-red-500/30">Mandatory</span>
                         </div>
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Clinical Corridors</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">Min. Width: 2.4 Meters (8 Feet)</p>
                            </div>
                            <span className="bg-red-500/20 text-red-400 text-[9px] font-black px-2 py-1 rounded uppercase border border-red-500/30">Mandatory</span>
                         </div>
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Fire Ramps & Staircases</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">1:12 Gradient Ramp | 2m Wide Stairs</p>
                            </div>
                            <span className="bg-amber-500/20 text-amber-500 text-[9px] font-black px-2 py-1 rounded uppercase border border-amber-500/30">Based on Height</span>
                         </div>
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">HVAC System (OT/ICU)</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">HEPA Filters (0.3 micron) & Pos. Pressure</p>
                            </div>
                            <span className="bg-red-500/20 text-red-400 text-[9px] font-black px-2 py-1 rounded uppercase border border-red-500/30">Mandatory</span>
                         </div>
                      </div>
                   </div>

                   {/* MANDATORY STAFFING */}
                   <div className="bg-[#0A2540]/40 border border-[#D4AF37]/30 p-6 md:p-8 rounded-[30px] shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">Strict Audit Check</div>
                      <h4 className="text-xl font-black text-[#D4AF37] mb-6 flex items-center gap-3"><Users /> Compulsory Officers</h4>
                      <div className="space-y-4">
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Quality Manager (QMR)</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">Dedicated role for continuous compliance</p>
                            </div>
                            <span className="text-emerald-400"><CheckCircle2 size={20}/></span>
                         </div>
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Infection Control Team</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">Dedicated ICO & 1 ICN per 250 beds</p>
                            </div>
                            <span className="text-emerald-400"><CheckCircle2 size={20}/></span>
                         </div>
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Facility Safety Officer</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">In charge of Fire, Hazmat & Security</p>
                            </div>
                            <span className="text-emerald-400"><CheckCircle2 size={20}/></span>
                         </div>
                         <div className="bg-[#010810] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                            <div>
                               <p className="text-white font-bold text-sm">Nursing Ratio Compliance</p>
                               <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">1:1 for ICU | 1:3 for Wards (per shift)</p>
                            </div>
                            <span className="text-white font-black text-sm text-right">{engine.nursingStaff} <br/><span className="text-[10px] text-white/50">FTE Req.</span></span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-[#051626] border border-[#D4AF37]/40 p-12 rounded-[50px] flex flex-col md:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
                    <img src="/images/nabh-bg.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="NABH Seal" />
                    <div className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center border border-[#D4AF37]/30 shadow-[0_0_80px_rgba(212,175,55,0.1)] shrink-0 relative z-10">
                        <ShieldCheck size={100} className="text-[#D4AF37] opacity-80" />
                    </div>
                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">Accreditation <span className="text-[#D4AF37]">Ready</span></h3>
                        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-8">AI planning logic pre-certified for NABH 6th Edition (Jan 2025). We architect medical ecosystems that pass audits on day one.</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase text-emerald-400 flex items-center gap-2"><CheckCircle2 size={14}/> Fire Safety NOC</div>
                            <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase text-emerald-400 flex items-center gap-2"><CheckCircle2 size={14}/> GPCB Authorization</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0A2540]/20 border border-white/5 p-6 rounded-[20px]">
                    <h4 className="text-sm font-black text-white/70 uppercase tracking-widest mb-4">Mandatory Department Approvals</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">Fire NOC</span></div>
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">Pollution (GPCB)</span></div>
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">Clinical Est. Act</span></div>
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">Bio-Medical Waste</span></div>
                    </div>
                  </div>
                  <div className="bg-[#0A2540]/20 border border-white/5 p-6 rounded-[20px]">
                    <h4 className="text-sm font-black text-white/70 uppercase tracking-widest mb-4">Specialized Modality Licenses</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><AlertCircle className="text-amber-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">AERB (X-Ray/CT)</span></div>
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><AlertCircle className="text-amber-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">PNDT (Ultrasound)</span></div>
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><AlertCircle className="text-amber-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">Pharmacy FDA</span></div>
                      <div className="bg-[#010810] p-3 rounded-lg border border-white/5 flex items-center gap-2"><AlertCircle className="text-amber-500 w-4 h-4 shrink-0"/><span className="text-xs font-bold text-white/80">Blood Bank</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🔥 TAB 6: FUNDING */}
            {activeTab === "funding" && (
              <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700">
                 <div className={`${GLOW_CARD} !p-8 bg-gradient-to-br from-[#0A2540] to-[#051626] border border-[#D4AF37]/50 flex flex-col md:flex-row items-center justify-between gap-6`}>
                    <div><h2 className="text-2xl md:text-3xl font-black text-[#D4AF37] mb-2">Bank Loan Approval Engine</h2><p className="text-sm text-white/70">Your project has a <strong className="text-white">{engine.loanScore}% approval probability</strong>.</p></div>
                    <div className="text-right"><p className={`text-6xl font-black ${engine.loanScore >= 70 ? 'text-emerald-400' : 'text-amber-500'}`}>{engine.loanScore}</p></div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className={`${GLOW_CARD} !p-5 md:!p-6 flex flex-col justify-center`}><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Loan (70%)</p><p className="text-2xl md:text-3xl font-black text-[#D4AF37]">{formatINR(engine.loanAmount)}</p></div>
                    <div className={`${GLOW_CARD} !p-5 md:!p-6 flex flex-col justify-center`}><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Equity (30%)</p><p className="text-2xl md:text-3xl font-black text-white">{formatINR(engine.equity)}</p></div>
                    <div className={`${GLOW_CARD} !p-5 md:!p-6 flex flex-col justify-center border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)] col-span-2 md:col-span-1`}><p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest mb-2">Est. Annual EMI</p><p className="text-2xl md:text-3xl font-black text-white">{formatINR(engine.annualEMI)}</p></div>
                    <div className={`${engine.dscr >= 1.3 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'} border rounded-2xl md:rounded-[30px] p-5 md:p-6 flex flex-col justify-center shadow-lg col-span-2 md:col-span-1`}><p className="text-[10px] uppercase font-black tracking-widest mb-2 text-white/70">DSCR Approval</p><div className="flex items-center gap-3"><span className="text-3xl md:text-4xl font-black text-white">{safeToFixed(engine.dscr)}x</span>{engine.dscr >= 1.3 && <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />}</div></div>
                 </div>
                 <div className="bg-amber-500/10 border border-amber-500/30 p-6 md:p-8 rounded-2xl md:rounded-[30px] flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
                   <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0"><FileWarning className="w-8 h-8 text-amber-500" /></div>
                   <div><h3 className="text-lg md:text-xl font-black text-amber-500 mb-2 uppercase tracking-widest">Why Most Hospital Loans Fail</h3><p className="text-amber-100/80 leading-relaxed text-xs md:text-sm">Most hospital projects fail to secure loans because the DPR is weak. Banks reject proposals when: <strong className="text-amber-400">Revenue projections are unrealistic, market analysis is missing, equipment costs are incorrect, or the financial model is poor.</strong> Do not approach a bank without a professional DPR.</p></div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className={GLOW_CARD}>
                      <h3 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-3 text-[#D4AF37]"><PieChart /> ₹100Cr Project Structure</h3>
                      <p className="text-[10px] text-white/50 mb-8 uppercase tracking-widest font-bold">Standard financing structure for a 250-Bed Hospital.</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-[#010810] p-4 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Promoter Equity</span><span className="font-black text-white">₹25 Cr (25%)</span></div>
                        <div className="flex justify-between items-center bg-[#010810] p-4 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Bank Project Loan</span><span className="font-black text-[#4ade80]">₹45 Cr (45%)</span></div>
                        <div className="flex justify-between items-center bg-[#010810] p-4 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Medical Equipment Loan</span><span className="font-black text-[#D4AF37]">₹20 Cr (20%)</span></div>
                        <div className="flex justify-between items-center bg-[#010810] p-4 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Working Capital</span><span className="font-black text-blue-400">₹10 Cr (10%)</span></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#0A2540] to-[#051626] border border-white/10 rounded-2xl md:rounded-[30px] p-6 md:p-10 shadow-2xl flex flex-col justify-center">
                      <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37] mb-6" /><h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tighter">Syndication Desk</h3><p className="text-white/60 text-sm mb-8 leading-relaxed">Submit your DPR directly to our network of Top-Tier national banks (HDFC, ICICI, SBI) for competitive interest rates.</p>
                      <button onClick={() => triggerLeadCapture("Bank Loan Syndication")} className="w-full py-5 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase text-xs md:text-sm tracking-widest hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform flex items-center justify-center gap-3">Apply For Financing <ArrowRight className="w-5 h-5"/></button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className={GLOW_CARD}><h3 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-3 text-[#D4AF37]"><TrendingUp /> Typical Interest Rates</h3><div className="space-y-4"><div className="flex justify-between items-center bg-[#010810] p-5 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Project Loan</span><span className="font-black text-[#4ade80] text-lg">9% - 11%</span></div><div className="flex justify-between items-center bg-[#010810] p-5 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Equipment Loan</span><span className="font-black text-[#D4AF37] text-lg">8.5% - 10%</span></div><div className="flex justify-between items-center bg-[#010810] p-5 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Working Capital</span><span className="font-black text-blue-400 text-lg">10% - 12%</span></div></div></div>
                    <div className={GLOW_CARD}><h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-3 text-[#D4AF37]"><Clock /> Moratorium Period</h3><p className="text-white/60 leading-relaxed mb-6 text-sm">Hospitals normally receive a construction and stabilization moratorium.</p><div className="bg-[#4ade80]/10 border border-[#4ade80]/30 p-8 rounded-2xl text-center"><p className="text-4xl md:text-5xl font-black text-[#4ade80] mb-3">18-24 Months</p><p className="text-xs text-[#4ade80]/70 font-bold uppercase tracking-widest">No EMI required until fully operational.</p></div></div>
                 </div>
                 <div className={GLOW_CARD}>
                    <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-3 text-[#D4AF37]"><ClipboardList /> Structure of DPR Banks Accept</h3>
                    <p className="text-white/60 mb-8 text-sm">A bankable hospital DPR usually contains these 14 mandatory sections.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {DPR_STRUCTURE.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#010810] p-4 rounded-xl border border-white/5"><CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" /><span className="font-bold text-xs text-white/90">{item}</span></div>
                      ))}
                    </div>
                 </div>
                 <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3"><Wallet className="text-[#D4AF37]"/> 10 Types of Hospital Loans</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {LOAN_TYPES.map((loan, idx) => (
                        <div key={idx} className="bg-[#0A2540]/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors"><h4 className="text-sm font-black text-[#D4AF37] mb-3 uppercase tracking-widest">{loan.title}</h4><p className="text-xs text-white/70 leading-relaxed">{loan.desc}</p></div>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            {/* TAB 7: DPR CHECKOUT */}
            {activeTab === "dpr" && (
              <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
                 
                 {/* Header & Timer */}
                 <div className="text-center space-y-6 mb-16">
                  <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                     <Timer size={14} /> Price locks in {formatTimer(fomo.timer)}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Launch Your Project with <span className="text-[#D4AF37]">Confidence</span></h1>
                  <p className="text-white/60 font-bold uppercase tracking-widest text-sm">Join {fomo.activeUsers} promoters currently securing DPR reports</p>
                 </div>
                 
                 {/* HIGH-CONVERTING PRICING TIERS */}
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-7xl mx-auto mt-8">
                    {PACKAGES.map(pkg => {
                      const isSelected = pricingState.packageId === pkg.id;
                      const isTimerActive = fomo.timer > 0;
                      const currentPrice = isTimerActive ? pkg.promoPrice : pkg.basePrice;
                      const savings = pkg.basePrice - pkg.promoPrice;

                      return (
                        <div key={pkg.id} onClick={() => setPricingState({ packageId: pkg.id, promoCode: "", discountApplied: false })} className={`relative rounded-2xl flex flex-col text-center border-2 transition-all duration-300 cursor-pointer overflow-hidden ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5 scale-105 shadow-[0_0_30px_rgba(212,175,55,0.2)] z-10' : 'border-white/5 bg-[#051626] opacity-90 hover:opacity-100'}`}>
                          
                          {/* "Best Deal" Header Bar */}
                          {pkg.popular && (
                            <div className="bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest py-1.5 w-full">
                              Best Deal
                            </div>
                          )}
                          
                          <div className={`p-6 flex-1 flex flex-col ${!pkg.popular ? 'pt-8' : ''}`}>
                            <h3 className="text-sm font-black text-white/60 uppercase mb-6">{pkg.name}</h3>
                            
                            <div className="flex flex-col items-center justify-center mb-6 min-h-[100px]">
                               {pkg.basePrice > 0 && isTimerActive ? (
                                 <>
                                   <p className="text-xs text-red-500 font-bold mb-1 line-through decoration-red-500/70">normally ₹{pkg.basePrice.toLocaleString('en-IN')}</p>
                                   <p className="text-3xl font-black text-white">₹{currentPrice.toLocaleString('en-IN')}</p>
                                   <div className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 mt-3 rounded-sm uppercase tracking-wider shadow-sm">
                                     ₹{savings.toLocaleString('en-IN')} savings*
                                   </div>
                                 </>
                               ) : (
                                 <p className="text-3xl font-black text-white">₹{currentPrice === 0 ? "0" : currentPrice.toLocaleString('en-IN')}</p>
                               )}
                            </div>
                            
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-6 min-h-[30px]">{pkg.tag}</p>
                            
                            <button className={`w-full py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-colors mb-6 ${isSelected ? 'bg-[#D4AF37] text-black' : 'bg-[#0A2540] text-white hover:bg-white/10'}`}>
                               Get Started
                            </button>
                            
                            <ul className="space-y-4 border-t border-white/10 pt-6 flex-1 text-left">
                                <li className="text-[10px] font-black text-white uppercase mb-2">Everything in {pkg.name}, and:</li>
                                {pkg.features.map((f, i) => <li key={i} className="text-[10px] font-bold text-white/70 uppercase flex items-start gap-2 leading-tight"><Check size={14} className="text-[#D4AF37] shrink-0"/> {f}</li>)}
                            </ul>
                          </div>
                        </div>
                      )
                    })}
                 </div>
                 
                 {/* ADD-ONS SECTION */}
                 <div className="mb-12 max-w-6xl mx-auto mt-12">
                  <h3 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Supercharge Your Package (Add-ons)</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {ADD_ONS_LIST.map((addon) => {
                      const isSelected = selectedAddOns.includes(addon.id);
                      return (
                        <div key={addon.id} onClick={() => setSelectedAddOns(p => p.includes(addon.id) ? p.filter(id=>id!==addon.id) : [...p, addon.id])} className={`px-6 py-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${isSelected ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                           <PlusCircle className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-white/40'}`} /><span className="text-[10px] font-black uppercase tracking-widest">{addon.name}</span><span className="text-xs font-black text-[#D4AF37]">₹{addon.price.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                 
                 {/* CHECKOUT FORM */}
                 <div className="bg-white rounded-[40px] p-8 md:p-12 text-[#0A2540] shadow-2xl max-w-3xl mx-auto relative overflow-hidden">
                    {fomo.urgencyLevel === "high" && (<div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center text-[10px] font-black uppercase tracking-widest py-2">⚠️ Only {fomo.reportsLeft} Priority Slots Remaining for Today</div>)}
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 text-center mt-4">Client Details</h2>
                    <div className="space-y-4 md:space-y-5">
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2"><User className="w-5 h-5 text-gray-400 mr-3"/><input placeholder="Full Name" value={clientDetails.name} onChange={e=>setClientDetails({...clientDetails, name: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/></div>
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2 mt-5"><Phone className="w-5 h-5 text-gray-400 mr-3"/><input placeholder="WhatsApp Number" value={clientDetails.phone} onChange={e=>setClientDetails({...clientDetails, phone: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/></div>
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2 mt-5"><Mail className="w-5 h-5 text-gray-400 mr-3"/><input placeholder="Email Address" value={clientDetails.email} onChange={e=>setClientDetails({...clientDetails, email: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/></div>
                      <div className="grid grid-cols-2 gap-6 pt-5"><div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2"><MapPin className="w-5 h-5 text-gray-400 mr-3"/><input placeholder="City" value={clientDetails.city} onChange={e=>setClientDetails({...clientDetails, city: e.target.value})} className="w-full outline-none text-sm md:text-lg font-bold bg-transparent text-[#0A2540]"/></div><div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2"><Globe className="w-5 h-5 text-gray-400 mr-3"/><input placeholder="State" value={clientDetails.state} onChange={e=>setClientDetails({...clientDetails, state: e.target.value})} className="w-full outline-none text-sm md:text-lg font-bold bg-transparent text-[#0A2540]"/></div></div>
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2 mt-5"><Building2 className="w-5 h-5 text-gray-400 mr-3"/><input placeholder="Project Name" value={clientDetails.projectName} onChange={e=>setClientDetails({...clientDetails, projectName: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/></div>
                      
                      <div className="pt-8 mt-8 border-t-2 border-dashed border-gray-200 flex justify-between items-end">
                         <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Due</span>
                         <div className="text-right">
                           {totalAmountDue < activePackage.basePrice && (
                             <p className="text-[10px] md:text-xs text-red-500 line-through mb-1">
                               ₹{(activePackage.basePrice + selectedAddOns.reduce((t, id) => t + (ADD_ONS_LIST.find(a => a.id === id)?.price || 0), 0)).toLocaleString('en-IN')}
                             </p>
                           )}
                           <span className="text-4xl md:text-5xl font-black text-[#0A2540]">{totalAmountDue === 0 ? "FREE" : `₹${totalAmountDue.toLocaleString('en-IN')}`}</span>
                         </div>
                      </div>
                      
                      <button onClick={handleRazorpayCheckout} disabled={isSyncing} className="w-full py-5 mt-4 bg-[#0A2540] text-[#D4AF37] rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-4 shadow-xl">
                        {isSyncing ? <><Activity className="animate-spin"/> Processing...</> : <><Zap/> Secure Priority Checkout</>}
                      </button>
                      <p className="text-center text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 mt-4"><CreditCard size={12}/> Secured by Razorpay. Last purchase {fomo.lastPurchase}.</p>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB 8: VENDORS */}
            {activeTab === "vendors" && (
              <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div><h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Supply <span className="text-[#D4AF37]">Chain</span></h2><p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">Verified B2B Hospital Consortium</p></div>
                  <button onClick={() => triggerLeadCapture("Vendor Network Access")} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Join Network</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {VENDOR_DIRECTORY.map(v => (
                    <div key={v.id} className={GLOW_CARD}>
                      <div className="flex justify-between items-start mb-6"><div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"><Building2 className="text-[#D4AF37] w-5 h-5" /></div><div className="flex items-center gap-1 text-[#D4AF37] font-black text-sm"><Star className="w-4 h-4 fill-[#D4AF37]" /> {v.rating}</div></div>
                      <h3 className="text-lg font-black mb-1 uppercase">{v.name}</h3><p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">{v.category}</p>
                      <button onClick={() => triggerLeadCapture(`Quote from ${v.name}`)} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-lg font-black text-[10px] uppercase hover:bg-[#D4AF37] hover:text-[#051626] transition-colors">Request VIP Quote</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: PROJECT DASHBOARD */}
            {activeTab === "admin" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div><h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase"><span className="text-[#D4AF37]">Client</span> Dashboard</h2><p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">Manage your hospital projects</p></div>
                    <button onClick={() => setActiveTab('estimator')} className="px-8 py-4 bg-[#D4AF37] text-[#051626] rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"><PlusCircle size={16}/> Start New DPR</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                  <div className={GLOW_CARD}><p className="text-[10px] md:text-xs uppercase text-[#D4AF37] font-black tracking-widest mb-2 md:mb-3">DPR Reports Generated</p><p className="text-6xl font-black text-white">{adminProjects.length}</p></div>
                  <div className={GLOW_CARD}><p className="text-[10px] md:text-xs uppercase text-[#D4AF37] font-black tracking-widest mb-2 md:mb-3">Enrolled Network Vendors</p><p className="text-6xl font-black text-white">{adminVendors.length}</p></div>
                  <div className={GLOW_CARD}><p className="text-[10px] md:text-xs uppercase text-[#D4AF37] font-black tracking-widest mb-2 md:mb-3">Total Estimated CAPEX</p><p className="text-4xl font-black text-[#4ade80]">{formatINR(adminProjects.reduce((sum, p) => sum + (p.total_capex || 0), 0))}</p></div>
                </div>
                <div className={`${GLOW_CARD} !p-0 overflow-hidden mt-8`}>
                   <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-[#010810]/50"><h3 className="text-lg font-black uppercase tracking-widest text-[#D4AF37]">Saved Projects</h3></div>
                   {adminProjects.length === 0 ? (<div className="p-10 text-center text-white/40 font-bold uppercase text-xs tracking-widest">No projects saved yet. Run the Feasibility Engine to begin.</div>) : (
                     <div className="overflow-x-auto">
                       <table className="w-full text-left whitespace-nowrap"><thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/50"><tr><th className="p-6">Project Name</th><th className="p-6">Client Info</th><th className="p-6">Scale</th><th className="p-6">Est. CAPEX</th><th className="p-6">Date</th></tr></thead>
                         <tbody className="text-sm divide-y divide-white/5">
                           {adminProjects.map(p => (
                             <tr key={p.id} className="hover:bg-white/5 transition-colors">
                               <td className="p-6 font-black">{p.project_name}</td>
                               <td className="p-6 text-white/70"><div className="font-bold">{p.client_name}</div><div className="text-[10px] uppercase tracking-widest mt-1 text-[#D4AF37]">{p.client_phone}</div></td>
                               <td className="p-6 font-black text-white">{p.beds_count} Beds<br/><span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">{p.hospital_type}</span></td>
                               <td className="p-6 font-black text-[#4ade80]">{formatINR(p.total_capex)}</td>
                               <td className="p-6 text-white/50 font-bold">{new Date(p.created_at).toLocaleDateString()}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* TAB 10: CONTACT US */}
            {activeTab === "contact" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                <div className={GLOW_CARD}>
                  <h2 className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-6">Get in Touch</h2>
                  <p className="text-white/70 mb-8 leading-relaxed">Whether you are planning a new 50-bed nursing home or a 500-bed corporate hospital, our Master Architects and Financial Syndicators are ready to assist you.</p>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-[#051626] rounded-full flex items-center justify-center text-[#D4AF37] shrink-0"><MapPin /></div><div><p className="text-sm font-bold text-white">Headquarters</p><p className="text-xs text-white/50">135, Soham Arcade, Nr. Bagban Circle, Gauravpath Road, Pal, Surat. 394510</p></div></div>
                    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-[#051626] rounded-full flex items-center justify-center text-[#D4AF37] shrink-0"><Phone /></div><div><p className="text-sm font-bold text-white">Direct Line</p><p className="text-xs text-white/50">+91 98795 76332</p></div></div>
                    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-[#051626] rounded-full flex items-center justify-center text-[#D4AF37] shrink-0"><Mail /></div><div><p className="text-sm font-bold text-white">Email Desk</p><p className="text-xs text-white/50">director@hospitalprojectconsultancy.com</p></div></div>
                  </div>
                </div>
                <div className="bg-[#051626] border border-white/10 rounded-2xl md:rounded-[30px] flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[400px] shadow-2xl">
                   <div className="bg-[#0A2540]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center relative z-10 mx-6">
                     <p className="font-black text-[#D4AF37] uppercase tracking-widest mb-2 text-lg">Surat, Gujarat</p>
                     <p className="text-xs text-white/60">Serving Healthcare Projects Nationwide</p>
                   </div>
                </div>
              </div>
            )}

          </div>

          <footer className="mt-20 py-16 border-t border-white/5 bg-[#030b14]/50 rounded-t-[50px] px-10 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1200px] mx-auto">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6"><Building2 className="text-[#D4AF37]"/><span className="text-2xl font-black uppercase">INNOVATE <span className="text-[#FBC02D]">INDAI</span></span></div>
                <p className="text-sm text-white/30 leading-relaxed max-w-sm">India's premier AI-powered Hospital Project Consultancy. We deliver end-to-end solutions from NABH compliant architecture to ₹100+ Crore project finance syndication.</p>
              </div>
              <div><h4 className="text-white font-black text-xs uppercase mb-6">Systems</h4><ul className="space-y-3 text-xs text-white/30"><li>DPR Generator</li><li>Loan Syndication</li></ul></div>
              <div><h4 className="text-white font-black text-xs uppercase mb-6">Accreditations</h4><ul className="space-y-3 text-xs text-white/30"><li>NABH 6th Edition</li><li>AERB Radiology</li></ul></div>
            </div>
            <div className="mt-16 text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">© 2026 Innovate IndAI Hospital Project Consultancy. All rights reserved.</div>
          </footer>
        </main>
      </div>
    </div>
  );
}