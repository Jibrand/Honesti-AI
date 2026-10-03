import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit2, FiHeart, FiThumbsDown, FiMoreHorizontal, FiUser, FiPlus, FiTrash2, FiSave, FiCamera, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

// 10 Years of Rich Persona History Data
const initialPersonas = [
  {
    id: 1,
    name: 'Maya',
    role: 'Primary Admin (Mother)',
    email: 'maya@household.com',
    avatar: 'https://i.pravatar.cc/150?u=maya1',
    likes: [
      'Spicy Thai', 'Matcha', 'Dark Chocolate', 'Grilled Salmon', 'Kombucha', 
      'Avocado Toast', 'Truffle Fries', 'Miso Soup', 'Edamame', 'Arugula', 
      'Pistachios', 'Sourdough', 'Kimchi', 'Pho', 'Boba Tea', 
      'Lentil Soup', 'Goat Cheese', 'Balsamic Glaze', 'Sweet Potatoes', 'Hummus'
    ],
    dislikes: [
      'Heavy Cream', 'Cilantro', 'Truffle Oil', 'Raw Onions', 'Canned Tuna',
      'Blue Cheese', 'Black Licorice', 'Marzipan', 'Overcooked Steak', 'Capers',
      'Olives', 'Sardines', 'Marmite', 'Excessive Garlic', 'Artificial Cherry'
    ],
    dietary: ['Low Carb (Weekdays)', 'Intermittent Fasting'],
    allergies: ['None'],
    notes: 'Honesti Context (10-Year Log): Maya has slowly transitioned from heavy comfort foods in 2016 to Mediterranean-leaning, low-carb weekday meals. She still strictly avoids cilantro due to the soap-gene. Requires a matcha recipe variation at least twice a month for Sunday mornings. Prefers dinners that take under 30 minutes on Tuesdays and Thursdays due to work schedule. In 2019, she attempted a strict Keto diet but abandoned it after 3 months; she now prefers a balanced low-carb approach but will never say no to fresh sourdough bread on weekends. Highly sensitive to heavy cream sauces, replacing them with cashew cream or light coconut milk whenever possible.'
  },
  {
    id: 2,
    name: 'David',
    role: 'Adult (Father)',
    email: 'david@household.com',
    avatar: 'https://i.pravatar.cc/150?u=david2',
    likes: [
      'Smoked Brisket', 'Sourdough Bread', 'Espresso', 'Pasta Carbonara', 'Ribeye Steak',
      'Bacon', 'Eggs Benedict', 'Hash Browns', 'Craft Beer', 'Chili',
      'Pulled Pork', 'Cornbread', 'Grilled Asparagus', 'Peanut Butter', 'Oatmeal'
    ],
    dislikes: [
      'Eggplant', 'Quinoa', 'Overly Sweet Desserts', 'Kale', 'Beets',
      'Tofu', 'Tempeh', 'Matcha', 'Kombucha', 'Grapefruit'
    ],
    dietary: ['High Protein'],
    allergies: ['Pecans (Mild)'],
    notes: 'Honesti Context (10-Year Log): David started marathon training in 2021 and shifted to high-protein recovery meals. He purchased a smoker in 2023, so weekend recommendations should heavily feature slow-cooked meats. Always rejects quinoa-based sides. Double his espresso intake during tax season (March-April). Relies heavily on oatmeal for pre-run fuel.'
  },
  {
    id: 3,
    name: 'Aden',
    role: 'Teenager (16)',
    email: 'aden@household.com',
    avatar: 'https://i.pravatar.cc/150?u=aden3',
    likes: [
      'Buffalo Wings', 'Sushi', 'Protein Shakes', 'Tacos', 'Pizza',
      'Burgers', 'Fries', 'Fried Rice', 'Steak', 'Chicken Parm'
    ],
    dislikes: [
      'Steamed Broccoli', 'Mushrooms', 'Tomato Slices', 'Zucchini', 'Brussels Sprouts',
      'Cabbage', 'Cauliflower', 'Sweet Potatoes', 'Lentils', 'Beans'
    ],
    dietary: ['Caloric Surplus'],
    allergies: ['None'],
    notes: 'Honesti Context (10-Year Log): Aden has outgrown his "mac & cheese only" phase from 2016! He is now playing varsity football and requires massive caloric surplus meals. He still hates the texture of raw tomatoes and cooked mushrooms. Automatically scale his portion sizes up by 1.5x for all dinner recipes.'
  }
];

