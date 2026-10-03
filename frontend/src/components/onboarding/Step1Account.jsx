import React, { useState } from 'react';
import { FiEyeOff, FiEye, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../api/API.js';

const Step1Account = ({ formData, updateData, nextStep }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields to continue.");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Creating secure account...");
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password,
          fullName: formData.fullName
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Automatically login the user or just push them to nextStep/home
        // Wait, register returns user but not token in this backend. Let's check backend register.
        // Actually, the backend register does NOT return a token.
        // So we might need to call login right after, or just let them go to login page.
        toast.success("Account created successfully! Please log in.", { id: toastId });
        nextStep(); // which goes to home, wait, it will redirect to login if not authenticated
      } else {
        toast.error(data.error || "Registration failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-[26px] md:text-[24px] font-bold text-white mb-4 tracking-tight leading-tight">Let's create your account</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-[14px] md:text-[12px] font-bold text-gray-300 mb-1.5 md:uppercase tracking-normal md:tracking-wide">Full name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-4 py-3 md:py-2.5 text-[16px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
            value={formData.fullName || ''}
            onChange={(e) => updateData({ fullName: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); emailRef.current?.focus(); } }}
          />
        </div>
        <div>
          <label className="block text-[14px] md:text-[12px] font-bold text-gray-300 mb-1.5 md:uppercase tracking-normal md:tracking-wide">Email address</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-4 py-3 md:py-2.5 text-[16px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
            ref={emailRef}
            value={formData.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); passwordRef.current?.focus(); } }}
          />
        </div>
        <div>
          <label className="block text-[14px] md:text-[12px] font-bold text-gray-300 mb-1.5 md:uppercase tracking-normal md:tracking-wide">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a strong password" 
              className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-4 py-3 md:py-2.5 text-[16px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all pr-10 placeholder:text-gray-500"
              ref={passwordRef}
              value={formData.password || ''}
              onChange={(e) => updateData({ password: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleStart(e); } }}
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

      <p className="text-[13px] md:text-[11px] text-gray-400 mt-3 mb-4">
        Already have an account? <Link to="/login" className="text-[#0077ff] font-bold cursor-pointer hover:underline">Log in</Link>
      </p>

      <button 
        onClick={handleStart}
        disabled={isLoading}
        className="w-full bg-[#0077ff] hover:bg-blue-600 text-white rounded-xl py-4 md:py-3 text-[15px] md:text-[13px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Setting up...' : 'Get Started'}
        {!isLoading && <FiArrowRight className="text-base" />}
      </button>
    </div>
  );
};

export default Step1Account;
