import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api/API.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const passwordRef = React.useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Authenticating...");
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Welcome back!", { id: toastId });
        await login(data.token, data.user);
        navigate('/home');
      } else {
        toast.error(data.error || "Login failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row-reverse bg-[#0b0f19] overflow-hidden font-sans">
      
      {/* RIGHT PANEL: Login Image (now on the right) */}
      <div className="hidden md:block w-full md:w-[45%] lg:w-[45%] h-[35vh] md:h-screen relative shrink-0 overflow-hidden bg-black">
        <img 
          src="/login_image.jfif" 
          alt="Honesti Kitchen Login" 
          className="w-full h-full object-cover object-center"
        />
        
      
        {/* Fade gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent via-70% to-[#0b0f19] pointer-events-none w-full z-0"></div>
      </div>

      {/* LEFT PANEL: Form Area (now on the left) */}
      <div className="flex-1 h-full md:h-screen overflow-hidden relative flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 z-20">
        
        <Logo className="mb-6 md:mb-12 shrink-0 z-30" />

        {/* Main Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[400px] bg-[#0f1523]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-8 relative shrink-0"
        >
          <h2 className="text-[26px] md:text-[24px] font-bold text-white mb-6 tracking-tight leading-tight text-center">Welcome back</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[14px] md:text-[12px] font-bold text-gray-300 mb-1.5 md:uppercase tracking-normal md:tracking-wide">Email address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-4 py-3 md:py-2.5 text-[16px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); passwordRef.current?.focus(); } }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[14px] md:text-[12px] font-bold text-gray-300 md:uppercase tracking-normal md:tracking-wide">Password</label>
                <span className="text-[10px] text-[#0077ff] cursor-pointer hover:underline">Forgot?</span>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-4 py-3 md:py-2.5 text-[16px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all pr-10 placeholder:text-gray-500"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLogin(e); } }}
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

          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-8 bg-[#0077ff] hover:bg-blue-600 text-white rounded-xl py-4 md:py-3.5 text-[15px] md:text-[13px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Log in'}
            {!isLoading && <FiArrowRight className="text-base" />}
          </button>
          
          <p className="text-[13px] md:text-[11px] text-gray-400 mt-6 text-center">
            Don't have an account? <Link to="/onboarding" className="text-[#0077ff] font-bold cursor-pointer hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
