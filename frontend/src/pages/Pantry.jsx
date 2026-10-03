import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMoreHorizontal, FiEdit2, FiTrash2, FiPlus, FiCamera, FiAlertCircle, FiCheckCircle, FiX, FiSave, FiUploadCloud, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialPantry = [
  { id: 1, name: 'Extra Virgin Olive Oil', category: 'Dry Goods', quantityVal: 0.25, quantityUnit: 'Bottle', status: 'Low Stock', lastUpdated: '2 days ago' },
  { id: 2, name: 'Whole Milk', category: 'Dairy', quantityVal: 0.5, quantityUnit: 'Gallon', status: 'Expiring Soon', lastUpdated: 'Today' },
  { id: 3, name: 'Eggs (Free Range)', category: 'Dairy', quantityVal: 18, quantityUnit: 'Count', status: 'In Stock', lastUpdated: 'Yesterday' },
  { id: 4, name: 'Chicken Breast', category: 'Meat', quantityVal: 0, quantityUnit: 'lbs', status: 'Out of Stock', lastUpdated: '3 days ago' },
  { id: 5, name: 'Flat-Leaf Parsley', category: 'Produce', quantityVal: 1, quantityUnit: 'Bunch', status: 'In Stock', lastUpdated: 'Yesterday' },
  { id: 6, name: 'Himalayan Pink Salt', category: 'Spices', quantityVal: 1, quantityUnit: 'Jar', status: 'In Stock', lastUpdated: '1 month ago' },
  { id: 7, name: 'Garlic', category: 'Produce', quantityVal: 2, quantityUnit: 'Bulbs', status: 'Low Stock', lastUpdated: '1 week ago' },
  { id: 8, name: 'Cashew Cheese', category: 'Dairy', quantityVal: 1, quantityUnit: 'Tub', status: 'In Stock', lastUpdated: '2 days ago' },
  { id: 9, name: 'Ghee', category: 'Dry Goods', quantityVal: 1, quantityUnit: 'Jar', status: 'In Stock', lastUpdated: '1 week ago' },
  { id: 10, name: 'Salmon Fillets', category: 'Meat', quantityVal: 1, quantityUnit: 'lbs', status: 'Low Stock', lastUpdated: 'Today' },
];

const units = ['lbs', 'oz', 'kg', 'g', 'Count', 'Gallon', 'Bottle', 'Jar', 'Tub', 'Bunch', 'Bulbs', 'Pack'];

