import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LeadCaptureModal from './LeadCaptureModal'; // Import the new modal

const DPRBuilder = () => {
    const [searchParams] = useSearchParams();
    
    // 1. The "Gatekeeper" State
    const [isUnlocked, setIsUnlocked] = useState(false);

    const projectData = {
        city: searchParams.get('city') || 'Surat',
        beds: parseInt(searchParams.get('beds')) || 100,
        capex: ((parseInt(searchParams.get('beds')) || 100) * 50) / 100 // ₹50L per bed formula
    };

    return (
        <div className="relative min-h-screen bg-[#0A2540]">
            
            {/* If not unlocked, show the modal on top */}
            {!isUnlocked && (
                <LeadCaptureModal 
                    projectData={projectData} 
                    onUnlockSuccess={() => setIsUnlocked(true)} 
                />
            )}

            {/* The Dashboard (Blurred if locked) */}
            <div className={`p-10 transition-all duration-700 ${!isUnlocked ? 'blur-md opacity-40 select-none pointer-events-none' : 'blur-none opacity-100'}`}>
                
                <h1 className="text-4xl font-black uppercase text-[#D4AF37] mb-2">
                    Project Feasibility Dashboard
                </h1>
                <p className="text-white/60 mb-10">
                    Live analysis for {projectData.beds} beds in {projectData.city}.
                </p>

                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-sm text-white/50 uppercase tracking-widest">Total CAPEX</h3>
                        <p className="text-4xl font-black text-white mt-2">₹{projectData.capex.toFixed(2)} Cr</p>
                    </div>
                    {/* ... Rest of your dashboard metrics ... */}
                </div>
            </div>
        </div>
    );
};

export default DPRBuilder;