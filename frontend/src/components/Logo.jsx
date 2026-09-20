import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-end relative leading-none">
        <span className="text-white text-[36px] font-bold tracking-[-0.03em] lowercase font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
          honesti
        </span>
        <span className="text-[#00E5FF] text-[36px] font-bold tracking-[-0.03em] lowercase font-sans relative" style={{ fontFamily: "'Inter', sans-serif" }}>
          ai
          {/* Minimalist Spark icon above the 'i' */}
          <div className="absolute -top-3.5 right-[3px] text-[#00E5FF] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
              <path d="M12 2v2"/>
              <path d="M19.07 4.93l-1.41 1.41"/>
              <path d="M22 12h-2"/>
              <path d="M4.93 4.93l1.41 1.41"/>
            </svg>
          </div>
        </span>
      </div>
      <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-1.5 opacity-80" style={{ fontFamily: "'Inter', sans-serif" }}>
        Your Kitchen Companion
      </span>
    </div>
  );
};

export default Logo;
