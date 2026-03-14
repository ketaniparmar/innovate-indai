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

// ============================================================================
// 1. CORE CONFIGURATION & DATABASE (YOUR EXACT KEYS)
// ============================================================================
const supabaseUrl = "https://udljxsjkqdrpqmxamwkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbGp4c2prcWRycHFteGFtd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Mzg1NDAsImV4cCI6MjA4ODAxNDU0MH0.gXuw6cNBRr8HCAOOsB3Z3xYuUDeIvDlXXIcvhuTKe_c";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USER_CONFIG = { 
  name: "Ketankumar Parmar", 
  email: "director@hospitalprojectconsultancy.com", 
  reportEmail: "reports@hospitalprojectconsultancy.com" 
};
const RESEND_API_KEY = "re_cjZ21RBy_8chZH1vKAPCgJEJrNk5kpvKR";

// ============================================================================
// 2. KNOWLEDGE BASE & DATA ARRAYS
// ============================================================================
const GUJARAT_CITIES = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", 
  "Gandhinagar", "Gandhidham", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", 
  "Bharuch", "Vapi", "Valsad", "Bhuj", "Porbandar", "Palanpur", "Dahej", "Ankleshwar"
];

const PACKAGES = [
  { id: "free", name: "Basic Feasibility Brief", price: 0, desc: "High-level CAPEX & EBITDA snapshot." },
  { id: "standard", name: "Standard DPR", price: 2999, desc: "Includes NABH Spatial Benchmarks." },
  { id: "advanced", name: "Advanced NABH Report", price: 4999, desc: "Full Staffing & Department Zoning." },
  { id: "financial", name: "5-Year Financial P&L", price: 14999, desc: "Bank-ready ROI & Cashflow models." },
  { id: "complete", name: "Complete DPR + Vendors", price: 49999, desc: "Includes direct Lepu/Diacare pipelines." }
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

const APPROVAL_PROCESS = [
  { step: "Step 1", title: "DPR Preparation", desc: "Developer prepares bankable DPR covering feasibility, financial projections, planning, and capex." },
  { step: "Step 2", title: "Bank Proposal Submission", desc: "Submit DPR, promoter profile, net worth statement, land docs, and equipment BOQs." },
  { step: "Step 3", title: "Bank Technical Appraisal", desc: "Bank appoints technical/financial consultants to evaluate feasibility, costs, and risks." },
  { step: "Step 4", title: "Credit Committee Approval", desc: "Internal review of DSCR (Typical requirement: ≥ 1.3), loan security, and promoter credibility." },
  { step: "Step 5", title: "Sanction Letter Issued", desc: "Loan sanction includes amount, interest rate, moratorium period, and security requirements." },
  { step: "Step 6", title: "Disbursement Phase", desc: "Loan released in stages: Land development, construction, equipment, and pre-op expenses." }
];

const DPR_STRUCTURE = [
  "1. Executive Summary", "2. Promoter Profile", "3. Market & Catchment Analysis", 
  "4. Hospital Concept & Specialties", "5. Infrastructure & Architecture Plan", "6. Medical Equipment BOQ", 
  "7. Manpower & HR Strategy", "8. Regulatory & Compliance", "9. Project Cost Estimation (CAPEX)", 
  "10. Revenue Model & PMJAY Integration", "11. 10-Year Financial Projections", "12. ROI & Break-Even Analysis", 
  "13. SWOT & Risk Analysis", "14. Subsidies & Government Incentives"
];

// ============================================================================
// 3. UTILITY FUNCTIONS
// ============================================================================
const GLOW_CARD = "bg-[#0A2540]/60 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[30px] p-6 md:p-8 shadow-xl hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500";

const formatINR = (val) => {
  if (!Number.isFinite(val) || val === 0) return "₹0.00 Cr";
  return `₹${(val / 10000000).toFixed(2)} Cr`;
};

const formatPrice = (val) => {
  if (!Number.isFinite(val) || val === 0) return "FREE";
  return `₹${val.toLocaleString('en-IN')}`;
};

const safeToFixed = (val, decimals = 2) => {
  return (Number.isFinite(val) ? val : 0).toFixed(decimals);
};

function classifyHospital(beds) {
  const b = Math.max(1, beds);
  if (b <= 49) return { type: "Secondary Care", areaPerBed: 900, equipmentPercent: 0.35, operatingRatio: 0.65, arprob: 10000 };
  if (b <= 149) return { type: "Multi-Specialty", areaPerBed: 1100, equipmentPercent: 0.40, operatingRatio: 0.60, arprob: 15000 };
  if (b <= 300) return { type: "Tertiary Care", areaPerBed: 1400, equipmentPercent: 0.45, operatingRatio: 0.58, arprob: 22000 };
  return { type: "Corporate / Teaching", areaPerBed: 1700, equipmentPercent: 0.50, operatingRatio: 0.55, arprob: 28000 };
}

// ============================================================================
// 4. MAIN APPLICATION
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState("estimator");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isApplyingLoan, setIsApplyingLoan] = useState(false);
  
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadActionType, setLeadActionType] = useState("");

  const [adminProjects, setAdminProjects] = useState([]);
  const [adminVendors, setAdminVendors] = useState([]);

  const [config, setConfig] = useState({ beds: 100, cityTier: 2, areaSqFt: 85000, occupancyRate: 70 });
  const [clientDetails, setClientDetails] = useState({ projectName: "Dahej Public Hospital", name: "", phone: "", email: "", city: "", state: "" });
  const [vendorDetails, setVendorDetails] = useState({ company: "", category: "Hospital Planning Consultant", contact: "" });
  const [pricingState, setPricingState] = useState({ packageId: "free", promoCode: "", discountApplied: false });
  const [archInputs, setArchInputs] = useState({ landArea: "45000", floors: "4", specialties: "OPD, Trauma, Burn Unit, ICU, 3 OTs, Radiology", parking: "Basement + Surface" });
  const [activeBoqCategory, setActiveBoqCategory] = useState("all");

  // --- DYNAMIC LOADING MESSAGES ---
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
  }, [isSyncing, loadingMessages.length]);

  useEffect(() => {
    const hash = window.location.hash.replace('#/', '').toLowerCase();
    const validTabs = ['estimator', 'architect', 'boq', 'compliance', 'funding', 'dpr', 'vendors', 'admin', 'contact'];
    if (validTabs.includes(hash)) setActiveTab(hash);
  }, []);

  useEffect(() => {
    const titleMap = {
      estimator: "Hospital Project Estimator | Innovate India",
      architect: "AI Hospital Layout Generator | Innovate India",
      boq: "Smart BOQ Calculator | Innovate India",
      compliance: "NABH Compliance Checker | Innovate India",
      funding: "Hospital Loan Syndication | Innovate India",
      dpr: "Generate Hospital DPR | Innovate India",
      vendors: "B2B Consortium | Innovate India",
      admin: "Admin Dashboard | Innovate India",
      contact: "Contact Hospital Consultants | Innovate India"
    };
    document.title = titleMap[activeTab] || "Innovate India Hospital Consultancy";

    async function fetchData() {
      if (activeTab === 'admin') {
        try {
          const { data: pData } = await supabase.from('projects').select('*');
          if (pData) setAdminProjects(pData);
          const { data: vData } = await supabase.from('vendors').select('*');
          if (vData) setAdminVendors(vData);
        } catch (error) { console.error(error); }
      }
    }
    fetchData();
  }, [activeTab]);

  const engine = useMemo(() => {
    try {
      const b = Math.max(1, Number(config.beds) || 100);
      const a = Math.max(1, Number(config.areaSqFt) || 85000);
      const o = Math.max(1, Number(config.occupancyRate) || 70);
      const tConf = classifyHospital(b);
      const cps = config.cityTier === 1 ? 4200 : config.cityTier === 2 ? 3500 : 2800;
      
      const sqFtPerBed = a / b;
      const nabhReady = sqFtPerBed >= (tConf.areaPerBed * 0.85);
      const maturityScore = Math.min(100, (sqFtPerBed / tConf.areaPerBed) * 100);
      
      const constructionCost = a * cps;
      const equipmentCost = constructionCost * tConf.equipmentPercent;
      const hardCost = constructionCost + equipmentCost;
      const tCst = hardCost * 1.15; 
      
      const rev = b * (o / 100) * tConf.arprob * 365 * 1.35;
      const ebitda = rev - (rev * tConf.operatingRatio);
      
      const lAmt = tCst * 0.70;
      const emi = lAmt > 0 ? (lAmt * 0.10 * Math.pow(1.10, 10)) / (Math.pow(1.10, 10) - 1) : 1; 
      
      return {
        type: tConf.type, sqFtPerBed, nabhReady, maturityScore, 
        nursingStaff: Math.ceil(b * 1.5), residentDoctors: Math.ceil(b / 10), 
        ipdArea: a * 0.45, icuOtArea: a * 0.20,
        totalProjectCost: tCst, totalRevenue: rev, ebitda, 
        ebitdaMargin: rev > 0 ? (ebitda / rev) * 100 : 0,
        dscr: emi > 0 ? (ebitda / emi) : 0, 
        breakEvenYears: ebitda > 0 ? (tCst / ebitda) : 0,
        loanAmount: lAmt, equity: tCst - lAmt, annualEMI: emi,
      };
    } catch (e) {
      return { type: "Error", sqFtPerBed: 0, nabhReady: false, maturityScore: 0, nursingStaff: 0, residentDoctors: 0, ipdArea: 0, icuOtArea: 0, totalProjectCost: 0, totalRevenue: 0, ebitda: 0, ebitdaMargin: 0, dscr: 0, breakEvenYears: 0, loanAmount: 0, equity: 0, annualEMI: 0 };
    }
  }, [config]);

  const boqData = useMemo(() => {
    const area = Math.max(1, Number(config.areaSqFt) || 85000);
    const beds = Math.max(1, Number(config.beds) || 100);
    
    const categories = [
      { id: 'civil', name: '1. Civil & Structural Works', items: [{ desc: 'Site Clearing & Excavation', unit: 'LS', qty: 1, rate: area * 50 }, { desc: 'RCC Columns, Beams & Slabs', unit: 'sq.ft', qty: area, rate: 1200 }, { desc: 'Brickwork & Plastering', unit: 'sq.ft', qty: area * 2.5, rate: 180 }] },
      { id: 'arch', name: '2. Architectural Finishes', items: [{ desc: 'Flooring Tiles', unit: 'sq.ft', qty: area, rate: 160 }, { desc: 'Wall Painting', unit: 'sq.ft', qty: area * 3, rate: 45 }, { desc: 'False Ceiling', unit: 'sq.ft', qty: area * 0.85, rate: 110 }] },
      { id: 'mep', name: '3. MEP (Plumbing, Elec, HVAC)', items: [{ desc: 'HVAC (AHU & HEPA for ICU/Burn Unit)', unit: 'TR', qty: Math.ceil(area / 400), rate: 55000 }, { desc: 'Electrical Cabling & Panels', unit: 'LS', qty: 1, rate: area * 350 }, { desc: 'Plumbing & Sanitary', unit: 'LS', qty: 1, rate: area * 280 }] },
      { id: 'specialized', name: '4. Hospital Special Systems', items: [{ desc: 'Medical Gas Pipeline (MGPS)', unit: 'Beds', qty: beds, rate: 25000 }, { desc: 'Modular OTs (Laminar Flow)', unit: 'Nos', qty: Math.max(1, Math.ceil(beds / 30)), rate: 3500000 }, { desc: 'ETP / STP (Biomedical Waste)', unit: 'LS', qty: 1, rate: area * 80 }, { desc: 'Fire Safety & Sprinklers', unit: 'LS', qty: 1, rate: area * 120 }] },
      { id: 'equip', name: '5. Medical Equipment', items: [{ desc: 'ICU Ventilators & Multipara Monitors', unit: 'Beds', qty: Math.ceil(beds * 0.2), rate: 800000 }, { desc: 'Trauma Crash Carts & Defibrillators', unit: 'Nos', qty: 5, rate: 285000 }, { desc: 'Radiology (CT / MRI / X-Ray)', unit: 'LS', qty: 1, rate: beds >= 100 ? 50000000 : 15000000 }, { desc: 'Burn Unit / Isolation Beds', unit: 'Nos', qty: Math.ceil(beds * 0.1), rate: 150000 }] }
    ];

    let grandTotal = 0;
    const processedCats = categories.map(cat => {
      let catTotal = 0;
      const items = cat.items.map(item => { const amount = item.qty * item.rate; catTotal += amount; grandTotal += amount; return { ...item, amount }; });
      return { ...cat, catTotal, items };
    });

    return { categories: processedCats, grandTotal };
  }, [config.areaSqFt, config.beds]);

  const activePackage = PACKAGES.find(p => p.id === pricingState.packageId) || PACKAGES[0];
  const finalPrice = pricingState.discountApplied ? activePackage.price * 0.5 : activePackage.price;

  const triggerLeadCapture = (actionType) => {
    setLeadActionType(actionType);
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async () => {
    if (!clientDetails.name || !clientDetails.phone) {
      return alert("Please enter your Name and WhatsApp number to proceed.");
    }
    setIsSyncing(true);
    
    try { 
      await supabase.from('projects').insert([{ 
        project_name: clientDetails.projectName || "Lead Inquiry", 
        director_email: clientDetails.email || "No Email Provided", 
        client_name: clientDetails.name, 
        client_phone: clientDetails.phone, 
        beds_count: config.beds, 
        total_capex: engine.totalProjectCost, 
        hospital_type: engine.type 
      }]); 
    } catch(e) { console.error(e); }

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ 
          from: `Innovate India Lead <${USER_CONFIG.reportEmail}>`, 
          to: [USER_CONFIG.email], 
          subject: `NEW LEAD: ${leadActionType} | ${clientDetails.name}`, 
          html: `<h3>New Lead Generated</h3><p>Action: ${leadActionType}</p><p>Name: ${clientDetails.name}</p><p>Phone: ${clientDetails.phone}</p><p>Scale: ${config.beds} Beds</p>` 
        })
      });
    } catch (e) { console.error(e); }

    setIsSyncing(false);
    setShowLeadModal(false);
    alert(`Success! Your request for "${leadActionType}" has been received. Our team will contact you shortly on ${clientDetails.phone}.`);
  };

  // ==========================================================================
  // 🔗 DIRECT DOWNLOAD CHECKOUT (Connects to Live Render Server)
  // ==========================================================================
  const handleDPRCheckout = async () => {
    if (!clientDetails.email || !clientDetails.name) return alert("Client details missing. Please enter your Name and Email.");
    setIsSyncing(true);
    
    try {
      const apiUrl = "https://innovate-india-suite.onrender.com/api/admin/generate-pdf"; 
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: clientDetails.email,
          projectName: clientDetails.projectName || "New Hospital Project",
          bedCount: config.beds,
          specialtyFocus: engine.type,
          cityTier: config.cityTier,
          totalArea: config.areaSqFt,
          numFloors: archInputs.floors || "4"
        })
      });

      const result = await response.json();

      if (result.success && result.pdfBase64) {
        // DIRECT BROWSER DOWNLOAD EXECUTION
        const linkSource = `data:application/pdf;base64,${result.pdfBase64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = `${(clientDetails.projectName || "Innovate_India").replace(/[^a-z0-9]/gi, '_')}_DPR_Report.pdf`;
        downloadLink.click();
        
        alert("Success! Your detailed DPR Report has been downloaded to your device.");
      } else {
        alert("Failed to generate PDF. Check server logs.");
        console.error(result.error);
      }

    } catch (e) {
      console.error("Network error:", e);
      alert("Could not connect to the backend engine. Please check if the Render service is running.");
    }
    
    setIsSyncing(false);
  };

  const handlePromoApply = () => {
    if (pricingState.promoCode.toUpperCase() === "WELCOME50") {
      setPricingState({ ...pricingState, discountApplied: true });
      alert("Success: 50% Early Adopter Discount Applied!");
    } else {
      setPricingState({ ...pricingState, discountApplied: false });
      alert("Invalid Promo Code.");
    }
  };

  const handleVendorApply = async () => {
    if (!vendorDetails.company || !vendorDetails.contact) return alert("Required fields missing.");
    setIsSyncing(true);
    try { await supabase.from('vendors').insert([{ company_name: vendorDetails.company, category: vendorDetails.category, contact: vendorDetails.contact }]); } catch(e) {}
    
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: `Innovate India <${USER_CONFIG.reportEmail}>`, to: [USER_CONFIG.email], subject: `New Vendor | ${vendorDetails.company}`, html: `<div style="background:#0A2540;color:white;padding:30px;border:2px solid #D4AF37;border-radius:15px;font-family:sans-serif;"><p>Firm: ${vendorDetails.company}</p><p>Cat: ${vendorDetails.category}</p><p>Ph: ${vendorDetails.contact}</p></div>` })
      });
      alert("Application Submitted!");
    } catch (e) { alert("Network Error."); }
    
    setVendorDetails({ company: "", category: "Hospital Planning Consultant", contact: "" });
    setIsSyncing(false);
  };

  const navItems = [
    { id: "estimator", label: "Estimator", icon: Calculator }, 
    { id: "architect", label: "AI Architect", icon: Grid },
    { id: "boq", label: "Smart BOQ", icon: List },
    { id: "compliance", label: "Compliance", icon: ClipboardCheck }, 
    { id: "funding", label: "Funding & Loans", icon: Landmark },
    { id: "dpr", label: "DPR Checkout", icon: FileText }, 
    { id: "vendors", label: "B2B Consortium", icon: ShoppingCart },
    { id: "admin", label: "Dashboard", icon: BarChart3 }, 
    { id: "contact", label: "Contact Us", icon: MapPin }
  ];

  return (
    <div className="flex h-screen w-full bg-[#010810] text-white font-sans selection:bg-[#D4AF37] selection:text-[#010810] overflow-hidden">
      
      {/* LEAD CAPTURE MODAL OVERLAY */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0A2540] border border-[#D4AF37]/50 rounded-[30px] p-8 md:p-10 w-full max-w-md shadow-[0_0_40px_rgba(212,175,55,0.2)] relative">
            <button onClick={() => setShowLeadModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X className="w-6 h-6"/></button>
            <h2 className="text-2xl font-black text-[#D4AF37] mb-2 uppercase">Unlock Feature</h2>
            <p className="text-sm text-white/70 mb-6">Enter your details to proceed with: <strong className="text-white">{leadActionType}</strong></p>
            
            <div className="space-y-4">
              <div className="flex items-center border-b border-white/20 pb-2">
                <User className="w-5 h-5 text-[#D4AF37] mr-3" />
                <input placeholder="Your Full Name*" value={clientDetails.name} onChange={e=>setClientDetails({...clientDetails, name: e.target.value})} className="w-full bg-transparent outline-none text-white font-bold placeholder-white/30" />
              </div>
              <div className="flex items-center border-b border-white/20 pb-2">
                <Phone className="w-5 h-5 text-[#D4AF37] mr-3" />
                <input type="tel" placeholder="WhatsApp Number*" value={clientDetails.phone} onChange={e=>setClientDetails({...clientDetails, phone: e.target.value})} className="w-full bg-transparent outline-none text-white font-bold placeholder-white/30" />
              </div>
              <div className="flex items-center border-b border-white/20 pb-2">
                <Mail className="w-5 h-5 text-[#D4AF37] mr-3" />
                <input type="email" placeholder="Email Address (Optional)" value={clientDetails.email} onChange={e=>setClientDetails({...clientDetails, email: e.target.value})} className="w-full bg-transparent outline-none text-white font-bold placeholder-white/30" />
              </div>
              <button onClick={handleLeadSubmit} disabled={isSyncing} className="w-full mt-4 py-4 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                {isSyncing ? <Activity className="w-5 h-5 animate-spin" /> : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAAS SIDEBAR (Fixed Left, Full Height) */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-300 ease-in-out w-72 bg-[#051626] border-r border-white/5 flex flex-col flex-shrink-0 shadow-2xl`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F1CF6D] flex items-center justify-center text-[#0A2540] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">Innovate <span className="text-[#D4AF37]">India</span></h1>
            <p className="text-[8px] text-white/50 uppercase tracking-widest mt-1">Hospital Project Consultancy</p>
          </div>
        </div>

        <div className="p-6 border-b border-white/5 bg-[#0A2540]/30">
          <p className="text-xs text-white/40 uppercase tracking-widest font-black mb-1">Authenticated</p>
          <p className="text-sm font-black text-white truncate">{USER_CONFIG.email}</p>
          <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mt-2">Verified Consultant</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {navItems.map((item) => {
            const NavIcon = item.icon; 
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); window.location.hash = `/${item.id}`; setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest uppercase text-[11px] transition-all ${isActive ? 'bg-[#0A2540] text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <NavIcon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA (Flex-1, Scrollable) */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0A2540]/40 via-[#010810] to-[#010810]">
        
        {/* Ambient Dashboard Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none hidden md:block"></div>

        {/* TOP HEADER (Sits on top of the main area) */}
        <header className="h-20 flex items-center justify-between md:justify-end px-6 md:px-10 border-b border-white/5 bg-[#010810]/50 backdrop-blur-md z-30 shrink-0">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white hover:text-[#D4AF37]">
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
          <div className="flex gap-6 md:gap-8 items-center text-xs font-bold tracking-widest uppercase">
             <a href="https://www.hospitalprojectconsultancy.com" className="hidden sm:block text-white/70 hover:text-[#D4AF37] transition-colors">Main Site</a>
             <button onClick={() => { setActiveTab('vendors'); window.location.hash = `/vendors`; }} className="text-white/70 hover:text-[#D4AF37] transition-colors">Vendors</button>
             <button onClick={() => { setActiveTab('contact'); window.location.hash = `/contact`; }} className="px-6 py-2.5 bg-[#D4AF37] text-[#0A2540] rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">Contact Us</button>
          </div>
        </header>

        {/* DYNAMIC MODULE INJECTION (Scrollable Area) */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar flex flex-col">
          <div className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto animate-in fade-in duration-500 relative z-10">
            
            {/* Dynamic Module Header */}
            {activeTab !== 'contact' && activeTab !== 'admin' && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-8 gap-4">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter">
                    {navItems.find(i => i.id === activeTab)?.label || activeTab}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['estimator', 'architect', 'boq', 'compliance', 'funding', 'dpr'].includes(activeTab) && (
                      <span className={`px-3 py-1.5 rounded-md text-[9px] md:text-[10px] font-black tracking-widest uppercase border shadow-sm ${engine.nabhReady ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/50 bg-amber-500/10 text-amber-500'}`}>
                        {engine.nabhReady ? "NABH COMPLIANT AREA" : "OPTIMIZATION NEEDED"}
                      </span>
                    )}
                    {activeTab !== 'vendors' && (
                      <span className="bg-white/5 border border-white/10 text-white/50 px-3 py-1.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                        {engine.type}
                      </span>
                    )}
                  </div>
                </div>
                {['estimator', 'architect', 'boq', 'funding', 'dpr'].includes(activeTab) && (
                  <div className="bg-[#0A2540]/80 border border-white/10 rounded-2xl p-4 md:p-5 w-full md:w-auto text-left md:text-right shadow-xl">
                     <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1">Total Project Outlay</p>
                     <p className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-tight">{formatINR(engine.totalProjectCost)}</p>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 1: ESTIMATOR */}
            {activeTab === "estimator" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className={GLOW_CARD}>
                  <div className="mb-6"><label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest"><span>Scale</span><span className="text-white">{config.beds} Beds</span></label><input type="range" min="30" max="500" step="5" value={config.beds} onChange={e=>setConfig({...config, beds: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
                  <div className="mb-6"><label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest"><span>Occupancy</span><span className="text-white">{config.occupancyRate}%</span></label><input type="range" min="40" max="100" step="5" value={config.occupancyRate} onChange={e=>setConfig({...config, occupancyRate: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
                  <div className="mb-6"><label className="text-[10px] text-[#D4AF37] font-black flex justify-between mb-3 uppercase tracking-widest"><span>Total Area</span><span className="text-white">{config.areaSqFt.toLocaleString()} Sqft</span></label><input type="range" min="20000" max="400000" step="5000" value={config.areaSqFt} onChange={e=>setConfig({...config, areaSqFt: Number(e.target.value)})} className="w-full accent-[#D4AF37]" /></div>
                  <div className="mb-6"><label className="text-[10px] text-[#D4AF37] font-black block mb-3 uppercase tracking-widest">City Tier Strategy</label>
                    <select value={config.cityTier} onChange={e=>setConfig({...config, cityTier: Number(e.target.value)})} className="w-full bg-[#010810] border border-[#D4AF37]/30 p-4 rounded-xl text-sm font-bold text-white outline-none focus:border-[#D4AF37] transition-colors"><option value={1}>Tier 1 (Metro)</option><option value={2}>Tier 2 (Smart City)</option><option value={3}>Tier 3 (Regional)</option></select>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/5"><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-3">Investor Readiness Gauge</p><div className="w-full bg-[#010810] h-3 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F1CF6D]" style={{width: `${engine.maturityScore}%`}}></div></div></div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className={GLOW_CARD}><TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white/20 mb-4 absolute right-8 top-8" /><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Projected Annual EBITDA</p><p className="text-4xl md:text-5xl font-black">{formatINR(engine.ebitda)}</p><p className="text-[10px] md:text-xs text-[#4ade80] font-bold mt-4 border border-[#4ade80]/30 bg-[#4ade80]/10 inline-block px-3 py-1 rounded-md uppercase tracking-widest">{safeToFixed(engine.ebitdaMargin, 1)}% Margin</p></div>
                  <div className={GLOW_CARD}><PieChart className="w-6 h-6 md:w-8 md:h-8 text-white/20 mb-4 absolute right-8 top-8" /><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Bankability Metrics</p><p className={`text-4xl md:text-5xl font-black ${engine.dscr >= 1.3 ? 'text-[#4ade80]' : 'text-amber-500'}`}>{safeToFixed(engine.dscr)}x DSCR</p><p className="text-xs text-white/50 font-medium mt-4">{safeToFixed(engine.breakEvenYears, 1)} Yrs Break-Even</p></div>
                  <div className={GLOW_CARD}><Users className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mb-6" /><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-6">NABH Clinical Staffing</p><p className="flex justify-between font-bold border-b border-white/5 pb-3 mb-3 text-sm md:text-base"><span>Nursing Corps</span><span className="text-[#D4AF37] text-xl">{engine.nursingStaff}</span></p><p className="flex justify-between font-bold text-sm md:text-base"><span>Resident Doctors</span><span className="text-[#D4AF37] text-xl">{engine.residentDoctors}</span></p></div>
                  <div className={GLOW_CARD}><Layers className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mb-6" /><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-6">NABH Spatial Zoning (Sqft)</p><p className="flex justify-between font-bold border-b border-white/5 pb-3 mb-3 text-sm md:text-base"><span>Sterile / OT / ICU</span><span className="text-xl">{Math.round(engine.icuOtArea).toLocaleString()}</span></p><p className="flex justify-between font-bold text-sm md:text-base"><span>IPD Clinical Wards</span><span className="text-xl">{Math.round(engine.ipdArea).toLocaleString()}</span></p></div>
                </div>
              </div>
            )}

            {/* MODULE 2: AI ARCHITECT */}
            {activeTab === "architect" && (
              <div className="space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-[#0A2540] to-[#051626] p-6 md:p-10 rounded-2xl md:rounded-[30px] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div>
                     <h2 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-3 text-white"><Cpu className="text-[#D4AF37] w-6 h-6 md:w-8 md:h-8"/> AI Planning Engine</h2>
                     <p className="text-white/60 text-sm max-w-2xl leading-relaxed">A concept-to-DPR accelerator. Reduce months of planning to hours by embedding NABH rules directly into the AI design logic.</p>
                   </div>
                </div>

                <div className={GLOW_CARD}>
                  <h3 className="text-lg md:text-xl font-black text-[#D4AF37] mb-6 flex items-center gap-2"><Activity className="w-5 h-5"/> Step 1: Define Project Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase font-black mb-2 block tracking-widest">Land Area (Sq.Ft)</label>
                      <input type="number" value={archInputs.landArea || ""} onChange={e=>setArchInputs({...archInputs, landArea: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] text-sm" placeholder="e.g. 50000" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase font-black mb-2 block tracking-widest">Bed Capacity</label>
                      <input type="number" value={config.beds || ""} onChange={e=>setConfig({...config, beds: Number(e.target.value)})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase font-black mb-2 block tracking-widest">Number of Floors</label>
                      <input type="number" value={archInputs.floors || ""} onChange={e=>setArchInputs({...archInputs, floors: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase font-black mb-2 block tracking-widest">City & Local By-laws</label>
                      <select className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] text-sm">
                        <option>Surat (GDCR Rules)</option>
                        <option>Ahmedabad (AUDA Rules)</option>
                        <option>Standard National Guidelines</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-white/50 uppercase font-black mb-2 block tracking-widest">Required Specialties & Departments</label>
                      <input type="text" value={archInputs.specialties || ""} onChange={e=>setArchInputs({...archInputs, specialties: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-white/50 uppercase font-black mb-2 block tracking-widest">Parking Requirements</label>
                      <select value={archInputs.parking || ""} onChange={e=>setArchInputs({...archInputs, parking: e.target.value})} className="w-full bg-[#010810] border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] text-sm">
                        <option>Basement + Surface Parking (Standard)</option>
                        <option>Double Basement</option>
                        <option>Surface Parking Only</option>
                        <option>Mechanized / Stack Parking</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => triggerLeadCapture("2D Architectural Layout")} className="w-full mt-8 py-5 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform flex justify-center items-center gap-3">
                    <Cpu className="w-5 h-5" /> Run AI Optimization & Download 2D Plan
                  </button>
                </div>

                <div className={GLOW_CARD}>
                  <h3 className="text-lg md:text-xl font-black text-[#D4AF37] mb-6 flex items-center gap-2"><Settings className="w-5 h-5"/> Generative Workflow</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    {[{s: "1. Inputs", d: "Land, Beds, Depts"}, {s: "2. Rules", d: "Zoning & Adjacency"}, {s: "3. Flow", d: "Patient & Paths"}, {s: "4. Optimize", d: "AI Algorithms"}, {s: "5. Output", d: "CAD & Reports"}].map((step, i) => (
                      <React.Fragment key={i}>
                        <div className="bg-[#010810] p-4 md:p-6 rounded-xl border border-white/5 w-full md:w-auto flex-1 shadow-inner">
                          <p className="font-black text-[#D4AF37] text-xs md:text-sm mb-2 uppercase tracking-widest">{step.s}</p>
                          <p className="text-[10px] md:text-xs text-white/50">{step.d}</p>
                        </div>
                        {i < 4 && <ArrowRight className="hidden md:block w-6 h-6 text-white/20 shrink-0" />}
                        {i < 4 && <ArrowDown className="md:hidden w-6 h-6 text-white/20 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div className={GLOW_CARD}>
                      <h3 className="text-lg md:text-xl font-black text-[#D4AF37] mb-6">Engine Logic Rules</h3>
                      <div className="space-y-4">
                        {[
                          {r: "OPD near entrance", p: "Easy access for outpatients, reduces congestion."},
                          {r: "ER accessible from road", p: "Quick ambulance entry, bypasses public areas."},
                          {r: "ICU adjacent to OT", p: "Immediate transfer of critical post-op patients."},
                          {r: "Wards in quiet zones", p: "Ensures rest, minimizes noise & infection risk."},
                          {r: "Service corridors separate", p: "Prevents overlap of patient, staff & waste flows."}
                        ].map((rule, idx) => (
                          <div key={idx} className="bg-[#010810] p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                            <p className="font-bold text-[#4ade80] text-xs md:text-sm mb-1">{rule.r}</p>
                            <p className="text-[10px] md:text-xs text-white/60">{rule.p}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                     <div className={GLOW_CARD}>
                        <h3 className="text-lg md:text-xl font-black text-[#D4AF37] mb-6">Verified AI Outputs</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-4 text-xs md:text-sm font-bold text-white/80 bg-[#010810] p-4 rounded-xl border border-white/5"><Layers className="text-[#D4AF37] w-5 h-5"/> Zoning Diagrams (Public, Clinical)</li>
                          <li className="flex items-center gap-4 text-xs md:text-sm font-bold text-white/80 bg-[#010810] p-4 rounded-xl border border-white/5"><Grid className="text-[#D4AF37] w-5 h-5"/> Department & Room Layouts</li>
                          <li className="flex items-center gap-4 text-xs md:text-sm font-bold text-white/80 bg-[#010810] p-4 rounded-xl border border-white/5"><FileText className="text-[#D4AF37] w-5 h-5"/> Space Reports & DPR Data</li>
                          <li className="flex items-center gap-4 text-xs md:text-sm font-bold text-white/80 bg-[#010810] p-4 rounded-xl border border-white/5"><Download className="text-[#D4AF37] w-5 h-5"/> CAD Files (PDF / DxF / Revit)</li>
                        </ul>
                     </div>
                     <div className="bg-amber-500/10 border border-amber-500/30 p-6 md:p-8 rounded-2xl md:rounded-[30px] flex items-start gap-4 shadow-xl">
                       <CheckCircle2 className="w-8 h-8 text-amber-500 shrink-0" />
                       <div>
                         <p className="font-black text-amber-500 uppercase tracking-widest text-sm mb-2">100% NABH Compliant</p>
                         <p className="text-xs text-amber-100/70 leading-relaxed">The AI encodes statutory regulations into every decision, ensuring the generated floor plans pass medical board inspections.</p>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* MODULE 3: SMART BOQ */}
            {activeTab === "boq" && (
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                   <div className={`${GLOW_CARD} !p-6 bg-gradient-to-br from-[#0A2540] to-[#051626]`}>
                     <p className="text-[10px] text-white/50 uppercase font-black mb-2 tracking-widest">Total BOQ Value</p>
                     <p className="text-3xl lg:text-4xl font-black text-[#D4AF37]">{(formatINR(boqData.grandTotal))}</p>
                   </div>
                   <div className={`${GLOW_CARD} !p-6`}>
                     <p className="text-[10px] text-white/50 uppercase font-black mb-2 tracking-widest">Cost Per Sq.Ft</p>
                     <p className="text-3xl lg:text-4xl font-black text-white">₹{safeToFixed(boqData.grandTotal / Math.max(1, config.areaSqFt), 0)}</p>
                   </div>
                   <div className={`${GLOW_CARD} !p-6 flex flex-col justify-center items-start`}>
                     <p className="text-[10px] text-white/50 uppercase font-black mb-4 tracking-widest">Export Detailed BOQ</p>
                     <div className="flex gap-3 w-full">
                       <button onClick={() => triggerLeadCapture("Excel BOQ Export")} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-colors"><Download className="w-4 h-4"/> Excel</button>
                       <button onClick={() => triggerLeadCapture("PDF BOQ Export")} className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#051626] transition-colors"><Download className="w-4 h-4"/> PDF</button>
                     </div>
                   </div>
                </div>

                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                  <button onClick={() => setActiveBoqCategory("all")} className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeBoqCategory === "all" ? 'bg-[#D4AF37] text-[#051626]' : 'bg-[#0A2540] text-white/50 hover:text-white border border-white/5'}`}>All Categories</button>
                  {boqData.categories.map(cat => (
                    <button key={cat.id} onClick={() => setActiveBoqCategory(cat.id)} className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${activeBoqCategory === cat.id ? 'bg-[#D4AF37] text-[#051626]' : 'bg-[#0A2540] text-white/50 hover:text-white border border-white/5'}`}>{cat.name.split('. ')[1]}</button>
                  ))}
                </div>

                <div className="space-y-6">
                  {boqData.categories.filter(c => activeBoqCategory === "all" || activeBoqCategory === c.id).map(category => (
                    <div key={category.id} className="bg-[#0A2540]/50 backdrop-blur-md rounded-2xl md:rounded-[30px] border border-white/10 overflow-hidden shadow-xl">
                      <div className="bg-[#051626] p-5 md:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="font-black text-[#D4AF37] text-sm md:text-base uppercase tracking-widest">{category.name}</h3>
                        <span className="font-black text-white text-lg">₹{category.catTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-white/5 text-white/40 uppercase text-[10px] tracking-widest">
                              <th className="p-4 md:p-5 font-bold">Item Description</th>
                              <th className="p-4 md:p-5 font-bold">Unit</th>
                              <th className="p-4 md:p-5 font-bold text-right">Qty</th>
                              <th className="p-4 md:p-5 font-bold text-right">Rate (₹)</th>
                              <th className="p-4 md:p-5 font-bold text-right text-[#D4AF37]">Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs md:text-sm text-white/80 divide-y divide-white/5">
                            {category.items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 md:p-5 font-medium">{item.desc}</td>
                                <td className="p-4 md:p-5 text-white/50">{item.unit}</td>
                                <td className="p-4 md:p-5 text-right">{item.qty.toLocaleString()}</td>
                                <td className="p-4 md:p-5 text-right">{item.rate.toLocaleString('en-IN')}</td>
                                <td className="p-4 md:p-5 text-right font-black text-white">{(item.amount).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 4: COMPLIANCE */}
            {activeTab === "compliance" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className={GLOW_CARD}>
                  <h3 className="text-xl md:text-2xl font-black mb-8 text-[#D4AF37] flex items-center gap-3"><ClipboardCheck/> Mandatory Approvals</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><CheckCircle2 className="w-6 h-6 text-[#4ade80] shrink-0"/><span className="font-bold text-xs md:text-sm">Clinical Establishment Registration</span></div>
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><CheckCircle2 className="w-6 h-6 text-[#4ade80] shrink-0"/><span className="font-bold text-xs md:text-sm">Fire Department NOC</span></div>
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><CheckCircle2 className="w-6 h-6 text-[#4ade80] shrink-0"/><span className="font-bold text-xs md:text-sm">Gujarat Pollution Control Board (GPCB)</span></div>
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><CheckCircle2 className="w-6 h-6 text-[#4ade80] shrink-0"/><span className="font-bold text-xs md:text-sm">Bio-Medical Waste Authorization</span></div>
                  </div>
                </div>
                <div className={GLOW_CARD}>
                  <h3 className="text-xl md:text-2xl font-black mb-8 text-[#D4AF37] flex items-center gap-3"><ShieldCheck/> Department Licenses</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><AlertCircle className="w-6 h-6 text-[#D4AF37] shrink-0"/><span className="font-bold text-xs md:text-sm">AERB Approval (Atomic Energy - X-Ray/CT)</span></div>
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><AlertCircle className="w-6 h-6 text-[#D4AF37] shrink-0"/><span className="font-bold text-xs md:text-sm">PNDT Act Registration (Ultrasound)</span></div>
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><AlertCircle className="w-6 h-6 text-[#D4AF37] shrink-0"/><span className="font-bold text-xs md:text-sm">Pharmacy License (State FDA)</span></div>
                    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#010810] border border-white/5 rounded-xl"><AlertCircle className="w-6 h-6 text-[#D4AF37] shrink-0"/><span className="font-bold text-xs md:text-sm">Local Authority (PCPIR / GIDC / AUDA)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: FUNDING */}
            {activeTab === "funding" && (
              <div className="space-y-8 md:space-y-10">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className={`${GLOW_CARD} !p-5 md:!p-6 flex flex-col justify-center`}><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Loan (70%)</p><p className="text-2xl md:text-3xl font-black text-[#D4AF37]">{formatINR(engine.loanAmount)}</p></div>
                    <div className={`${GLOW_CARD} !p-5 md:!p-6 flex flex-col justify-center`}><p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Equity (30%)</p><p className="text-2xl md:text-3xl font-black text-white">{formatINR(engine.equity)}</p></div>
                    <div className={`${GLOW_CARD} !p-5 md:!p-6 flex flex-col justify-center border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)] col-span-2 md:col-span-1`}><p className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest mb-2">Est. Annual EMI</p><p className="text-2xl md:text-3xl font-black text-white">{formatINR(engine.annualEMI)}</p></div>
                    <div className={`${engine.dscr >= 1.3 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'} border rounded-2xl md:rounded-[30px] p-5 md:p-6 flex flex-col justify-center shadow-lg col-span-2 md:col-span-1`}><p className="text-[10px] uppercase font-black tracking-widest mb-2 text-white/70">DSCR Approval</p><div className="flex items-center gap-3"><span className="text-3xl md:text-4xl font-black text-white">{safeToFixed(engine.dscr)}x</span>{engine.dscr >= 1.3 && <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />}</div></div>
                 </div>

                 <div className="bg-amber-500/10 border border-amber-500/30 p-6 md:p-8 rounded-2xl md:rounded-[30px] flex flex-col md:flex-row items-start md:items-center gap-6 shadow-xl">
                   <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0"><FileWarning className="w-8 h-8 text-amber-500" /></div>
                   <div>
                     <h3 className="text-lg md:text-xl font-black text-amber-500 mb-2 uppercase tracking-widest">Why Most Hospital Loans Fail</h3>
                     <p className="text-amber-100/80 leading-relaxed text-xs md:text-sm">Most hospital projects fail to secure loans because the DPR is weak. Banks reject proposals when: <strong className="text-amber-400">Revenue projections are unrealistic, market analysis is missing, equipment costs are incorrect, or the financial model is poor.</strong> Do not approach a bank without a professional DPR.</p>
                   </div>
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
                      <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37] mb-6" />
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tighter">Syndication Desk</h3>
                      <p className="text-white/60 text-sm mb-8 leading-relaxed">Submit your DPR directly to our network of Top-Tier national banks (HDFC, ICICI, SBI) for competitive interest rates.</p>
                      <button onClick={() => triggerLeadCapture("Bank Loan Syndication")} disabled={isApplyingLoan} className="w-full py-5 bg-[#D4AF37] text-[#051626] rounded-xl font-black uppercase text-xs md:text-sm tracking-widest hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform flex items-center justify-center gap-3">
                        {isApplyingLoan ? "Routing..." : "Apply For Financing"} <ArrowRight className="w-5 h-5"/>
                      </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className={GLOW_CARD}>
                      <h3 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-3 text-[#D4AF37]"><TrendingUp /> Typical Interest Rates</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-[#010810] p-5 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Project Loan</span><span className="font-black text-[#4ade80] text-lg">9% - 11%</span></div>
                        <div className="flex justify-between items-center bg-[#010810] p-5 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Equipment Loan</span><span className="font-black text-[#D4AF37] text-lg">8.5% - 10%</span></div>
                        <div className="flex justify-between items-center bg-[#010810] p-5 rounded-xl border border-white/5"><span className="font-bold text-white/80 text-sm">Working Capital</span><span className="font-black text-blue-400 text-lg">10% - 12%</span></div>
                      </div>
                    </div>
                    <div className={GLOW_CARD}>
                      <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-3 text-[#D4AF37]"><Clock /> Moratorium Period</h3>
                      <p className="text-white/60 leading-relaxed mb-6 text-sm">Hospitals normally receive a construction and stabilization moratorium.</p>
                      <div className="bg-[#4ade80]/10 border border-[#4ade80]/30 p-8 rounded-2xl text-center">
                        <p className="text-4xl md:text-5xl font-black text-[#4ade80] mb-3">18-24 Months</p>
                        <p className="text-xs text-[#4ade80]/70 font-bold uppercase tracking-widest">No EMI required until fully operational.</p>
                      </div>
                    </div>
                 </div>

                 <div className={GLOW_CARD}>
                    <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-3 text-[#D4AF37]"><ClipboardList /> Structure of DPR Banks Accept</h3>
                    <p className="text-white/60 mb-8 text-sm">A bankable hospital DPR usually contains these 14 mandatory sections.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {DPR_STRUCTURE.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#010810] p-4 rounded-xl border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                          <span className="font-bold text-xs text-white/90">{item}</span>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3"><Wallet className="text-[#D4AF37]"/> 10 Types of Hospital Loans</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {LOAN_TYPES.map((loan, idx) => (
                        <div key={idx} className="bg-[#0A2540]/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                          <h4 className="text-sm font-black text-[#D4AF37] mb-3 uppercase tracking-widest">{loan.title}</h4>
                          <p className="text-xs text-white/70 leading-relaxed">{loan.desc}</p>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            {/* MODULE 6: VENDORS */}
            {activeTab === "vendors" && (
              <div className="space-y-8 md:space-y-10 animate-in slide-in-from-bottom duration-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  <div className={GLOW_CARD}><h3 className="text-lg md:text-xl font-black mb-2 md:mb-3 text-[#D4AF37]">Lepu Medical</h3><p className="text-white/60 text-xs md:text-sm mb-4 md:mb-6 flex-grow">Cardiology & ICU Pipelines. Eliminate retail margins via exclusive distributorship.</p><button className="w-full py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-black text-[10px] md:text-xs uppercase hover:bg-[#D4AF37] hover:text-[#051626] transition-colors">Request Quote</button></div>
                  <div className={GLOW_CARD}><h3 className="text-lg md:text-xl font-black mb-2 md:mb-3 text-[#D4AF37]">Diacare Solutions</h3><p className="text-white/60 text-xs md:text-sm mb-4 md:mb-6 flex-grow">Turnkey Dialysis Setups with integrated RO filtration systems.</p><button className="w-full py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-black text-[10px] md:text-xs uppercase hover:bg-[#D4AF37] hover:text-[#051626] transition-colors">Request Quote</button></div>
                  <div className={GLOW_CARD}><h3 className="text-lg md:text-xl font-black mb-2 md:mb-3 text-[#D4AF37]">Project Consortium</h3><p className="text-white/60 text-xs md:text-sm mb-4 md:mb-6 flex-grow">Open Architecture Bidding for Architects, Planners & MEP consultants.</p><button className="w-full py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-black text-[10px] md:text-xs uppercase hover:bg-[#D4AF37] hover:text-[#051626] transition-colors">Initiate Bid</button></div>
                </div>

                <div className={`${GLOW_CARD} flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 !p-6 md:!p-10`}>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-black mb-2">Join Network</h2>
                    <p className="text-[#D4AF37] text-xs md:text-sm">Commission-based lead distribution for OEMs and Consultants.</p>
                  </div>
                  <div className="flex-1 space-y-3 md:space-y-4 w-full">
                    <input placeholder="Company / Firm Name" value={vendorDetails.company || ""} onChange={e => setVendorDetails({...vendorDetails, company: e.target.value})} className="w-full bg-[#051626] border border-white/10 p-3 rounded-lg text-white font-bold outline-none focus:border-[#D4AF37] text-sm md:text-base"/>
                    <select value={vendorDetails.category || ""} onChange={e => setVendorDetails({...vendorDetails, category: e.target.value})} className="w-full bg-[#051626] border border-white/10 p-3 rounded-lg text-white/70 font-bold outline-none focus:border-[#D4AF37] text-sm md:text-base">
                      <option>Hospital Planning Consultant</option>
                      <option>Healthcare Architect</option>
                      <option>MEP Consultant</option>
                      <option>Medical Equipment Vendor</option>
                      <option>Financial Institution</option>
                    </select>
                    <input placeholder="Contact Number" value={vendorDetails.contact || ""} onChange={e => setVendorDetails({...vendorDetails, contact: e.target.value})} className="w-full bg-[#051626] border border-white/10 p-3 rounded-lg text-white font-bold outline-none focus:border-[#D4AF37] text-sm md:text-base"/>
                    <button onClick={handleVendorApply} disabled={isSyncing} className="w-full py-3 bg-[#D4AF37] text-[#051626] rounded-lg font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform">{isSyncing ? "Submitting..." : "Apply Now"}</button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 7: DPR CHECKOUT */}
            {activeTab === "dpr" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 animate-in slide-in-from-bottom duration-700">
                <div className={GLOW_CARD}>
                  <h2 className="text-xl md:text-2xl font-black uppercase mb-4 md:mb-6 text-white"><CreditCard className="inline w-5 h-5 md:w-6 md:h-6 text-[#D4AF37] mr-2"/> Packages</h2>
                  <div className="space-y-3 md:space-y-4">
                    {PACKAGES.map(pkg => (
                      <button key={pkg.id} onClick={() => setPricingState({ packageId: pkg.id, promoCode: "", discountApplied: false })} className={`w-full text-left p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${pricingState.packageId === pkg.id ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,.2)]' : 'border-white/5 bg-[#051626] hover:border-white/20'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm md:text-lg">{pkg.name}</span>
                          <span className={`font-black text-base md:text-xl ${pricingState.packageId === pkg.id ? 'text-[#D4AF37]' : 'text-emerald-400'}`}>{formatPrice(pkg.price)}</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-white/50">{pkg.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white text-[#0A2540] rounded-2xl md:rounded-[30px] p-6 md:p-10 shadow-2xl flex flex-col justify-between">
                  <div className="space-y-4 md:space-y-5">
                    <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 md:mb-6">Client Details</h2>
                    
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3"/>
                      <input placeholder="Full Name" value={clientDetails.name || ""} onChange={e=>setClientDetails({...clientDetails, name: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/>
                    </div>
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2 mt-4 md:mt-5">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3"/>
                      <input placeholder="WhatsApp Number" value={clientDetails.phone || ""} onChange={e=>setClientDetails({...clientDetails, phone: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/>
                    </div>
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2 mt-4 md:mt-5">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3"/>
                      <input placeholder="Email Address" value={clientDetails.email || ""} onChange={e=>setClientDetails({...clientDetails, email: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-5">
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3"/>
                        <input placeholder="City" value={clientDetails.city || ""} onChange={e=>setClientDetails({...clientDetails, city: e.target.value})} className="w-full outline-none text-sm md:text-lg font-bold bg-transparent text-[#0A2540]"/>
                      </div>
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2">
                        <Globe className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3"/>
                        <input placeholder="State" value={clientDetails.state || ""} onChange={e=>setClientDetails({...clientDetails, state: e.target.value})} className="w-full outline-none text-sm md:text-lg font-bold bg-transparent text-[#0A2540]"/>
                      </div>
                    </div>
                    
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#D4AF37] pb-2 mt-4 md:mt-5">
                      <Building2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3"/>
                      <input placeholder="Project Name" value={clientDetails.projectName || ""} onChange={e=>setClientDetails({...clientDetails, projectName: e.target.value})} className="w-full outline-none text-base md:text-lg font-bold bg-transparent text-[#0A2540]"/>
                    </div>

                    <div className="flex gap-2 md:gap-4 mt-6 md:mt-8">
                      <input placeholder="Promo Code" value={pricingState.promoCode || ""} onChange={e=>setPricingState({...pricingState, promoCode: e.target.value})} className="flex-1 border-2 p-2 md:p-3 rounded-lg md:rounded-xl font-bold uppercase outline-none focus:border-[#D4AF37] text-sm md:text-base"/>
                      <button onClick={handlePromoApply} className="bg-[#0A2540] text-white px-4 md:px-6 rounded-lg md:rounded-xl font-bold text-xs md:text-sm tracking-widest hover:bg-[#D4AF37] transition-colors">APPLY</button>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
                    <div className="flex justify-between items-end mb-4 md:mb-6">
                      <span className="text-gray-400 font-bold uppercase text-xs md:text-sm">Total Due</span>
                      <div className="text-right">
                        {pricingState.discountApplied && <p className="text-[10px] md:text-xs text-red-500 line-through mb-1">₹{activePackage.price.toLocaleString('en-IN')}</p>}
                        <span className="text-3xl md:text-5xl font-black">{formatPrice(finalPrice)}</span>
                      </div>
                    </div>
                    <button onClick={handleDPRCheckout} disabled={isSyncing} className="w-full bg-[#0A2540] text-[#D4AF37] py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest flex justify-center items-center gap-3 text-sm md:text-base hover:scale-[1.02] transition-transform overflow-hidden relative">
                      {isSyncing ? (
                        <>
                          <Activity className="w-5 h-5 animate-spin shrink-0"/>
                          <span className="animate-pulse whitespace-nowrap">{loadingMessages[loadingIndex]}</span>
                        </>
                      ) : (
                        pricingState.packageId === "free" ? "Claim Free Brief" : "Secure Checkout"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: ADMIN DASHBOARD */}
            {activeTab === "admin" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-500">
                <div className={GLOW_CARD}>
                  <p className="text-[10px] md:text-xs uppercase text-[#D4AF37] font-black tracking-widest mb-2 md:mb-3">DPR Reports Generated</p>
                  <p className="text-4xl md:text-6xl font-black text-white">{adminProjects.length}</p>
                </div>
                <div className={GLOW_CARD}>
                  <p className="text-[10px] md:text-xs uppercase text-[#D4AF37] font-black tracking-widest mb-2 md:mb-3">Enrolled Network Vendors</p>
                  <p className="text-4xl md:text-6xl font-black text-white">{adminVendors.length}</p>
                </div>
                <div className={GLOW_CARD}>
                  <p className="text-[10px] md:text-xs uppercase text-[#D4AF37] font-black tracking-widest mb-2 md:mb-3">Platform Revenue</p>
                  <p className="text-4xl md:text-6xl font-black text-[#4ade80]">₹0</p>
                </div>
              </div>
            )}

            {/* MODULE 9: CONTACT US */}
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
                   <Globe className="w-32 h-32 text-white/5 absolute" />
                   <div className="bg-[#0A2540]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center relative z-10 mx-6">
                     <p className="font-black text-[#D4AF37] uppercase tracking-widest mb-2 text-lg">Surat, Gujarat</p>
                     <p className="text-xs text-white/60">Serving Healthcare Projects Nationwide</p>
                   </div>
                </div>
              </div>
            )}

          </div>

          {/* ==================== GLOBAL SEO FOOTER ==================== */}
          <footer className="bg-[#030b14] border-t border-white/5 py-10 px-6 md:px-10 shrink-0 z-50 text-center md:text-left mt-auto">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-black text-lg tracking-tighter uppercase text-white">Innovate <span className="text-[#D4AF37]">India</span></span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto md:mx-0">
                  India&apos;s premier AI-powered Hospital Project Consultancy. We deliver end-to-end solutions from NABH compliant architecture to medical equipment BOQs and ₹100+ Crore project finance syndication.
                </p>
                <p className="text-xs text-white/40 mt-4 leading-relaxed max-w-sm mx-auto md:mx-0">
                   <strong className="text-white/60">HQ:</strong> 135, Soham Arcade, Nr. Bagban Circle, Gauravpath Road, Pal, Surat. 394510
                </p>
              </div>
              <div>
                <h4 class="text-white font-bold mb-4 text-sm">Solutions</h4>
                <ul className="space-y-2 text-xs text-white/40">
                  <li><button onClick={()=>{setActiveTab('dpr');window.scrollTo(0,0)}} className="hover:text-[#D4AF37]">DPR Generator</button></li>
                  <li><button onClick={()=>{setActiveTab('funding');window.scrollTo(0,0)}} className="hover:text-[#D4AF37]">Hospital Loan Syndication</button></li>
                  <li><button onClick={()=>{setActiveTab('vendors');window.scrollTo(0,0)}} className="hover:text-[#D4AF37]">Medical Equipment Procurement</button></li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-bold mb-4 text-sm">Corporate</h4>
                <ul className="space-y-2 text-xs text-white/40">
                  <li><a href="https://www.hospitalprojectconsultancy.com/contact.html" className="hover:text-[#D4AF37]">Contact Us</a></li>
                  <li><a href="https://www.hospitalprojectconsultancy.com/privacy.html" className="hover:text-[#D4AF37]">Privacy Policy</a></li>
                  <li><a href="https://www.hospitalprojectconsultancy.com/about.html" className="hover:text-[#D4AF37]">About Us</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-6 max-w-[1200px] mx-auto">
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-3">Serving Hospitals Across Gujarat</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 text-[10px] text-white/20">
                {GUJARAT_CITIES.map((city, idx) => (
                  <span key={idx} className="hover:text-[#D4AF37] cursor-pointer transition-colors">{city}</span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center text-[10px] text-white/30">
              &copy; {new Date().getFullYear()} Innovate India Hospital Project Consultancy. All rights reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}