const Pantry = () => {
  const [items, setItems] = useState(initialPantry);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Items');
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Scan Receipt Demo State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  // Close menus on click outside
  const openMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuRef.current && !openMenuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filters = ['All Items', 'Low Stock', 'Out of Stock', 'Expiring Soon', 'Produce', 'Meat', 'Dairy', 'Spices', 'Dry Goods'];

  const filteredItems = items.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'Low Stock' && item.status !== 'Low Stock') return false;
    if (activeFilter === 'Out of Stock' && item.status !== 'Out of Stock') return false;
    if (activeFilter === 'Expiring Soon' && item.status !== 'Expiring Soon') return false;
    if (['Produce', 'Meat', 'Dairy', 'Spices', 'Dry Goods'].includes(activeFilter) && item.category !== activeFilter) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Low Stock': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Expiring Soon': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Out of Stock': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter(i => i.id !== id));
    toast.success("Item removed from pantry.", {
      style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
    setMenuOpenId(null);
  };

  const openAddDrawer = () => {
    setEditForm({
      id: Date.now(),
      name: '',
      category: 'Produce',
      quantityVal: 1,
      quantityUnit: 'Count',
      status: 'In Stock',
      lastUpdated: 'Just now'
    });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditForm({ ...item });
    setIsEditing(true);
    setIsDrawerOpen(true);
    setMenuOpenId(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditForm(null);
  };

  const handleSave = () => {
    if (!editForm.name || editForm.quantityVal === '') {
      toast.error("Name and Quantity are required.");
      return;
    }

    if (isEditing) {
      setItems(items.map(i => i.id === editForm.id ? editForm : i));
      toast.success("Item updated successfully.");
    } else {
      setItems([editForm, ...items]);
      toast.success("Item added to Pantry.");
    }
    closeDrawer();
  };

  // Demo Scan Receipt Flow
  const handleScanClick = () => {
    setIsScanning(true);
    setScanStep(0);
    
    // Simulate flow
    setTimeout(() => setScanStep(1), 1500); // "Uploading..."
    setTimeout(() => setScanStep(2), 3500); // "AI Extracting Items..."
    setTimeout(() => {
      const scannedItems = [
        { id: Date.now()+1, name: 'Avocados', category: 'Produce', quantityVal: 4, quantityUnit: 'Count', status: 'In Stock', lastUpdated: 'Just now' },
        { id: Date.now()+2, name: 'Almond Milk', category: 'Dairy', quantityVal: 1, quantityUnit: 'Carton', status: 'In Stock', lastUpdated: 'Just now' }
      ];
      setItems(prev => [...scannedItems, ...prev]);
      setIsScanning(false);
      toast.success("Extracted 2 items from receipt!", {
        style: { background: '#0f1523', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }, 5500); // "Done"
  };

  return (
    <div className="h-full w-full text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* Global Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-50 blur-[3px] scale-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/70 backdrop-blur-md pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 md:p-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 md:mb-8 border-b border-white/10 pb-4 md:pb-5 gap-4 md:gap-5">
          <div className="flex-1">
            <h1 className="text-xl md:text-[28px] font-bold tracking-tight mb-0.5 md:mb-5 drop-shadow-md">Smart Pantry</h1>
            <p className="text-gray-300 text-base md:text-base font-medium drop-shadow-sm">Real-time inventory synced with your household diet and recipes.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-4 md:gap-5 shrink-0">
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} className="md:w-5 md:h-5" />
              <input 
                type="text" 
                placeholder="Search ingredients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f1523]/80 backdrop-blur-md border border-white/10 rounded-md md:rounded-lg pl-7 md:pl-9 pr-3 md:pr-4 py-2 md:py-2.5 text-[15px] md:text-base text-white focus:border-[#0077ff] focus:outline-none transition-colors shadow-inner"
              />
            </div>
            
            <button 
              onClick={handleScanClick}
              className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 md:px-4 py-2 md:py-2 rounded-md md:rounded-lg text-[15px] md:text-base font-bold transition-all flex items-center gap-3 active:scale-95 border border-white/10"
            >
              <FiCamera size={12} className="md:w-5 md:h-5" /> <span className="hidden sm:inline">Scan Receipt</span><span className="sm:hidden">Scan</span>
            </button>
            <button 
              onClick={openAddDrawer}
              className="cursor-pointer bg-[#0077ff] hover:bg-blue-600 text-white px-4 md:px-4 py-2 md:py-2 rounded-md md:rounded-lg text-[15px] md:text-base font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all flex items-center gap-3 active:scale-95 border border-blue-400/30"
            >
              <FiPlus size={12} className="md:w-5 md:h-5" /> Add Item
            </button>
          </div>
        </div>

        {/* Filters/Pills */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto custom-scrollbar pb-3 md:pb-2 mb-4 md:mb-6">
          {filters.map((filter, i) => (
            <button 
              key={i} 
              onClick={() => setActiveFilter(filter)}
              className={`cursor-pointer whitespace-nowrap px-5 md:px-4 py-2 md:py-2 rounded-md md:rounded-lg text-base md:text-base font-bold transition-all border ${activeFilter === filter ? 'bg-[#0077ff] border-[#0077ff] text-white shadow-[0_0_15px_rgba(0,119,255,0.3)]' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Pantry Grid (Text Only, Clean Layout) */}
        <AnimatePresence>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredItems.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4, borderColor: 'rgba(0, 119, 255, 0.3)' }}
                className="bg-[#0f1523]/60 backdrop-blur-2xl border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 shadow-xl group flex flex-col transition-all relative cursor-pointer"
                onClick={() => openEditDrawer(item)}
              >
                
                {/* Header Row: Title & 3 Dots Menu */}
                <div className="flex justify-between items-start mb-2 md:mb-4">
                  <div className="pr-2 md:pr-4">
                    <h3 className="text-xs md:text-sm font-bold tracking-tight text-white mb-2 md:mb-5 leading-tight group-hover:text-[#0077ff] transition-colors">{item.name}</h3>
                    {/* Render Category as a Tag/Pill */}
                    <span className="inline-block px-2 md:px-4 py-0.5 bg-[#0077ff]/10 border border-[#0077ff]/30 rounded text-[9px] md:text-xs font-bold text-[#0077ff] uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                      className="cursor-pointer p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      <FiMoreHorizontal size={14} />
                    </button>
                    <AnimatePresence>
                      {menuOpenId === item.id && (
                        <motion.div 
                          ref={openMenuRef}
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-full mt-1 w-32 bg-[#0f1523] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-40"
                        >
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditDrawer(item); }}
                            className="cursor-pointer w-full text-left px-5 py-2 text-base font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                          >
                            <FiEdit2 size={12}/> Edit Item
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="cursor-pointer w-full text-left px-5 py-2 text-base font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                          >
                            <FiTrash2 size={12}/> Remove
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Row: Quantity & Status */}
                <div className="mt-auto flex justify-between items-end">
                  <div>
                    <p className="text-[15px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Quantity</p>
                    <p className="text-[15px] font-bold text-white">{item.quantityVal} {item.quantityUnit}</p>
                  </div>
                  
                  <div className={`px-4 py-2 border rounded-md text-base font-bold uppercase tracking-wider flex items-center gap-1 ${getStatusColor(item.status)}`}>
                    {item.status === 'In Stock' && <FiCheckCircle size={10} />}
                    {(item.status === 'Low Stock' || item.status === 'Expiring Soon') && <FiAlertCircle size={10} />}
                    {item.status === 'Out of Stock' && <FiAlertCircle size={10} />}
                    {item.status}
                  </div>
                </div>
                
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm font-bold">No ingredients found matching your search.</p>
          </div>
        )}
      </div>

      {/* CRUD Drawer (Add/Edit Item) */}
      <AnimatePresence>
        {isDrawerOpen && editForm && (
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
              className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-[#0b0f19]/95 backdrop-blur-3xl border-l border-white/10 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0f1523]/80">
                <h2 className="text-lg font-bold text-white">{isEditing ? 'Edit Ingredient' : 'Add to Pantry'}</h2>
                <button onClick={closeDrawer} className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer">
                  <FiX size={16} />
                </button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                
                <div>
                  <label className="block text-[15px] font-bold text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="e.g. Avocado"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-5 py-2 text-[15px] font-bold text-white focus:border-[#0077ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-5 py-2 text-base font-bold text-white focus:outline-none cursor-pointer focus:border-[#0077ff]"
                  >
                    {filters.filter(f => f !== 'All Items' && f !== 'Low Stock' && f !== 'Out of Stock' && f !== 'Expiring Soon').map(cat => (
                      <option key={cat} value={cat} className="bg-[#0f1523] text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[15px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={editForm.quantityVal}
                      onChange={(e) => setEditForm({...editForm, quantityVal: e.target.value})}
                      placeholder="e.g. 2"
                      className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-5 py-2 text-base font-bold text-white focus:border-[#0077ff] focus:outline-none"
                      min="0"
                      step="any"
                    />
                    <select 
                      value={editForm.quantityUnit}
                      onChange={(e) => setEditForm({...editForm, quantityUnit: e.target.value})}
                      className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-5 py-2 text-base font-bold text-white focus:outline-none cursor-pointer focus:border-[#0077ff]"
                    >
                      {units.map(u => (
                        <option key={u} value={u} className="bg-[#0f1523] text-white">{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-bold text-gray-400 uppercase tracking-widest mb-2">Inventory Status</label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-5 py-2 text-base font-bold text-white focus:outline-none cursor-pointer focus:border-[#0077ff]"
                  >
                    <option value="In Stock" className="bg-[#0f1523] text-white">In Stock</option>
                    <option value="Low Stock" className="bg-[#0f1523] text-white">Low Stock</option>
                    <option value="Expiring Soon" className="bg-[#0f1523] text-white">Expiring Soon</option>
                    <option value="Out of Stock" className="bg-[#0f1523] text-white">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t border-white/10 bg-black/20">
                <button 
                  onClick={handleSave}
                  className="cursor-pointer w-full py-3 bg-[#0077ff] hover:bg-blue-600 text-[15px] font-bold text-white rounded-xl shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all flex items-center justify-center gap-4 active:scale-95"
                >
                  <FiSave size={16} /> Save to Pantry
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Scan Receipt Demo Modal */}
      <AnimatePresence>
        {isScanning && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0b0f19] border border-[#0077ff]/40 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,119,255,0.2)] flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Scanning Laser Animation */}
                {scanStep < 2 && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] z-10 opacity-50"
                  />
                )}

                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
                  {scanStep === 0 ? <FiCamera size={32} className="text-blue-400" /> : 
                   scanStep === 1 ? <FiUploadCloud size={32} className="text-[#00E5FF] animate-pulse" /> : 
                   <FiCheckCircle size={32} className="text-emerald-400" />}
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  {scanStep === 0 ? 'Analyzing Camera Feed...' : 
                   scanStep === 1 ? 'Honesti AI Extracting Data...' : 
                   'Receipt Processed!'}
                </h2>
                
                <p className="text-base font-medium text-gray-400 max-w-xs leading-relaxed">
                  {scanStep === 0 ? 'Hold your grocery receipt steady in frame.' : 
                   scanStep === 1 ? 'Cross-referencing items with known dietary preferences...' : 
                   'Items successfully mapped to your pantry inventory.'}
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Pantry;
