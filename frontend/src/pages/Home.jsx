import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const quotes = [
  "It's not just about what's on your plate, but who's around it. — Honesti",
  "Good food is the foundation of genuine happiness. — Honesti",
  "Small choices today build a healthier tomorrow. — Honesti",
  "Let's make dinner a time to connect. — Honesti"
];

const initialNotifications = [
  { id: 1, type: 'warning', title: 'Pantry Alert', message: 'Chicken breasts expire tomorrow.', time: '2h ago', icon: <FiAlertCircle /> },
  { id: 2, type: 'success', title: 'Feedback Learned', message: 'Noted: Aden loved the creamy tomato pasta!', time: 'Yesterday', icon: <FiCheckCircle /> },
  { id: 3, type: 'info', title: 'Garden Update', message: 'Your basil might be ready for harvesting.', time: '2d ago', icon: <FiInfo /> },
];

const upcomingNotifications = [
  { id: 100, type: 'warning', title: 'Action Required', message: 'Please complete the persona details for your household members to personalize recipes.', time: 'Just now', icon: <FiAlertCircle /> },
  { id: 101, type: 'info', title: 'Smart Oven Sync', message: 'Preheating started for tonight\'s dinner plan.', time: 'Just now', icon: <FiInfo /> },
  { id: 102, type: 'success', title: 'Grocery Delivery', message: 'Fresh basil has been delivered to your door.', time: 'Just now', icon: <FiCheckCircle /> },
  { id: 103, type: 'warning', title: 'Low Stock', message: 'Running dangerously low on Olive Oil.', time: 'Just now', icon: <FiAlertCircle /> },
  { id: 104, type: 'success', title: 'Goal Achieved', message: '3 healthy dinners cooked this week. Great job!', time: 'Just now', icon: <FiCheckCircle /> },
];

// --- Global Audio Setup for Autoplay Policies ---
let globalAudioCtx = null;

const initAudio = () => {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      globalAudioCtx = new AudioContext();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
};

