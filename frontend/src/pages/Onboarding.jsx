import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Step1Account from '../components/onboarding/Step1Account';
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
    navigate('/home');
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div ref={scrollRef} className="min-h-[100dvh] w-full flex flex-col items-center justify-start pt-8 md:pt-0 md:justify-center bg-[#0b0f19] p-4 font-sans overflow-y-auto custom-scrollbar">
      
      <Logo className="mb-4 md:mb-12 mt-4 md:mt-0" />

      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-[460px] bg-[#0f1523]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-8 relative shrink-0"
      >
          
          

          {/* Form Steps */}
          <div className="relative">
            {step === 1 && <Step1Account formData={formData} updateData={updateData} nextStep={nextStep} />}
            {step === 2 && <Step2Household formData={formData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
          </div>

        </motion.div>
    </div>
  );
};

export default Onboarding;
