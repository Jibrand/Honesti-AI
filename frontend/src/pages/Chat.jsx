import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { FiSend } from 'react-icons/fi';

const INITIAL_MESSAGES = [
  { id: 1, role: 'user', text: "Can you help me plan a household menu for this week?" },
  { id: 2, role: 'assistant', text: "I'd be happy to help you plan a household menu! Let's start by considering any dietary restrictions or preferences for Maya and the rest of the household. Would you like to focus on quick weeknight meals, or do you have more time for preparation?" },
  { id: 3, role: 'user', text: "Quick weeknight meals please, Maya has soccer practice most days." },
  { id: 4, role: 'assistant', text: "Got it. Quick weeknight meals that fit around soccer practice.\n\nHere are a few rapid, high-protein options:\n1. 15-Minute Lemon Herb Salmon with quinoa\n2. One-pan Chicken Fajitas\n3. Turkey Meatball Whole Wheat Pasta\n\nWhich of these sound good, or should I suggest something else?" }
];

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useLayoutEffect(() => {
    if (isLoadingOlder || !scrollContainerRef.current) return;
    if (previousScrollHeightRef.current > 0) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeightRef.current;
      scrollContainerRef.current.scrollTop += heightDifference;
      previousScrollHeightRef.current = 0;
    }
  }, [messages, isLoadingOlder]);

  const loadOlderMessages = () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setIsLoadingOlder(true);
    
    if (scrollContainerRef.current) {
      previousScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
    }

    setTimeout(() => {
      const olderMessages = [
        { id: Date.now() + 1, role: 'user', text: "What did we have for dinner last Tuesday?" },
        { id: Date.now() + 2, role: 'assistant', text: "Last Tuesday, you made a fantastic Spinach and Feta Stuffed Chicken Breast with a side of roasted sweet potatoes!" },
      ];
      
      setMessages(prev => [...olderMessages, ...prev]);
      setIsLoadingOlder(false);
      isFetchingRef.current = false;
      
      if (messages.length > 10) {
        setHasMore(false);
      }
    }, 1200);
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop < 50 && hasMore && !isLoadingOlder) {
      loadOlderMessages();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg = {
      id: Date.now(),
      role: 'user',
      text: inputValue.trim()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-transparent text-gray-200">
      {/* Red Separator for Mobile Header (Thin glowing line) */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#00E5FF]/30 to-transparent z-30 pointer-events-none mix-blend-screen blur-[1px]"></div>

      {/* Global Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-[0.10] blur-[3px] pointer-events-none scale-110"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/90 backdrop-blur-sm pointer-events-none"></div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-[130px]"
      >
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          
          {isLoadingOlder && (
            <div className="flex justify-center py-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 w-full">
              {/* Avatar */}
              <div className="shrink-0 mt-0.5">
                {msg.role === 'assistant' ? (
                  <img src="/logo/circle_avatar_logo.png" alt="AI" className="w-6 h-6 md:w-7 md:h-7 rounded-sm opacity-90 object-cover" />
                ) : (
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-sm bg-white/10 flex items-center justify-center text-gray-300 font-semibold text-[11px]">
                    U
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-gray-400 mb-0.5">
                  {msg.role === 'assistant' ? 'Honesty AI' : 'You'}
                </div>
                <div className="text-[14px] md:text-[14.5px] leading-relaxed text-gray-200">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Composer Area - Frosted Glass Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-2 md:pb-3 pointer-events-none">
        <div className="max-w-2xl mx-auto relative pointer-events-auto">
          <div className="relative flex items-end bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl transition-all duration-300 focus-within:border-[#00E5FF]/40 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.15)] focus-within:bg-[#121928]/95 shadow-lg">
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
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-1.5 bottom-1.5 w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:text-white rounded-lg transition-colors"
            >
              <FiSend size={13} className="mr-[1px] mt-[1px]" />
            </button>
          </div>
          <div className="text-center mt-1.5 text-[10px] text-gray-500/70">
            Honesty AI can make mistakes. Check important info.
          </div>
        </div>
      </div>

    </div>
  );
};

export default Chat;






