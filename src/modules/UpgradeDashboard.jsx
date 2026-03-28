import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DPRDocument from '../pdf/DPRDocument';
import { supabase } from '../supabaseClient';

const UpgradeDashboard = ({ config, engine }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    // 1. Call your Edge Function to get an Order ID
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount: 4999 }
    });

    if (error) { alert("Payment Gateway Error"); setLoading(false); return; }

    // 2. Configure Razorpay Checkout
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Enter your Public Key
      amount: data.amount,
      currency: data.currency,
      name: "Innovate IndAI",
      description: "Premium 50-Page Hospital DPR",
      order_id: data.id,
      handler: function (response) {
        // SUCCESS: Unlock the PDF
        setIsPaid(true);
        setLoading(false);
        // Add logic here to save "paid: true" to your 'leads' table in Supabase
      },
      prefill: {
        name: "Doctor / Investor",
        email: "client@example.com"
      },
      theme: { color: "#0A2540" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#010810] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[#051626] border border-[#D4AF37]/30 rounded-3xl p-10 text-center shadow-2xl">
        
        {!isPaid ? (
          <>
            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-[#D4AF37] w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase mb-4">Unlock Premium <span className="text-[#D4AF37]">DPR</span></h2>
            <p className="text-white/60 mb-8">Get the full 50-page Bank-Ready report including Financial P&L, NABH Zoning, and Equipment BOQ.</p>
            
            <div className="bg-white/5 p-6 rounded-2xl mb-8 border border-white/5">
              <span className="text-white/40 text-xs uppercase font-bold tracking-widest">Investment</span>
              <div className="text-4xl font-black text-[#D4AF37]">₹4,999 <span className="text-sm text-white/40 line-through">₹15,000</span></div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#010810] font-black py-5 rounded-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              {loading ? "Initializing Gateway..." : "Pay & Download Instantly"}
            </button>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-green-400 uppercase mb-4">Payment Verified</h2>
            <p className="text-white/60 mb-8">Your bespoke DPR for {config.beds} beds is ready for download.</p>
            
            <PDFDownloadLink 
              document={<DPRDocument project={{ city: config.cityTier === 1 ? 'Tier 1 City' : 'Gujarat Region', planned_beds: config.beds }} />} 
              fileName={`DPR_PREMIUM_${config.beds}_BEDS.pdf`}
              className="inline-block bg-white text-[#010810] font-black py-5 px-12 rounded-2xl uppercase tracking-widest hover:bg-emerald-400 transition-all"
            >
              {({ loading }) => loading ? "Encrypting PDF..." : "📥 Download Premium PDF"}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};