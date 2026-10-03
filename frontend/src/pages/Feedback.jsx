import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiClock, FiCheckCircle, FiChevronRight, FiX } from 'react-icons/fi';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const mockData = [
      {
        id: 'mock-1',
        recipeName: 'Hidden-Veggie Mac & Cheese',
        date: 'Yesterday, 6:30 PM',
        status: 'Follow-up Active',
        personas: [
          { name: 'Aden', status: 'Submitted', rating: '😍', note: 'I didn\'t even taste the cauliflower.' },
          { name: 'Maya', status: 'Pending', rating: null, note: '' },
          { name: 'David', status: 'Submitted', rating: '👍', note: 'Pretty good for a healthy version.' }
        ]
      },
      {
        id: 'mock-2',
        recipeName: 'Spicy Thai Peanut Noodles',
        date: 'Sep 18, 7:15 PM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '😍', note: 'Loved the sunflower butter substitution.' },
          { name: 'David', status: 'Submitted', rating: '😐', note: 'Needs way more chicken to hit my macros.' },
          { name: 'Aden', status: 'Submitted', rating: '👍', note: 'Spicy but good.' }
        ]
      },
      {
        id: 'mock-3',
        recipeName: 'Grilled Lemon Herb Salmon',
        date: 'Sep 15, 6:45 PM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '😍', note: 'Perfectly cooked, felt so light.' },
          { name: 'David', status: 'Submitted', rating: '😍', note: 'Great protein punch, clean eating.' },
          { name: 'Aden', status: 'Submitted', rating: '🤢', note: 'I still hate fish. Took one bite.' }
        ]
      },
      {
        id: 'mock-4',
        recipeName: 'Smoked Brisket Tacos',
        date: 'Sep 10, 7:30 PM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '👍', note: 'A bit heavy for a weekday, but tasty.' },
          { name: 'David', status: 'Submitted', rating: '😍', note: 'Incredible smoke ring, exactly what I craved.' },
          { name: 'Aden', status: 'Submitted', rating: '😍', note: 'Ate 5 of them. Epic dinner.' }
        ]
      },
      {
        id: 'mock-5',
        recipeName: 'Matcha Protein Pancakes',
        date: 'Sep 08, 9:00 AM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '😍', note: 'Best Sunday morning breakfast.' },
          { name: 'David', status: 'Submitted', rating: '🤢', note: 'Taste like grass. Hard pass. Sticking to bacon.' },
          { name: 'Aden', status: 'Submitted', rating: '😐', note: 'Weird color but they tasted okay with syrup.' }
        ]
      },
      {
        id: 'mock-6',
        recipeName: 'High-Protein Chicken Quinoa Bowl',
        date: 'Sep 05, 6:15 PM',
        status: 'Follow-up Active',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '👍', note: 'Good, but could use more dressing.' },
          { name: 'David', status: 'Submitted', rating: '😍', note: 'Perfect post-run meal. Hit all macros.' },
          { name: 'Aden', status: 'Pending', rating: null, note: '' }
        ]
      },
      {
        id: 'mock-7',
        recipeName: 'Classic Beef Chili',
        date: 'Sep 02, 7:00 PM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '😐', note: 'A little too heavy for a weeknight.' },
          { name: 'David', status: 'Submitted', rating: '😍', note: 'Classic comfort food. Love it.' },
          { name: 'Aden', status: 'Submitted', rating: '😍', note: 'Awesome with extra cheese on top.' }
        ]
      },
      {
        id: 'mock-8',
        recipeName: 'Avocado Toast with Poached Eggs',
        date: 'Aug 29, 8:30 AM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '😍', note: 'My absolute favorite breakfast.' },
          { name: 'David', status: 'Submitted', rating: '👍', note: 'Good, but needed 4 eggs to be full.' },
          { name: 'Aden', status: 'Submitted', rating: '🤢', note: 'I don\'t get why people like avocado.' }
        ]
      },
      {
        id: 'mock-9',
        recipeName: 'Sweet Potato Black Bean Enchiladas',
        date: 'Aug 25, 6:45 PM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '😍', note: 'Great vegetarian option, very filling.' },
          { name: 'David', status: 'Submitted', rating: '😐', note: 'Tasted fine but I missed having meat.' },
          { name: 'Aden', status: 'Submitted', rating: '🤢', note: 'Sweet potatoes do not belong in enchiladas.' }
        ]
      },
      {
        id: 'mock-10',
        recipeName: 'Crispy Air-Fried Chicken Parm',
        date: 'Aug 21, 7:15 PM',
        status: '100% Complete',
        personas: [
          { name: 'Maya', status: 'Submitted', rating: '👍', note: 'Nice low-oil alternative.' },
          { name: 'David', status: 'Submitted', rating: '😍', note: 'Great macros, still crispy.' },
          { name: 'Aden', status: 'Submitted', rating: '😍', note: 'Finally, real food!' }
        ]
      }
    ];

    const rawFeedback = localStorage.getItem('honestiFeedback');
    if (rawFeedback) {
      const localData = JSON.parse(rawFeedback);
      // Combine the live local storage data (from cooking a meal just now) with the 10 mock records
      setFeedbacks([...localData, ...mockData]);
    } else {
      setFeedbacks(mockData);
    }
  }, []);

  return (
    <div className="h-full w-full text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* Global Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-50 blur-[3px] scale-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/80 backdrop-blur-md pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 md:p-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 md:mb-8 border-b border-white/10 pb-4 md:pb-5 gap-3 md:gap-5">
          <div className="flex-1">
            <h1 className="text-[20px] md:text-[28px] font-bold tracking-tight mb-1 md:mb-1.5 drop-shadow-md">Household Feedback</h1>
            <p className="text-gray-300 text-[10px] md:text-[12px] font-medium drop-shadow-sm">Tracking feedback collection for AI recipe optimization.</p>
          </div>
        </div>

        {/* Feedback List (Table) */}
        <div className="bg-[#0f1523]/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-gray-400 bg-white/5">
                  <th className="px-4 py-3 font-bold">Meal</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right"></th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No feedback logs found. Cook a meal in the Cookbook first!</td>
                  </tr>
                ) : (
                  feedbacks.map(item => {
                    const isComplete = item.personas.every(p => p.status === 'Submitted');
                    const pendingPersonas = item.personas.filter(p => p.status === 'Pending');

                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedFeedback(item)}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3">
                          <p className="text-[12px] font-bold text-white group-hover:text-[#0077ff] transition-colors">{item.recipeName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                            <FiClock size={10} /> {item.date}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {isComplete ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                              <FiCheckCircle size={10} /> Done
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-orange-400 font-bold">Waiting on:</span>
                              <div className="flex -space-x-1.5">
                                {pendingPersonas.map((p, i) => (
                                  <div 
                                    key={i} 
                                    className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-[8px] border border-[#0f1523] shadow-sm" 
                                    title={p.name}
                                  >
                                    {p.name.substring(0, 1).toUpperCase()}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <FiChevronRight className="inline-block text-gray-500 group-hover:text-white transition-colors" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer for Feedback Details */}
      <AnimatePresence>
        {selectedFeedback && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeedback(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[360px] max-w-full bg-[#0b0f19] border-l border-white/10 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-white/10 flex justify-between items-start bg-white/5">
                <div>
                  <h2 className="text-[15px] font-bold text-white mb-0.5 leading-tight">{selectedFeedback.recipeName}</h2>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5"><FiClock size={10}/> {selectedFeedback.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors border border-white/10"
                >
                  <FiX size={14} />
                </button>
              </div>

              <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5">
                
                {/* Status Callout */}
                <div className="bg-[#0077ff]/10 border border-[#0077ff]/30 rounded-lg p-3 flex gap-2">
                  <FiMessageSquare className="text-[#00E5FF] shrink-0 mt-0.5" size={14} />
                  <p className="text-[10px] text-blue-100 font-medium leading-relaxed">
                    Feedback is automatically collected via Smart Cooking Mode completion, or via automated follow-ups sent to personal devices. Cannot be manually edited to preserve AI integrity.
                  </p>
                </div>

                <div>
                  <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Individual Persona Logs</h3>
                  <div className="space-y-2">
                    {selectedFeedback.personas.map((persona, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-[9px] shadow-sm border border-[#0b0f19]">
                              {persona.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-bold text-white">{persona.name}</span>
                          </div>
                          
                          {persona.status === 'Submitted' ? (
                            <span className="text-lg bg-white/10 w-7 h-7 flex items-center justify-center rounded-full shadow-inner">{persona.rating}</span>
                          ) : (
                            <span className="text-[8px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                              Pending Follow-up
                            </span>
                          )}
                        </div>

                        {persona.note && (
                          <div className="bg-black/30 p-2 rounded-md border border-white/5">
                            <p className="text-[10px] text-gray-300 italic">"{persona.note}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Feedback;
