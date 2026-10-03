import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Step1Account from '../components/onboarding/Step1Account';
import Logo from '../components/Logo';

const Onboarding = () => {
  const scrollRef = useRef(null);
  const [formData, setFormData] = useState({
    adults: 2,
    kids: 1,
    pantry: ['olive-oil', 'garlic'],
    equipment: ['air-fryer', 'oven'],
    dietary: []
  });
  
  const navigate = useNavigate();

  const updateData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    navigate('/home'); // Finish onboarding
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row bg-[#0b0f19] overflow-hidden font-sans">
      
      {/* LEFT PANEL: Clean Image without bubbles */}
      <div className="hidden md:block w-full md:w-[45%] lg:w-[45%] h-[35vh] md:h-screen relative shrink-0 overflow-hidden bg-black">
        <img 
          src="/onbording__image.jfif" 
          alt="Honesti Kitchen" 
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark gradient overlay to blend into the dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-[#0b0f19] pointer-events-none w-full z-0"></div>
      </div>

      {/* RIGHT PANEL: Form Area */}
      <div ref={scrollRef} className="flex-1 h-full md:h-screen overflow-hidden relative flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 z-20">
        
        <Logo className="mb-6 md:mb-6 shrink-0 z-30" />

        {/* Main Card Container */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[460px] bg-[#0f1523]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10 p-5 md:p-6 relative shrink-0"
        >
          
          {/* Progress Header */}
          <div className="mb-6">
            <h3 className="text-center text-[11px] font-bold text-gray-400 mb-3 tracking-wide uppercase">
              Create Account
            </h3>
          </div>

          {/* Form Steps */}
          <div className="relative">
            <Step1Account formData={formData} updateData={updateData} nextStep={nextStep} />
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
