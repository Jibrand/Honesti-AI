import React, { useState } from 'react';
import { FiEyeOff, FiEye, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { API_URL } from '../../api';

const Step1Account = ({ formData, updateData, nextStep }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const handleStart = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields to continue.");
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading("Creating secure account...");
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, fullName: formData.fullName })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Account created successfully!", { id: loadingToast });
        nextStep();
      } else {
        toast.error(data.error || "Registration failed", { id: loadingToast });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server connection error", { id: loadingToast });
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-[20px] md:text-[24px] font-bold text-white mb-3 md:mb-4 tracking-tight leading-tight">Let's create your account</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-[12px] font-bold text-gray-300 mb-1.5 tracking-wide">Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
            value={formData.fullName || ''}
            onChange={(e) => updateData({ fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-300 mb-1.5 tracking-wide">Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
            value={formData.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-300 mb-1.5 tracking-wide">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a strong password" 
              className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all pr-10 placeholder:text-gray-500"
              value={formData.password || ''}
              onChange={(e) => updateData({ password: e.target.value })}
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-3 mb-4">
        Already have an account? <Link to="/login" className="text-[#0077ff] font-bold cursor-pointer hover:underline">Log in</Link>
      </p>

      <button 
        onClick={handleStart}
        disabled={isLoading}
        className="w-full bg-[#0077ff] hover:bg-blue-600 text-white rounded-lg md:rounded-xl py-2.5 md:py-3 text-[12px] md:text-[13px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Setting up...' : 'Get Started'}
        {!isLoading && <FiArrowRight className="text-base" />}
      </button>
    </div>
  );
};

export default Step1Account;
