import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiCoffee, FiShoppingBag, FiGlobe, FiUsers, FiSettings, FiMenu, FiX, FiUser, FiLogOut, FiStar } from 'react-icons/fi';
import { MdChildCare, MdYard } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', path: '/home', icon: <FiHome /> },
    { name: 'Personas', path: '/household', icon: <FiUsers /> },
    { name: 'Pantry', path: '/pantry', icon: <FiShoppingBag /> },
    { name: 'Global Cookbook', path: '/cookbook', icon: <FiGlobe /> },
    { name: 'Feedback Hub', path: '/feedback', icon: <FiStar /> },
    // { name: 'HonestGarden', path: '/garden', icon: <MdYard /> },
    // { name: 'Little Chefs', path: '/little-chefs', icon: <MdChildCare /> },
    // { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  const showFullSidebar = isLocked || isHovered;

  const sidebarContent = (
    <>
      {/* Header Area */}
      <div className={`pt-6 pb-4 px-3 flex items-start justify-between ${!showFullSidebar ? 'justify-center px-0' : ''} transition-all duration-300 min-h-[72px]`}>
        <div className="flex items-start gap-2 overflow-hidden">
          <img 
            src="/sidebar_logo.png" 
            alt="Logo" 
            className="w-[30px] h-[30px] shrink-0 object-contain mt-0.5"
          />
          {showFullSidebar && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shrink-0 flex-1 min-w-0 flex flex-col justify-start">
              <h1 className="text-[15px] font-bold tracking-tight text-white leading-tight whitespace-nowrap">HonestChoice <span className="text-[#0077ff]">AI</span></h1>
              <p className="text-[10px] text-gray-400 tracking-normal font-semibold whitespace-nowrap origin-left transform scale-[0.75]">
                One Companion. Endless Possibilities.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Mobile Close Button */}
        <button className="md:hidden text-gray-400 text-2xl mt-0.5" onClick={() => setIsMobileOpen(false)}>
          <FiX />
        </button>

        {/* Desktop Hamburger / Lock Toggle - Cleanly styled */}
        {showFullSidebar && (
          <div 
            className="hidden md:flex flex-col gap-[3px] cursor-pointer group p-1 shrink-0 -ml-1 mt-1"
            onClick={() => setIsLocked(!isLocked)}
          >
            <div className="w-[12px] h-[1.5px] bg-gray-400 group-hover:bg-white transition-colors rounded-full"></div>
            <div className="w-[12px] h-[1.5px] bg-gray-400 group-hover:bg-white transition-colors rounded-full"></div>
            <div className="w-[12px] h-[1.5px] bg-gray-400 group-hover:bg-white transition-colors rounded-full"></div>
          </div>
        )}
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors relative overflow-hidden ${
                isActive
                  ? 'bg-[#0077ff] text-white shadow-sm shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${!showFullSidebar ? 'justify-center px-0 mx-1' : ''}`
            }
          >
            <span className="text-[16px] shrink-0 z-10">{item.icon}</span>
            {showFullSidebar && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 whitespace-nowrap">
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile / Bottom Area */}
      <div className={`p-4 border-t border-white/5 mt-auto relative shrink-0 ${!showFullSidebar ? 'flex justify-center' : ''}`} ref={profileRef}>
        
        {/* Dropup Menu */}
        <AnimatePresence>
          {isProfileOpen && showFullSidebar && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-[#0b0f19] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
            >
              <button onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} className="cursor-pointer w-full px-4 py-2.5 text-left text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                <FiUser className="text-gray-400" />
                View Profile
              </button>
              <button onClick={() => navigate('/login')} className="cursor-pointer w-full px-4 py-2.5 text-left text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                <FiLogOut />
                Log out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Button */}
        <div 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${!showFullSidebar ? 'justify-center p-2' : ''}`}
        >
          {/* User Avatar (Fallback to initials) */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-[12px] shrink-0 shadow-md">
            Mv
          </div>
          
          {showFullSidebar && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap flex-1 overflow-hidden">
              <p className="text-[11px] font-bold text-white truncate leading-tight">Maya v</p>
              <p className="text-[8.5px] text-gray-400 truncate mt-0.5">maya@household.com</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f1523] border-b border-white/5 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/sidebar_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <button onClick={() => setIsMobileOpen(true)} className="text-white text-2xl">
          <FiMenu />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.div 
        animate={{ width: showFullSidebar ? 220 : 56 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        onMouseEnter={() => !isLocked && setIsHovered(true)}
        onMouseLeave={() => {
          if(!isLocked) {
            setIsHovered(false);
            setIsProfileOpen(false); // Close dropdown if sidebar shrinks
          }
        }}
        className="bg-[#0f1523] border-r border-white/5 h-screen flex-col hidden md:flex shrink-0 relative z-30"
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0f1523] z-50 flex flex-col md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
