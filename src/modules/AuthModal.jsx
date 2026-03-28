import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export default function AuthModal({ supabase, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up (Lead Capture)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOG IN EXISTING USER ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        onSuccess(data.session);
      } else {
        // --- SIGN UP NEW LEAD ---
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              role: 'CLIENT'
            }
          }
        });
        if (error) throw error;
        onSuccess(data.session);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#051626] border border-[#D4AF37]/30 rounded-[30px] w-full max-w-md shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10">
          <X size={24} />
        </button>

        {/* Header Block */}
        <div className="bg-[#0A2540] p-8 pb-6 border-b border-white/5">
          <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center rounded-xl mb-4 border border-[#D4AF37]/30">
            <ShieldCheck className="text-[#D4AF37] w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            {isLogin ? "Welcome Back" : "Unlock Full Platform"}
          </h2>
          <p className="text-white/60 text-xs mt-2 font-bold uppercase tracking-widest">
            {isLogin ? "Access your saved projects." : "Save progress & access AI modules."}
          </p>
        </div>

        {/* Form Block */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Lead Capture Fields (Only for Sign Up) */}
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input 
                    type="text" name="fullName" required placeholder="Full Name"
                    value={formData.fullName} onChange={handleChange}
                    className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input 
                    type="tel" name="phone" required placeholder="WhatsApp Number"
                    value={formData.phone} onChange={handleChange}
                    className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50 transition-colors"
                  />
                </div>
              </>
            )}

            {/* Standard Login Fields */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="email" name="email" required placeholder="Email Address"
                value={formData.email} onChange={handleChange}
                className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="password" name="password" required placeholder="Password"
                value={formData.password} onChange={handleChange}
                className="w-full bg-[#010810] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-bold outline-none focus:border-[#D4AF37]/50 transition-colors"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 mt-4 bg-[#D4AF37] text-black rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Activity className="animate-spin w-5 h-5" /> : (isLogin ? "Sign In" : "Create Account & Unlock")}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-[#D4AF37] text-xs font-black uppercase tracking-widest mt-2 hover:underline"
            >
              {isLogin ? "Create Free Account" : "Sign In Here"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}