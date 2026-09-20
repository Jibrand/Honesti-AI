import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCommand, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const getActionLink = (endpoint) => {
  if (endpoint.includes('/personas')) return '/household';
  if (endpoint.includes('/cookbook')) return '/cookbook';
  if (endpoint.includes('/pantry')) return '/pantry';
  if (endpoint.includes('/feedback')) return '/feedback';
  return null;
};

const initialMessages = [
  // --- 1 YEAR AGO ---
  {
    id: 1, role: 'user', time: "9:00 AM", dateGroup: "1 Year Ago",
    text: "Hi Honesti, we just moved in. I want to start using you to manage our meals and groceries."
  },
  {
    id: 2, role: 'assistant', time: "9:01 AM", dateGroup: "1 Year Ago",
    text: "Welcome to your new home, Maya! I'm thrilled to help. I've initialized the household database. To start, should I set up the core dietary profiles for you and David?"
  },
  {
    id: 3, role: 'user', time: "9:05 AM", dateGroup: "1 Year Ago",
    text: "Yes. I'm primarily vegetarian, but David loves meat. The kids, Sophia and Oliver, will eat almost anything but they can be picky about textures."
  },
  {
    id: 4, role: 'assistant', time: "9:06 AM", dateGroup: "1 Year Ago",
    text: "I've carefully noted these psychological and dietary nuances.",
    action: { method: "POST", endpoint: "/api/personas/init", payload: "Profiles created: Maya (Veg), David (Omnivore), Kids (Texture-sensitive)" }
  },
  {
    id: 5, role: 'assistant', time: "9:06 AM", dateGroup: "1 Year Ago",
    text: "For family meals, I will prioritize 'split-base' recipes where the meat can be cooked on the side, or I'll find clever ways to blend textures so the kids don't notice. We'll learn more as we gather feedback!"
  },

  // --- 8 MONTHS AGO ---
  {
    id: 6, role: 'user', time: "4:30 PM", dateGroup: "8 Months Ago",
    text: "David is starting marathon training next week. He's going to be burning a ton of calories."
  },
  {
    id: 7, role: 'assistant', time: "4:30 PM", dateGroup: "8 Months Ago",
    text: "That's a major lifestyle shift. Marathon training drastically increases glycogen depletion. I'll need to increase his complex carbohydrate intake by about 40%."
  },
  {
    id: 8, role: 'assistant', time: "4:31 PM", dateGroup: "8 Months Ago",
    text: "Updating his Persona now...",
    action: { method: "PUT", endpoint: "/api/personas/david", payload: "Macros updated: High Carb (Endurance), +800 kcal/day" }
  },
  {
    id: 9, role: 'user', time: "4:35 PM", dateGroup: "8 Months Ago",
    text: "Can you add a bunch of oats and pasta to the pantry shopping list?"
  },
  {
    id: 10, role: 'assistant', time: "4:35 PM", dateGroup: "8 Months Ago",
    text: "Done. I've added Rolled Oats, Whole Wheat Pasta, and Sweet Potatoes. I'll also start suggesting pasta-heavy dinners for him on his long-run days."
  },

  // --- 6 MONTHS AGO ---
  {
    id: 11, role: 'user', time: "5:15 PM", dateGroup: "6 Months Ago",
    text: "Sophia has decided she hates seeing vegetables in her food. Dinner has become a battleground."
  },
  {
    id: 12, role: 'assistant', time: "5:16 PM", dateGroup: "6 Months Ago",
    text: "This is a very common developmental phase for children her age. The key is reducing visual friction while maintaining nutritional density."
  },
  {
    id: 13, role: 'assistant', time: "5:16 PM", dateGroup: "6 Months Ago",
    text: "I'm generating a 'Hidden-Veggie Mac & Cheese' recipe. It blends butternut squash and cauliflower directly into the cheddar sauce. She won't even know it's there.",
    action: { method: "PUT", endpoint: "/api/cookbook/recipes", payload: "Created: Hidden-Veggie Mac & Cheese" }
  },
  {
    id: 14, role: 'user', time: "5:20 PM", dateGroup: "6 Months Ago",
    text: "That is brilliant. Thank you so much."
  },
  {
    id: 15, role: 'assistant', time: "5:20 PM", dateGroup: "6 Months Ago",
    text: "You're very welcome. We will monitor the email feedback survey after you cook it to see if she notices the textures."
  },

  // --- 4 MONTHS AGO ---
  {
    id: 16, role: 'user', time: "11:00 AM", dateGroup: "4 Months Ago",
    text: "We are throwing out way too much food. The grocery bills are getting high."
  },
  {
    id: 17, role: 'assistant', time: "11:01 AM", dateGroup: "4 Months Ago",
    text: "I've been analyzing your Pantry logs. I noticed you frequently buy fresh spinach and berries, but 30% of it expires before consumption."
  },
  {
    id: 18, role: 'user', time: "11:05 AM", dateGroup: "4 Months Ago",
    text: "Yeah, we never finish them in time."
  },
  {
    id: 19, role: 'assistant', time: "11:05 AM", dateGroup: "4 Months Ago",
    text: "Let's change the psychology of your shopping. I'm going to update your automated shopping list to swap fresh berries for frozen (great for David's marathon smoothies) and halve the spinach quantity.",
    action: { method: "PUT", endpoint: "/api/pantry/rules", payload: "Rule Added: Auto-swap fresh berries to frozen. Reduce spinach 50%." }
  },
  {
    id: 20, role: 'assistant', time: "11:06 AM", dateGroup: "4 Months Ago",
    text: "This small adjustment should save you roughly $45/month and drastically reduce food guilt."
  },

  // --- 2 MONTHS AGO ---
  {
    id: 21, role: 'user', time: "3:30 PM", dateGroup: "2 Months Ago",
    text: "Oliver has been complaining about stomach aches after ice cream. We think he might be slightly lactose intolerant."
  },
  {
    id: 22, role: 'assistant', time: "3:30 PM", dateGroup: "2 Months Ago",
    text: "Thank you for letting me know. I'll flag dairy as a sensitivity in Oliver's Persona immediately to be safe.",
    action: { method: "PUT", endpoint: "/api/personas/oliver", payload: "Sensitivity added: Dairy/Lactose (Moderate)" }
  },
  {
    id: 23, role: 'assistant', time: "3:31 PM", dateGroup: "2 Months Ago",
    text: "Going forward, I will automatically suggest oat milk or almond milk substitutes in baking, and ensure the Cookbook highlights dairy-free options for his portions."
  },
  {
    id: 24, role: 'user', time: "3:35 PM", dateGroup: "2 Months Ago",
    text: "Add some oat milk to the pantry."
  },
  {
    id: 25, role: 'assistant', time: "3:35 PM", dateGroup: "2 Months Ago",
    text: "Added 2 cartons of Oat Milk to the upcoming shopping list."
  },

  // --- LAST WEEK ---
  {
    id: 26, role: 'user', time: "10:00 AM", dateGroup: "Last Week",
    text: "Honesti, David's marathon is over! He finished it yesterday."
  },
  {
    id: 27, role: 'assistant', time: "10:00 AM", dateGroup: "Last Week",
    text: "That's fantastic news! Congratulations to him. Since his extreme endurance training is over, his metabolic burn rate will drop."
  },
  {
    id: 28, role: 'assistant', time: "10:01 AM", dateGroup: "Last Week",
    text: "Should I revert his Persona macros back to a standard maintenance level? Keeping him on +800 kcal of carbs will lead to lethargy now that he's resting."
  },
  {
    id: 29, role: 'user', time: "10:15 AM", dateGroup: "Last Week",
    text: "Yes, drop the carbs, but keep the protein high. He wants to focus on strength training now."
  },
  {
    id: 30, role: 'assistant', time: "10:15 AM", dateGroup: "Last Week",
    text: "Understood. Re-calibrating David's psychological and dietary profile.",
    action: { method: "PUT", endpoint: "/api/personas/david", payload: "Macros updated: High Protein, Moderate Carb (Maintenance)" }
  },
  {
    id: 31, role: 'assistant', time: "10:15 AM", dateGroup: "Last Week",
    text: "I'll start heavily recommending lean proteins like chicken, salmon, and lentils."
  },

  // --- YESTERDAY ---
  {
    id: 32, role: 'user', time: "8:00 AM", dateGroup: "Yesterday",
    text: "We are making the Spicy Thai Peanut Noodles tonight."
  },
  {
    id: 33, role: 'assistant', time: "8:00 AM", dateGroup: "Yesterday",
    text: "Excellent choice. I see the ingredients are fully stocked in the Pantry. Have a great dinner!"
  },
  {
    id: 34, role: 'user', time: "7:45 PM", dateGroup: "Yesterday",
    text: "Just finished cooking it using the Smart Cooking Mode."
  },
  {
    id: 35, role: 'assistant', time: "7:45 PM", dateGroup: "Yesterday",
    text: "I hope everyone enjoyed it! As always, the Smart Cooking Mode completion has automatically triggered the feedback survey emails to everyone's devices."
  },
  {
    id: 36, role: 'assistant', time: "7:46 PM", dateGroup: "Yesterday",
    text: "I'll monitor the Feedback Hub and let you know when the responses come in so we can analyze the data."
  },
  {
    id: 37, role: 'user', time: "8:30 PM", dateGroup: "Yesterday",
    text: "Sophia loved the sunflower butter substitute instead of regular peanuts."
  },
  {
    id: 38, role: 'assistant', time: "8:30 PM", dateGroup: "Yesterday",
    text: "That’s a huge win! I see her 😍 rating just synced via her email link. I will prioritize sunflower butter in all future Asian-inspired dishes for her."
  },

  // --- TODAY ---
  {
    id: 39, role: 'assistant', time: "8:00 AM", dateGroup: "Today",
    text: "Good morning Maya. I was reviewing the Feedback Hub overnight. You and Sophia completed your email surveys for the Thai Noodles, but David hasn't opened his email link yet."
  },
  {
    id: 40, role: 'user', time: "8:05 AM", dateGroup: "Today",
    text: "He usually forgets. Can you resend his email?"
  },
  {
    id: 41, role: 'assistant', time: "8:05 AM", dateGroup: "Today",
    text: "Sending a follow-up email reminder to David now...",
    action: { method: "POST", endpoint: "/api/feedback/reminders", payload: "Email reminder dispatched to david@household.com" }
  },
  {
    id: 42, role: 'user', time: "8:15 AM", dateGroup: "Today",
    text: "He just told me he actually felt it lacked protein for his new strength routine. He'd rate it a 😐."
  },
  {
    id: 43, role: 'assistant', time: "8:15 AM", dateGroup: "Today",
    text: "That aligns perfectly with his new Persona goals. I'll automatically log that 😐 rating on his behalf so he doesn't have to."
  },
  {
    id: 44, role: 'assistant', time: "8:15 AM", dateGroup: "Today",
    text: "I'll make a firm rule: Whenever we make noodles, I will automatically add a side of grilled chicken or edamame specifically for David's portion.",
    action: { method: "PUT", endpoint: "/api/personas/david", payload: "Rule added: Mandate protein side for all noodle dishes." }
  },
  {
    id: 45, role: 'user', time: "11:30 AM", dateGroup: "Today",
    text: "That's why I love you. Okay, what do we have in the pantry for a quick lunch today?"
  },
  {
    id: 46, role: 'assistant', time: "11:30 AM", dateGroup: "Today",
    text: "Scanning current Pantry inventory...",
    action: { method: "GET", endpoint: "/api/pantry/inventory", payload: "Found: Chicken Breast, Quinoa, Bell Peppers (Expiring tomorrow)" }
  },
  {
    id: 47, role: 'assistant', time: "11:30 AM", dateGroup: "Today",
    text: "You have Bell Peppers that will go bad by tomorrow. \n\nI recommend a **High-Protein Chicken Quinoa Bowl**. It uses the expiring peppers and hits David's new protein goals perfectly without making him feel sluggish."
  },
  {
    id: 48, role: 'user', time: "11:32 AM", dateGroup: "Today",
    text: "Perfect. Add it to the cookbook."
  },
  {
    id: 49, role: 'assistant', time: "11:32 AM", dateGroup: "Today",
    text: "Done. The recipe is now available in your Cookbook for Smart Cooking.",
    action: { method: "PUT", endpoint: "/api/cookbook/recipes", payload: "Created: High-Protein Chicken Quinoa Bowl" }
  },
  {
    id: 50, role: 'assistant', time: "11:32 AM", dateGroup: "Today",
    text: "I've also queued an automatic feedback survey email to be sent immediately after you finish cooking it."
  }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initial scroll to bottom
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Scroll when messages change
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateGroup: "Today"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        text: "I've processed your request. I will monitor the household data and adjust automatically. Let me know if you need anything else.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateGroup: "Today"
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1200);
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-[#0b0f19]">
      
      {/* Background Image Blurred */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-10 blur-[40px] scale-110"
        />
      </div>

      {/* Top fade gradient to replace the header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0b0f19] to-transparent z-20 pointer-events-none"></div>

      {/* Chat Area - Flows straight up */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar px-4 pt-8 pb-20">
        <div className="max-w-3xl mx-auto w-full pb-2">
          
          <div className="space-y-1">
            <AnimatePresence>
              {messages.map((msg, index) => {
                const showDateDivider = index === 0 || messages[index - 1].dateGroup !== msg.dateGroup;

                return (
                  <React.Fragment key={msg.id}>
                    {/* Date Divider (WhatsApp Style) */}
                    {showDateDivider && (
                      <div className="flex justify-center my-6">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 shadow-sm">
                          {msg.dateGroup}
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 w-full py-2 hover:bg-white/[0.01] rounded-xl px-2 transition-colors group"
                    >
                      {/* Avatar */}
                      <div className="shrink-0 mt-0.5">
                        {msg.role === 'assistant' ? (
                          <img 
                            src="/logo/circle_avatar_logo.png" 
                            alt="Honesti AI" 
                            className="w-7 h-7 rounded-full object-cover shadow-sm border border-white/10"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                            Mv
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-white text-[12px] tracking-wide">
                            {msg.role === 'assistant' ? 'Honesti AI' : 'Maya'}
                          </span>
                          <span className="text-[9px] text-gray-500 font-medium pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {msg.time}
                          </span>
                        </div>

                        <div className="text-[12px] leading-relaxed text-gray-300 whitespace-pre-wrap">
                          {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk).map((chunk, i) => {
                             if (typeof chunk !== 'string') return chunk;
                             return chunk.split('`').map((c, j) => j % 2 === 1 ? <code key={j} className="bg-white/10 text-[#00E5FF] px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/5">{c}</code> : c);
                          })}
                        </div>

                        {/* System Action Card */}
                        {msg.action && (
                          <div className="mt-2 max-w-sm bg-[#0f1523]/80 backdrop-blur-md border border-white/5 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-white/5 px-2.5 py-1 flex items-center justify-between border-b border-white/5">
                              <div className="flex items-center gap-1.5">
                                <FiCommand className="text-gray-400" size={10} />
                                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Action Executed</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getActionLink(msg.action.endpoint) && (
                                  <Link to={getActionLink(msg.action.endpoint)} className="flex items-center gap-1 text-[9px] text-[#00E5FF] hover:text-white transition-colors cursor-pointer font-bold tracking-wider">
                                    VIEW <FiArrowRight size={8} />
                                  </Link>
                                )}
                                <FiCheckCircle className="text-emerald-500" size={10} />
                              </div>
                            </div>
                            <div className="p-2.5">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider ${
                                  msg.action.method === 'POST' ? 'bg-emerald-600/80' : 
                                  msg.action.method === 'PUT' ? 'bg-[#0077ff]/80' : 
                                  'bg-purple-600/80'
                                }`}>
                                  {msg.action.method}
                                </span>
                                <span className="text-[10px] font-mono text-gray-300">{msg.action.endpoint}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 border-l-2 border-white/10 pl-2 ml-0.5 italic">
                                {msg.action.payload}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 w-full py-2 px-2">
                <div className="shrink-0 mt-0.5">
                  <img 
                    src="/logo/circle_avatar_logo.png" 
                    alt="Honesti AI" 
                    className="w-7 h-7 rounded-full object-cover shadow-sm border border-white/10"
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center">
                  <div className="flex items-center gap-1 h-5">
                    <div className="w-1 h-1 bg-[#00E5FF] rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Gradient fade at bottom so messages don't clash with floating input */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b0f19] to-transparent z-10 pointer-events-none"></div>

      {/* Input Area - Flushed to absolute ground pixel zero */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-0">
        <div className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleSend} className="relative flex items-end bg-[#0f1523]/95 backdrop-blur-xl border border-white/10 rounded-t-2xl shadow-2xl">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ask Honesti to manage your pantry, plan meals..."
              className="w-full bg-transparent pl-5 pr-12 py-3.5 text-[13px] text-white focus:outline-none resize-none min-h-[44px] max-h-[120px] custom-scrollbar"
              rows="1"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 bottom-2 w-7 h-7 flex items-center justify-center bg-[#00E5FF] text-black hover:bg-[#00cce6] disabled:bg-white/5 disabled:text-white/20 rounded-full transition-colors cursor-pointer shadow-md"
            >
              <FiSend size={13} className="mr-[2px] mt-[1px]" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Chat;
