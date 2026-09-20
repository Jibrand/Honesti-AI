import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Step3Kitchen = ({ formData, updateData, nextStep, prevStep }) => {
  const pantryItems = [
    { id: 'olive-oil', label: 'Olive Oil', icon: '🫒' },
    { id: 'garlic', label: 'Garlic', icon: '🧄' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
    { id: 'rice', label: 'Rice', icon: '🍚' },
    { id: 'pasta', label: 'Pasta', icon: '🍝' },
    { id: 'salt-pepper', label: 'Salt & Pepper', icon: '🧂' },
  ];

  const equipmentItems = [
    { id: 'air-fryer', label: 'Air Fryer', icon: '🌬️' }, 
    { id: 'oven', label: 'Oven', icon: '🔥' },
    { id: 'instant-pot', label: 'Instant Pot', icon: '🍲' },
    { id: 'blender', label: 'Blender', icon: '🥤' },
  ];

  const toggleArrayItem = (field, id) => {
    const current = formData[field] || [];
    const updated = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    updateData({ [field]: updated });
  };

  const handleNext = () => {
    if ((formData.pantry || []).length === 0 && (formData.equipment || []).length === 0) {
      toast.error("Please select at least one pantry item or equipment.");
      return;
    }
    toast.loading("Finalizing your Honesti profile...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Welcome to HonestChoice AI!");
      nextStep();
    }, 1500);
  };

  const ToggleCard = ({ item, field }) => {
    const isSelected = (formData[field] || []).includes(item.id);
    return (
      <div 
        onClick={() => toggleArrayItem(field, item.id)}
        className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[#0077ff]/10 border-[#0077ff]/40 shadow-[0_0_15px_rgba(0,119,255,0.1)]' : 'bg-[#0b0f19]/50 border-white/10 hover:border-white/20 hover:bg-[#0b0f19]/80 shadow-sm'}`}
      >
        <div className="absolute top-1.5 right-1.5">
          <div className={`w-5 h-3 rounded-full flex items-center p-[2px] transition-colors ${isSelected ? 'bg-[#0077ff]' : 'bg-gray-600'}`}>
            <div className={`w-2 h-2 bg-white rounded-full shadow-sm transition-transform ${isSelected ? 'translate-x-2' : 'translate-x-0'}`}></div>
          </div>
        </div>
        <span className="text-xl mb-1 mt-1 drop-shadow-md">{item.icon}</span>
        <span className="text-[9px] font-bold text-gray-300 tracking-tight">{item.label}</span>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-[28px] leading-tight font-bold text-white mb-2 tracking-tight">A quick kitchen check</h2>
      <p className="text-gray-400 text-[13px] mb-6 leading-relaxed">Tell Honesti what you have on hand so she can suggest recipes instantly.</p>

      <div className="space-y-6">
        
        <div>
          <label className="block text-[13px] font-bold text-gray-300 mb-3">Quick Pantry Snap or Select</label>
          <div className="grid grid-cols-3 gap-2">
            {pantryItems.map(item => <ToggleCard key={item.id} item={item} field="pantry" />)}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-300 mb-3">Primary Kitchen Equipment</label>
          <div className="grid grid-cols-4 gap-2">
            {equipmentItems.map(item => <ToggleCard key={item.id} item={item} field="equipment" />)}
          </div>
        </div>

      </div>

      <div className="flex gap-2 mt-8">
        <button 
          onClick={handleNext}
          className="flex-[2] bg-[#0077ff] hover:bg-blue-600 text-white rounded-lg py-3 text-[14px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-[0.98] cursor-pointer"
        >
          Let's Cook
        </button>
        <button 
          onClick={prevStep}
          className="w-12 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors shadow-sm cursor-pointer"
        >
          <FiChevronLeft className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Step3Kitchen;