// Helper Component for HCI-friendly array inputs (press Enter to add tags)
const TagInput = ({ tags, setTags, placeholder, colorTheme }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Determine colors based on theme
  let pillBg, pillText, pillBorder, focusRing;
  if (colorTheme === 'green') {
    pillBg = 'bg-[#042f1d]'; pillText = 'text-emerald-300'; pillBorder = 'border-emerald-500/40'; focusRing = 'focus-within:border-emerald-500/50';
  } else if (colorTheme === 'red') {
    pillBg = 'bg-[#3f0f14]'; pillText = 'text-red-300'; pillBorder = 'border-red-500/40'; focusRing = 'focus-within:border-red-500/50';
  } else {
    pillBg = 'bg-blue-900/30'; pillText = 'text-blue-300'; pillBorder = 'border-blue-500/30'; focusRing = 'focus-within:border-[#0077ff]/50';
  }

  return (
    <div className={`w-full bg-black/20 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 transition-colors ${focusRing}`}>
      <AnimatePresence>
        {tags.map((tag, index) => (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key={tag} 
            className={`flex items-center gap-1.5 text-[10px] ${pillBg} ${pillText} border ${pillBorder} px-2 py-1 rounded-md font-bold shadow-sm`}
          >
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="hover:text-white transition-colors p-0.5 rounded-full hover:bg-black/20">
              <FiX size={10} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : "Add more (press Enter)..."}
        className="flex-1 min-w-[130px] bg-transparent text-[11px] text-white focus:outline-none placeholder:text-gray-500 py-1"
      />
    </div>
  );
};

const Household = () => {
  const [personas, setPersonas] = useState(initialPersonas);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const openMenuRef = useRef(null);

  // Close dropdown menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuRef.current && !openMenuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDrawer = (persona = null) => {
    if (persona) {
      setSelectedPersona(persona);
      setEditForm({ ...persona });
      setIsAdding(false);
      setIsEditing(false);
    } else {
      const newPersona = {
        id: Date.now(),
        name: '',
        role: '',
        email: '',
        avatar: 'https://i.pravatar.cc/150?u=new' + Date.now(),
        likes: [],
        dislikes: [],
        dietary: [],
        allergies: [],
        notes: ''
      };
      setSelectedPersona(newPersona);
      setEditForm(newPersona);
      setIsAdding(true);
      setIsEditing(true);
    }
    setMenuOpenId(null);
  };

  const closeDrawer = () => {
    setSelectedPersona(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editForm.name) {
      toast.error("Persona name is required.", {
        style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return;
    }

    const loadToast = toast.loading(isAdding ? "Seeding new AI Persona..." : "Synchronizing AI Context...", {
      style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });

    setTimeout(() => {
      if (isAdding) {
        setPersonas([editForm, ...personas]);
      } else {
        setPersonas(personas.map(p => p.id === editForm.id ? editForm : p));
      }
      
      setSelectedPersona(editForm);
      setIsEditing(false);
      setIsAdding(false);
      
      toast.success(isAdding ? "New Persona Integrated!" : "AI Context Updated!", {
        id: loadToast,
        style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }, 1200);
  };

  const handleDelete = (id) => {
    setPersonas(personas.filter(p => p.id !== id));
    toast.success("Persona purged from AI memory.", {
      style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    setMenuOpenId(null);
  };

  return (
    <div className="h-full w-full text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* Global Blurred Background Image from Home screen */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-50 blur-[3px] scale-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/70 backdrop-blur-md pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-2 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-3 md:mb-8 border-b border-white/10 pb-2.5 md:pb-5 gap-2 md:gap-4">
          <div>
            <h1 className="text-[18px] md:text-[28px] font-bold tracking-tight mb-0.5 md:mb-1.5 drop-shadow-md">My Household</h1>
            <p className="text-gray-300 text-[9px] md:text-[12px] font-medium drop-shadow-sm">Manage culinary personas, preferences, and 10 years of dietary context.</p>
          </div>
          <button 
            onClick={() => openDrawer()}
            className="cursor-pointer bg-[#0077ff] hover:bg-blue-600 text-white px-2.5 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-[12px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all flex items-center gap-1.5 shrink-0 active:scale-95 border border-blue-400/30"
          >
            <FiPlus size={12} className="md:w-3.5 md:h-3.5" /> Add Member
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
          {personas.map((persona) => (
            <motion.div 
              key={persona.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-[#0f1523]/60 backdrop-blur-2xl border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-xl relative overflow-visible group flex flex-col h-full transition-all"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-start mb-2.5 md:mb-4">
                <div className="flex gap-2 md:gap-3 items-center">
                  <div className="relative">
                    <img src={persona.avatar} alt={persona.name} className="w-9 h-9 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/10 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 bg-[#0b0f19] rounded-full p-0.5 md:p-1 border border-white/10 text-gray-400">
                      <FiUser size={8} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[13px] md:text-base font-bold tracking-tight">{persona.name}</h3>
                    <p className="text-[8px] md:text-[9px] text-[#00E5FF] uppercase tracking-widest font-semibold">{persona.role}</p>
                  </div>
                </div>
                
                {/* 3 Dots Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === persona.id ? null : persona.id); }}
                    className="cursor-pointer text-gray-400 hover:text-white transition-colors p-1 md:p-1.5 bg-white/5 rounded-md group-hover:bg-[#0077ff]/20 group-hover:text-[#0077ff]"
                  >
                    <FiMoreHorizontal size={14} className="md:w-4 md:h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {menuOpenId === persona.id && (
                      <motion.div 
                        ref={openMenuRef}
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-36 bg-[#0f1523] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                      >
                        <button 
                          onClick={() => openDrawer(persona)}
                          className="cursor-pointer w-full text-left px-4 py-2.5 text-[11px] font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <FiEdit2 size={12}/> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(persona.id)}
                          className="cursor-pointer w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                          <FiTrash2 size={12}/> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Likes / Dislikes Preview */}
              <div className="flex-1 space-y-2 md:space-y-3 mb-3 md:mb-5">
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 mb-1 md:mb-1.5 font-bold uppercase tracking-wide">
                    <FiHeart className="text-emerald-400 w-3 h-3 md:w-4 md:h-4" /> Likes
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {persona.likes.slice(0, 4).map((like, i) => (
                      <span key={i} className="cursor-pointer text-[8px] md:text-[9px] bg-[#042f1d] hover:bg-[#064e3b] text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md font-bold shadow-sm transition-colors">
                        {like}
                      </span>
                    ))}
                    {persona.likes.length > 4 && (
                      <span className="cursor-pointer text-[8px] md:text-[9px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md font-bold shadow-sm transition-colors">
                        +{persona.likes.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 mb-1 md:mb-1.5 font-bold uppercase tracking-wide">
                    <FiThumbsDown className="text-red-400 w-3 h-3 md:w-4 md:h-4" /> Dislikes
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {persona.dislikes.slice(0, 4).map((dislike, i) => (
                      <span key={i} className="cursor-pointer text-[8px] md:text-[9px] bg-[#3f0f14] hover:bg-[#5a161c] text-red-300 border border-red-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md font-bold shadow-sm transition-colors">
                        {dislike}
                      </span>
                    ))}
                    {persona.dislikes.length > 4 && (
                      <span className="cursor-pointer text-[8px] md:text-[9px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md font-bold shadow-sm transition-colors">
                        +{persona.dislikes.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => openDrawer(persona)}
                className="cursor-pointer w-full py-1.5 md:py-2 bg-white/5 hover:bg-white/10 text-[10px] md:text-[11px] font-bold text-gray-300 rounded-md md:rounded-lg transition-colors border border-white/5 group-hover:bg-[#0077ff] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(0,119,255,0.3)]"
              >
                View Full Persona
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Drawer Overlay */}
      <AnimatePresence>
        {selectedPersona && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 cursor-pointer"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[360px] md:w-[420px] max-w-full bg-[#0b0f19]/95 backdrop-blur-3xl border-l border-white/10 z-50 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-start bg-white/5 shrink-0 shadow-sm relative">
                <div className="flex items-center gap-3 w-full pr-16">
                  {isEditing ? (
                    <div className="relative group cursor-pointer shrink-0">
                      <img src={editForm.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-white/20 shadow-lg brightness-50" />
                      <FiCamera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={20} />
                    </div>
                  ) : (
                    <img src={selectedPersona.avatar} alt={selectedPersona.name} className="w-14 h-14 rounded-full object-cover border border-white/20 shadow-lg shrink-0" />
                  )}
                  
                  <div className="flex-1 w-full min-w-0">
                    {isEditing ? (
                      <>
                        <input 
                          type="text" 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="Persona Name"
                          className="w-full bg-black/20 border border-white/10 rounded-md px-2 py-1 text-lg font-bold text-white focus:border-[#0077ff] focus:outline-none mb-1"
                        />
                        <input 
                          type="text" 
                          value={editForm.role} 
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          placeholder="Role (e.g. Adult)"
                          className="w-full bg-black/20 border border-white/10 rounded-md px-2 py-1 text-[10px] text-[#00E5FF] uppercase tracking-widest font-semibold focus:border-[#0077ff] focus:outline-none mb-1"
                        />
                        <input 
                          type="email" 
                          value={editForm.email || ''} 
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          placeholder="Email Address"
                          className="w-full bg-black/20 border border-white/10 rounded-md px-2 py-1 text-[11px] text-gray-300 font-medium focus:border-[#0077ff] focus:outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold tracking-tight text-white leading-none truncate">{selectedPersona.name}</h2>
                        <p className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-semibold mt-1.5 truncate">{selectedPersona.role}</p>
                        {selectedPersona.email && (
                          <div className="flex items-center gap-1.5 mt-1.5 w-full">
                            <p className="text-[11px] text-gray-400 truncate">{selectedPersona.email}</p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(selectedPersona.email);
                                toast.success("Email copied to clipboard!", { style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
                              }}
                              className="text-gray-500 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-md cursor-pointer shrink-0"
                              title="Copy Email"
                            >
                              <FiCopy size={10} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="absolute top-5 right-5 flex gap-1.5">
                  {!isAdding && !isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  )}
                  <button 
                    onClick={closeDrawer} 
                    className="cursor-pointer p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable Drawer Content */}
              <div className="p-5 space-y-6 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                
                {/* Notes/Bio */}
                <section>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                    AI Context Notes (10-Yr Log)
                  </h4>
                  {isEditing ? (
                    <textarea 
                      value={editForm.notes}
                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      placeholder="Add rich context notes here..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-[12px] text-white focus:border-[#0077ff] focus:outline-none min-h-[100px] resize-none custom-scrollbar"
                    />
                  ) : (
                    <div className="text-[12px] text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner min-h-[60px]">
                      {selectedPersona.notes || <span className="text-gray-500 italic">No notes provided...</span>}
                    </div>
                  )}
                </section>

                <div className="grid grid-cols-2 gap-4">
                  {/* Dietary */}
                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dietary</h4>
                    {isEditing ? (
                      <TagInput 
                        tags={editForm.dietary}
                        setTags={(newTags) => setEditForm({ ...editForm, dietary: newTags })}
                        placeholder="e.g. Keto..."
                        colorTheme="blue"
                      />
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {selectedPersona.dietary.length > 0 ? selectedPersona.dietary.map((d, i) => (
                          <div key={i} className="cursor-pointer text-[11px] font-bold text-blue-300 bg-blue-900/30 border border-blue-500/30 px-2 py-1.5 rounded-lg text-center shadow-sm transition-colors">
                            {d}
                          </div>
                        )) : <span className="text-[11px] text-gray-500 italic px-1">None</span>}
                      </div>
                    )}
                  </section>

                  {/* Allergies */}
                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Allergies</h4>
                    {isEditing ? (
                      <TagInput 
                        tags={editForm.allergies}
                        setTags={(newTags) => setEditForm({ ...editForm, allergies: newTags })}
                        placeholder="e.g. Peanuts..."
                        colorTheme="red"
                      />
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {selectedPersona.allergies.length > 0 ? selectedPersona.allergies.map((a, i) => (
                          <div key={i} className={`cursor-pointer text-[11px] font-bold px-2 py-1.5 rounded-lg text-center shadow-sm transition-colors ${a === 'None' ? 'text-gray-400 bg-white/5 border border-white/10' : 'text-red-300 bg-[#3f0f14] border border-red-500/30'}`}>
                            {a}
                          </div>
                        )) : <span className="text-[11px] text-gray-500 italic px-1">None</span>}
                      </div>
                    )}
                  </section>
                </div>

                {/* Likes */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FiHeart className="text-emerald-400" size={12} />
                    <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Loves & Craves</h4>
                  </div>
                  {isEditing ? (
                    <TagInput 
                      tags={editForm.likes}
                      setTags={(newTags) => setEditForm({ ...editForm, likes: newTags })}
                      placeholder="Add craving..."
                      colorTheme="green"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPersona.likes.length > 0 ? selectedPersona.likes.map((like, i) => (
                        <span key={i} className="cursor-pointer text-[10px] bg-[#042f1d] hover:bg-[#064e3b] text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg font-bold shadow-sm transition-colors">
                          {like}
                        </span>
                      )) : <span className="text-[11px] text-gray-500 italic">None specified</span>}
                    </div>
                  )}
                </section>

                {/* Dislikes */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FiThumbsDown className="text-red-400" size={12} />
                    <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Dislikes & Avoids</h4>
                  </div>
                  {isEditing ? (
                    <TagInput 
                      tags={editForm.dislikes}
                      setTags={(newTags) => setEditForm({ ...editForm, dislikes: newTags })}
                      placeholder="Add dislike..."
                      colorTheme="red"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPersona.dislikes.length > 0 ? selectedPersona.dislikes.map((dislike, i) => (
                        <span key={i} className="cursor-pointer text-[10px] bg-[#3f0f14] hover:bg-[#5a161c] text-red-300 border border-red-500/40 px-2.5 py-1.5 rounded-lg font-bold shadow-sm transition-colors">
                          {dislike}
                        </span>
                      )) : <span className="text-[11px] text-gray-500 italic">None specified</span>}
                    </div>
                  )}
                </section>

              </div>
              
              {/* Drawer Footer (Only visible when editing/adding) */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 border-t border-white/10 bg-white/5 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] overflow-hidden"
                  >
                    <button 
                      onClick={handleSave}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 bg-[#0077ff] hover:bg-blue-600 text-[13px] font-bold text-white rounded-lg shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-95"
                    >
                      <FiSave /> {isAdding ? 'Save New Member' : 'Synchronize AI Context'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Household;