const playNotificationSound = () => {
  if (!globalAudioCtx || globalAudioCtx.state === 'suspended') return;
  try {
    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();
    
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(880, globalAudioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, globalAudioCtx.currentTime + 0.1); // Slide to A6
    
    gain.gain.setValueAtTime(0, globalAudioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, globalAudioCtx.currentTime + 0.05); // soft volume
    gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);
    
    osc.start();
    osc.stop(globalAudioCtx.currentTime + 1);
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [greeting, setGreeting] = useState('');
  const cachedProfile = JSON.parse(localStorage.getItem('userProfile') || '{"firstName": "User"}');
  const [userProfile, setUserProfile] = useState(cachedProfile);
  
  // Live Notifications State
  const [activeNotifications, setActiveNotifications] = useState(initialNotifications);
  const [pendingNotifications, setPendingNotifications] = useState(upcomingNotifications);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`http://localhost:3001/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
          localStorage.setItem('userProfile', JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, []);

  // Unlock audio on first user interaction
  useEffect(() => {
    const unlockAudio = () => initAudio();
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Live Notification Simulator for Demo
  useEffect(() => {
    if (pendingNotifications.length === 0) return;

    // Pop a new notification every 6 seconds to show the client
    const timer = setTimeout(() => {
      const newNote = pendingNotifications[0];
      
      // Removed playNotificationSound() call to stop the annoying sound

      // Add to list and remove from pending queue
      setActiveNotifications(prev => [newNote, ...prev]);
      setPendingNotifications(prev => prev.slice(1));
    }, 6000);

    return () => clearTimeout(timer);
  }, [pendingNotifications]);

  return (
    <div className="h-full w-full flex relative overflow-hidden bg-black">
      
      {/* Background Image spans the entire screen */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 bg-[#0b0f19] overflow-hidden"
      >
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Honesti Avatar" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-95"
        />
        {/* Subtle dark gradient overlay so text stays readable over the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/90 via-[#0b0f19]/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Center Empty Space for the Avatar to be visible */}
      <div className="flex-1 relative z-10 hidden md:flex flex-col justify-end p-5 pointer-events-none pb-6">
        
        {/* Floating Rotating Quote - Moved further down */}
        <div className="max-w-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.8 }}
              className="bg-[#0b0f19]/80 backdrop-blur-md border border-white/10 rounded-xl p-5 flex items-start gap-4 shadow-2xl pointer-events-auto"
            >
              <span className="text-blue-400 text-sm mt-0.5 drop-shadow-md">🌿</span>
              <p className="text-base text-gray-200 italic leading-snug drop-shadow-md font-medium">
                {quotes[quoteIndex].split('—')[0]}
                <br />
                <span className="text-blue-400 font-semibold not-italic text-[15px] flex items-center gap-3 mt-1">
                  <img src="/logo/circle_avatar_logo.png" className="w-5.5 h-5.5 rounded-full shadow-sm" alt="" />
                  — Honesti
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Interaction Panel */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        className="w-full md:w-[380px] lg:w-[420px] h-full bg-transparent flex flex-col shrink-0 relative z-20 ml-auto pt-3 md:pt-6 px-5 md:px-5 pb-3 md:pb-6 overflow-hidden"
      >
        <div className="flex flex-col gap-5 md:gap-4 h-full">
          
          {/* GROUP 1: Clean Greeting Header */}
          <div className="shrink-0 self-start bg-black/40 backdrop-blur-md rounded-xl px-5 md:px-4 py-2 md:py-2 border border-white/5 shadow-lg ml-1 md:ml-2 mt-1 md:mt-2">
            <h2 className="text-[15px] md:text-2xl font-serif text-white font-medium tracking-tight drop-shadow-md">
              {greeting}, {userProfile?.firstName || 'User'}.
            </h2>
          </div>

          {/* GROUP 3: Highly Futuristic Attention-Seeking Chat Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, -5, 0], opacity: 1 }}
            transition={{ 
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, 
              opacity: { delay: 0.8, duration: 0.5 } 
            }}
            className="shrink-0 flex justify-end pr-2 pb-2 relative"
          >
            {/* Massive breathing background glow to draw the eye */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-gradient-to-r from-[#0077ff]/30 to-[#ff6600]/30 rounded-full blur-[20px] animate-pulse pointer-events-none"></div>

            <button onClick={() => navigate('/chat')} className="relative group p-[2px] rounded-full overflow-hidden active:scale-95 transition-all shadow-[0_0_25px_rgba(0,119,255,0.5)] hover:shadow-[0_0_40px_rgba(255,102,0,0.7)] z-10 cursor-pointer">
              
              {/* Thicker, brighter spinning conic gradient */}
              <div className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_0%,#00000000_20%,#ff6600_40%,#0077ff_60%,#00000000_100%)] opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Inner Button Core with glass sheen */}
              <div className="relative bg-[#0b0f19] rounded-full px-5 py-2 md:px-7 md:py-3.5 flex items-center justify-center gap-3 md:gap-5 border border-white/10 overflow-hidden group-hover:bg-[#0b0f19]/90 transition-colors">
                
                {/* Sweeping Light reflection using Framer Motion */}
                <motion.div 
                  animate={{ x: ['-200%', '300%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 w-1/2 pointer-events-none"
                />

                {/* Blinking Live Indicator */}
                <div className="relative flex items-center justify-center w-2.5 h-2.5 md:w-4 md:h-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff6600] animate-ping opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-[#ff6600] shadow-[0_0_12px_#ff6600]"></span>
                </div>
                
                {/* High-contrast Text */}
                <span className="z-10 bg-gradient-to-r from-blue-200 via-white to-orange-300 bg-clip-text text-transparent uppercase tracking-[0.15em] md:tracking-[0.25em] font-black text-[15px] md:text-base drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  Engage Honesti
                </span>
              </div>
            </button>
          </motion.div>

          {/* GROUP 2: Notifications List (Scrollable & Animated) */}
          <div className="bg-[#0b0f19]/60 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-4 shadow-lg flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-5 px-1 shrink-0">
              <h4 className="text-xs font-bold text-white tracking-wide drop-shadow-md flex items-center gap-2">
                Recent Updates
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </h4>
            </div>
            
            {/* Scrollable list of context items with layout animations */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 flex flex-col custom-scrollbar">
              <AnimatePresence initial={false}>
                {activeNotifications.map((note) => (
                  <motion.div 
                    key={note.id} 
                    layout
                    initial={{ opacity: 0, x: -30, scale: 0.95, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, x: 0, scale: 1, height: 'auto', marginBottom: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-[#0b0f19]/70 hover:bg-[#0b0f19]/90 border border-white/10 rounded-lg md:rounded-xl p-4 md:p-5 flex gap-4 md:gap-5 transition-colors cursor-default shadow-md shrink-0"
                  >
                    <div className={`mt-0.5 text-base md:text-lg shrink-0 ${
                      note.type === 'warning' ? 'text-amber-400' :
                      note.type === 'success' ? 'text-emerald-400' :
                      'text-blue-400'
                    }`}>
                      {note.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[15px] md:text-base font-bold text-white leading-tight">{note.title}</h5>
                        <span className="text-[15px] md:text-base text-gray-400 font-medium whitespace-nowrap ml-2">{note.time}</span>
                      </div>
                      <p className="text-base md:text-[15px] text-gray-300 mt-1 md:mt-1.5 leading-snug font-medium drop-shadow-sm">{note.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Home;

