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
  }
];

const ChatHistory = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
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
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: "I am currently viewing an archived conversation. Action noted.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateGroup: "Today"
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-transparent text-gray-200">
      <div className="md:hidden absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#00E5FF]/30 to-transparent z-30 pointer-events-none mix-blend-screen blur-[1px]"></div>


      <div className="absolute inset-0 z-0">
        <img
          src="/Honesti 3D Avatar.jfif"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-50 blur-[3px] scale-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/80 backdrop-blur-md pointer-events-none"></div>
      </div>



      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-[130px]">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const showDateDivider = index === 0 || messages[index - 1].dateGroup !== msg.dateGroup;

              return (
                <React.Fragment key={msg.id}>
                  {showDateDivider && (
                    <div className="flex justify-center my-6">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        {msg.dateGroup}
                      </span>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 w-full"
                  >
                    <div className="shrink-0 mt-0.5">
                      {msg.role === 'assistant' ? (
                        <img src="/logo/circle_avatar_logo.png" alt="AI" className="w-6 h-6 md:w-7 md:h-7 rounded-sm opacity-90 object-cover" />
                      ) : (
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-sm bg-white/10 flex items-center justify-center text-gray-300 font-semibold text-[11px]">
                          U
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-gray-400 mb-0.5 flex items-center gap-2">
                        {msg.role === 'assistant' ? 'Honesty AI' : 'You'}
                        <span className="text-[10px] font-medium opacity-50 font-normal">{msg.time}</span>
                      </div>

                      <div className="text-[14px] md:text-[14.5px] leading-relaxed text-gray-200">
                        {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk).map((chunk, i) => {
                          if (typeof chunk !== 'string') return chunk;
                          return chunk.split('`').map((c, j) => j % 2 === 1 ? <code key={j} className="bg-white/10 text-[#00E5FF] px-1.5 py-0.5 rounded text-[11px] font-mono border border-white/5">{c}</code> : c);
                        })}
                      </div>

                      {msg.action && (
                        <div className="mt-3 max-w-sm bg-black/20 backdrop-blur-md border border-white/5 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-white/5 px-3 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <FiCommand className="text-gray-400" size={12} />
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Action Executed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getActionLink(msg.action.endpoint) && (
                                <Link to={getActionLink(msg.action.endpoint)} className="flex items-center gap-1 text-[9px] text-[#00E5FF] hover:text-white transition-colors cursor-pointer font-bold tracking-wider">
                                  VIEW <FiArrowRight size={8} />
                                </Link>
                              )}
                              <FiCheckCircle className="text-emerald-500" size={12} />
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider ${msg.action.method === 'POST' ? 'bg-emerald-600/80' :
                                  msg.action.method === 'PUT' ? 'bg-[#0077ff]/80' :
                                    'bg-purple-600/80'
                                }`}>
                                {msg.action.method}
                              </span>
                              <span className="text-[11px] font-mono text-gray-300">{msg.action.endpoint}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 border-l-2 border-white/10 pl-2.5 italic">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 w-full">
              <div className="shrink-0 mt-0.5">
                <img src="/logo/circle_avatar_logo.png" alt="AI" className="w-6 h-6 md:w-7 md:h-7 rounded-sm opacity-90 object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex items-center pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-2 md:pb-3 pointer-events-none">
        <div className="max-w-2xl mx-auto relative pointer-events-auto">
          {/* Fade block restricted to exactly the input width, covering the gap below it */}
          <div className="absolute -bottom-2 md:-bottom-3 -left-50 right-0 h-6 md:h-8 bg-transparent backdrop-blur-2xl pointer-events-none -z-10" style={{ maskImage: "linear-gradient(to bottom, transparent, black 40%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)" }}></div>
          <form onSubmit={handleSend} className="relative z-10 flex items-end bg-[#0f1523]/80 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 focus-within:border-[#00E5FF]/40 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.15)] focus-within:bg-[#121928]/95 shadow-lg">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message Honesty AI..."
              className="w-full bg-transparent pl-4 pr-12 py-2.5 text-[14px] text-white focus:outline-none resize-none min-h-[40px] max-h-[120px] scrollbar-hide"
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-1.5 bottom-1.5 w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:text-white rounded-lg transition-colors"
            >
              <FiSend size={13} className="mr-[1px] mt-[1px]" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default ChatHistory;






