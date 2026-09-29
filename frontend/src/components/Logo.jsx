import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src="/auth_logo.png" 
        alt="Honesti AI - Your Kitchen Companion" 
        className="w-62 h-auto object-contain"
      />
    </div>
  );
};

export default Logo;
