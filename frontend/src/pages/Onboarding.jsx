import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Step1Account from '../components/onboarding/Step1Account';
import Step2Household from '../components/onboarding/Step2Household';
import Logo from '../components/Logo';

const Onboarding = () => {
  const [step, setStep] = useState(1);
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
    if (step < 2) {
      setStep(step + 1);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/home'); // Finish onboarding
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0b0f19] overflow-hidden font-sans">
      
      {/* LEFT PANEL: Clean Image without bubbles */}
      <div className="w-full md:w-[45%] lg:w-[45%] h-[35vh] md:h-screen relative shrink-0 overflow-hidden bg-black">
        <img 
          src="/auth_sidebar_square.jpg" 
          alt="Honesti Kitchen" 
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark gradient overlay to blend into the dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-[#0b0f19] pointer-events-none w-full z-0"></div>
      </div>

      {/* RIGHT PANEL: Form Area */}
      <div ref={scrollRef} className="flex-1 h-[65vh] md:h-screen overflow-y-auto relative flex flex-col items-center justify-start pt-6 md:pt-10 pb-12 p-4 md:p-6 lg:p-8 z-20 custom-scrollbar">
        
        <Logo className="mb-8 md:mb-10" />

        {/* Main Card Container */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[460px] bg-[#0f1523]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-8 relative shrink-0"
        >
          
          {/* Progress Header */}
          <div className="mb-6">
            <h3 className="text-center text-[11px] font-bold text-gray-400 mb-3 tracking-wide uppercase">
              {step === 1 && "Step 01: Create Account"}
              {step === 2 && "Step 02: Household Context"}
            </h3>
            
            {/* Progress Bar */}
            <div className="flex gap-2 w-full max-w-[260px] mx-auto">
              <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-[#0077ff]' : 'bg-white/10'}`}></div>
              <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-[#0077ff]' : 'bg-white/10'}`}></div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="relative">
            {step === 1 && <Step1Account formData={formData} updateData={updateData} nextStep={nextStep} />}
            {step === 2 && <Step2Household formData={formData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
