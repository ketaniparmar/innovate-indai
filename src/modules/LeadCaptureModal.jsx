import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this points to your client file

const LeadCaptureModal = ({ projectData, onUnlockSuccess }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUnlock = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1️⃣ INSERT THE LEAD (The Person)
            const { data: leadData, error: leadError } = await supabase
                .from('leads')
                .insert([{ 
                    email: email, 
                    phone: phone, 
                    lead_status: 'TEASER_UNLOCKED' 
                }])
                .select() // Select returns the newly created row so we get the ID
                .single();

            if (leadError) throw leadError;

            // 2️⃣ INSERT THE PROJECT (The Hospital) & Link to Lead
            const { error: projectError } = await supabase
                .from('projects')
                .insert([{ 
                    lead_id: leadData.id, // Relational link to the person
                    city: projectData.city, 
                    planned_beds: projectData.beds, 
                    estimated_capex_cr: projectData.capex,
                    project_stage: 'FEASIBILITY_CHECK'
                }]);

            if (projectError) throw projectError;

            // 3️⃣ SUCCESS! Remove the blur and let them see the data
            console.log("✅ Lead & Project secured in CRM.");
            onUnlockSuccess(); 

        } catch (err) {
            console.error("CRM Capture Failed:", err);
            setError("Unable to unlock dashboard. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/80 backdrop-blur-md">
            <div className="bg-[#0A2540] border border-[#D4AF37]/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
                
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#AA8A2E]"></div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                        Unlock Your <span className="text-[#D4AF37]">DPR</span>
                    </h2>
                    <p className="text-sm text-white/60">
                        Your {projectData.beds}-bed feasibility report for {projectData.city} is ready. Where should we send the PDF backup?
                    </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <input 
                            type="email" 
                            required
                            placeholder="Doctor/Investor Email" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="tel" 
                            required
                            placeholder="WhatsApp Number" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8A2E] text-[#0A2540] font-black uppercase tracking-wider py-4 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Decrypting Report...' : 'View Financial Dashboard'}
                    </button>
                    <p className="text-[10px] text-center text-white/30 uppercase tracking-widest mt-4">
                        Secured by Innovate IndAI Core
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LeadCaptureModal;