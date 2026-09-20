import React from 'react';
import { FiChevronLeft, FiHelpCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Step2Household = ({ formData, updateData, nextStep, prevStep }) => {
  const dietaryOptions = [
    { id: 'kid-friendly', label: 'Kid-Friendly', color: 'bg-green-900/30 text-green-400 border-green-500/30' },
    { id: 'gluten-free', label: 'Gluten-Free', color: 'bg-orange-900/30 text-orange-400 border-orange-500/30' },
    { id: 'vegetarian', label: 'Vegetarian', color: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' },
    { id: 'budget-conscious', label: 'Budget-Conscious', color: 'bg-blue-900/30 text-blue-400 border-blue-500/30' },
    { id: 'high-protein', label: 'High-Protein', color: 'bg-purple-900/30 text-purple-400 border-purple-500/30' },
  ];

  const toggleDietary = (id) => {
    const current = formData.dietary || [];
    const updated = current.includes(id) 
      ? current.filter(item => item !== id)
      : [...current, id];
    updateData({ dietary: updated });
  };

  const handleNext = () => {
    if (!formData.householdName) {
      toast.error("Please provide a household name.");
      return;
    }
    if ((formData.adults || 0) === 0 && (formData.kids || 0) === 0) {
      toast.error("Household must have at least 1 member.");
      return;
    }
    nextStep();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-[28px] leading-tight font-bold text-white mb-2 tracking-tight">Let's set up your household profile</h2>
      <p className="text-gray-400 text-[13px] mb-6 leading-relaxed">Honesti uses this to learn your unique preferences over time.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-[13px] font-bold text-gray-300 mb-1.5">Household Name</label>
          <input 
            type="text" 
            placeholder="e.g., The Maya Household" 
            className="w-full bg-[#0b0f19]/50 border border-white/10 rounded-lg px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#0077ff] focus:ring-1 focus:ring-[#0077ff] transition-all placeholder:text-gray-500"
            value={formData.householdName || ''}
            onChange={(e) => updateData({ householdName: e.target.value })}
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <label className="block text-[13px] font-bold text-gray-300">Household Size</label>
            <FiHelpCircle className="text-gray-500 text-[11px] cursor-help" />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Adults Stepper */}
            <div className="flex items-center">
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#0b0f19]/50 shadow-sm mr-2">
                <button 
                  onClick={() => updateData({ adults: Math.max(0, (formData.adults || 0) - 1) })}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-r border-white/10 cursor-pointer"
                >−</button>
                <div className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-white/5">{formData.adults || 0}</div>
                <button 
                  onClick={() => updateData({ adults: (formData.adults || 0) + 1 })}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-l border-white/10 cursor-pointer"
                >+</button>
              </div>
              <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1"><span className="text-sm opacity-80">🧑‍🤝‍🧑</span> Adults</span>
            </div>

            {/* Kids Stepper */}
            <div className="flex items-center">
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#0b0f19]/50 shadow-sm mr-2">
                <button 
                  onClick={() => updateData({ kids: Math.max(0, (formData.kids || 0) - 1) })}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-r border-white/10 cursor-pointer"
                >−</button>
                <div className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-white/5">{formData.kids || 0}</div>
                <button 
                  onClick={() => updateData({ kids: (formData.kids || 0) + 1 })}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-l border-white/10 cursor-pointer"
                >+</button>
              </div>
              <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1"><span className="text-sm opacity-80">👶</span> Kids</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="block text-[13px] font-bold text-gray-300">Dietary Needs & Constraints</label>
            <FiHelpCircle className="text-gray-500 text-[11px] cursor-help" />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3.5">
            {dietaryOptions.map(opt => {
              const isSelected = (formData.dietary || []).includes(opt.id);
              const baseClass = isSelected ? opt.color : 'bg-[#0b0f19]/50 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white';
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleDietary(opt.id)}
                  className={`border rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all shadow-sm cursor-pointer ${baseClass}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed bg-[#0b0f19]/30 p-2.5 rounded-lg border border-white/5">
            <FiHelpCircle className="text-gray-500 mt-0.5 shrink-0 text-sm" />
            <p>Honesti adapts to these constraints over time. Based on your household size, recipe portions will also automatically adjust.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-8">
        <button 
          onClick={handleNext}
          className="flex-1 bg-[#0077ff] hover:bg-blue-600 text-white rounded-lg py-3 text-[14px] font-bold shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Save & Continue <span className="font-normal opacity-80 text-[11px] tracking-wide ml-1">TO NEXT STEP</span>
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

export default Step2Household;
