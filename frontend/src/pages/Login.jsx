import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { API_URL } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading("Authenticating...");
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Welcome back!", { id: loadingToast });
        localStorage.setItem('token', data.token); // Save token
        navigate('/home');
      } else {
        toast.error(data.error || "Login failed", { id: loadingToast });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server connection error", { id: loadingToast });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0b0f19] p-4 font-sans">
      
      <Logo className="mb-8 md:mb-12" />

      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] bg-[#0f1523]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-8 relative shrink-0"
      >
          <h2 className="text-[24px] font-bold text-white mb-6 tracking-tight leading-tight text-center">Welcome back</h2>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-[10px] md:text-[12px] font-bold text-gray-300 mb-1.5 tracking-wide">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-md md:rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-[11px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] md:text-[12px] font-bold text-gray-300 tracking-wide">Password</label>
                {/* <span className="text-[10px] text-[#0077ff] cursor-pointer hover:underline">Forgot?</span> */}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-md md:rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-[11px] md:text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all pr-10 placeholder:text-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-4 md:mt-8 bg-[#0077ff] hover:bg-blue-600 text-white rounded-md md:rounded-xl py-2.5 md:py-3.5 text-[11px] md:text-[13px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Log in'}
            {!isLoading && <FiArrowRight size={14} className="md:text-base" />}
          </button>
          
          <p className="text-[11px] text-gray-400 mt-6 text-center">
            Don't have an account? <Link to="/onboarding" className="text-[#0077ff] font-bold cursor-pointer hover:underline">Sign up</Link>
          </p>
        </motion.div>
    </div>
  );
};

export default Login;
