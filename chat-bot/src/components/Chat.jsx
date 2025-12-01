import { useState, useEffect, useRef } from 'react';
import PgasLogo from '../assets/pgas.png'; 
import SunIcon from '../assets/sun.svg';
import MoonIcon from '../assets/moon.svg';
import SettingsIcon from '../assets/settings.svg';
import SendIcon from './SendIcon';

// --- CHRISTMAS COMPONENTS ---

// 1. IMPROVED SNOWFALL (Bigger & Windier)
const Snowfall = () => {
  const snowflakes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.3,
    size: Math.random() * 10 + 8 + 'px', 
    sway: Math.random() * 20 - 10 + 'px' 
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white/80 rounded-full blur-[1px]"
          style={{
            left: flake.left,
            top: '-20px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            '--sway': flake.sway,
            animation: `fall ${flake.animationDuration} linear infinite`,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

// 2. THE SNOWMAN 
const Snowman = () => (
  <div className="fixed bottom-0 left-[280px] z-0 hidden md:block pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-700">
    <svg width="250" height="300" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="240" r="50" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <circle cx="100" cy="170" r="40" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <circle cx="100" cy="110" r="30" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <circle cx="100" cy="170" r="3" fill="#1e293b"/>
      <circle cx="100" cy="190" r="3" fill="#1e293b"/>
      <circle cx="100" cy="150" r="3" fill="#1e293b"/>
      <circle cx="90" cy="105" r="3" fill="#1e293b"/>
      <circle cx="110" cy="105" r="3" fill="#1e293b"/>
      <path d="M100 110 L120 115 L100 120 Z" fill="#f97316" />
      <path d="M65 170 L20 140" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <path d="M135 170 L180 140" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 135 Q100 150 120 135" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M110 140 L115 170" stroke="#dc2626" strokeWidth="8" strokeLinecap="round"/>
      <rect x="70" y="80" width="60" height="5" fill="#1e293b" />
      <rect x="80" y="50" width="40" height="30" fill="#1e293b" />
      <rect x="80" y="70" width="40" height="5" fill="#ef4444" />
    </svg>
  </div>
);

// 3. CHRISTMAS LIGHTS 
const ChristmasLights = () => (
  <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none z-20 px-2">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className={`w-3 h-3 rounded-full mt-[-6px] shadow-md animate-pulse ${
          i % 3 === 0 ? 'bg-red-500 shadow-red-500/50' : 
          i % 3 === 1 ? 'bg-green-500 shadow-green-500/50' : 
          'bg-yellow-400 shadow-yellow-400/50'
        }`}
        style={{ animationDelay: `${i * 0.1}s`, animationDuration: '1.5s' }}
      ></div>
    ))}
  </div>
);

// 4. SANTA HAT
const SantaHat = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`absolute -top-4 -right-3 w-7 h-7 rotate-12 drop-shadow-md z-10 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 80 Q 50 10 80 70" fill="#D42426" />
    <circle cx="10" cy="85" r="9" fill="white" />
    <rect x="15" y="75" width="70" height="15" rx="5" fill="white" />
  </svg>
);

const TypingIndicator = () => (
  <div className="flex gap-1.5 px-4 py-3 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-2xl w-fit mt-1 border border-white/20">
    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
  </div>
);

function Chat({ user, handleLogout }) {
  const [theme, setTheme] = useState('dark');
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showSettings, setShowSettings] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const textareaRef = useRef(null);
  const settingsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null); // New ref for the container

  const WEBHOOK_URL = "https://workflow.pgas.ph/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat";

  // --- FIX: SCROLL TO BOTTOM LOGIC ---
  const scrollToBottom = () => {
    // We target the spacer div specifically
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; 
    }
  }, [input]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleNewChat = () => {
    setMessages([]); 
    setInput('');    
    if (textareaRef.current) textareaRef.current.style.height = '24px';
    setIsSidebarOpen(false); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeClasses = {
    dark: {
      bg: 'bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]', 
      text: 'text-slate-100',
      textSecondary: 'text-slate-400',
      sidebar: 'bg-[#020617]/95 border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)]',
      header: 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5', 
      userBubble: 'bg-gradient-to-br from-[#ef4444] to-[#991b1b] text-white shadow-lg shadow-red-900/30 border border-red-500/20', 
      botBubble: 'bg-[#1e293b]/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm', 
      inputContainer: 'bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5', 
      inputText: 'text-white placeholder-slate-400',
      sendBtn: 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/20',
      dropdown: 'bg-[#1e293b] text-white border border-white/10 shadow-2xl rounded-xl',
      link: 'text-yellow-400 hover:text-yellow-300',
      bold: 'font-bold text-white',
      hoverBtn: 'hover:bg-white/10',
      suggestionCard: 'bg-[#1e293b]/60 border border-white/5 hover:bg-[#334155] hover:border-green-500/30 text-slate-300'
    },
    light: {
      bg: 'bg-gradient-to-b from-[#f0f9ff] to-[#dfe7ef]',
      text: 'text-slate-800',
      textSecondary: 'text-slate-500',
      sidebar: 'bg-white/90 backdrop-blur-xl border-r border-slate-200',
      header: 'bg-white/70 backdrop-blur-xl border-b border-white/40', 
      userBubble: 'bg-gradient-to-br from-[#15803d] to-[#166534] text-white shadow-md shadow-green-900/20', 
      botBubble: 'bg-white/80 backdrop-blur-sm text-slate-800 border border-slate-200 shadow-sm',
      inputContainer: 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100',
      inputText: 'text-slate-800 placeholder-slate-400',
      sendBtn: 'bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white shadow-red-500/20',
      dropdown: 'bg-white border border-slate-200 text-slate-800 shadow-xl rounded-xl',
      link: 'text-[#dc2626] hover:text-[#b91c1c]',
      bold: 'font-bold text-slate-900',
      hoverBtn: 'hover:bg-slate-100',
      suggestionCard: 'bg-white/60 border border-slate-200 hover:bg-white hover:border-red-400 text-slate-600'
    },
  };

  const currentTheme = themeClasses[theme];
  const recentChats = [{ id: 1, title: 'HRIS Inquiry' }, { id: 2, title: 'SPMS Updates' }];

  const formatMessage = (text) => {
    if (!text) return "";
    const lines = text.split('\n');
    return lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={index} className="h-2"></div>;
        if (trimmedLine.startsWith('###') || trimmedLine.startsWith('##')) {
            const content = trimmedLine.replace(/^#+\s*/, '');
            return <h3 key={index} className={`text-base md:text-lg font-bold mt-5 mb-2 ${currentTheme.bold}`}>{formatInlineStyles(content)}</h3>;
        }
        const numberMatch = trimmedLine.match(/^(\d+\.)\s+(.*)/);
        if (numberMatch) {
             return (
                <div key={index} className="flex items-start gap-2 mb-2 mt-2">
                    <span className={`font-bold flex-shrink-0 ${currentTheme.bold}`}>{numberMatch[1]}</span>
                    <span className="leading-relaxed">{formatInlineStyles(numberMatch[2])}</span>
                </div>
            );
        }
        const bulletMatch = trimmedLine.match(/^(-\s|\*\s|•\s)(.*)/);
        if (bulletMatch) {
            return (
                <div key={index} className="flex items-start gap-2 ml-1 md:ml-3 mb-1.5">
                    <span className="flex-shrink-0 mt-1.5 text-[10px] text-yellow-500">★</span>
                    <span className="leading-relaxed">{formatInlineStyles(bulletMatch[2])}</span>
                </div>
            );
        }
        return <div key={index} className="mb-1.5 leading-relaxed min-h-[1.2rem]">{formatInlineStyles(line)}</div>;
    });
  };

  const formatInlineStyles = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2); 
        return <strong key={index} className={currentTheme.bold}>{content}</strong>;
      }
      return formatLinks(part, index);
    });
  };

  const formatLinks = (text, baseIndex) => {
    const markdownLinkRegex = /(\[[^\]]+\]\(https?:\/\/[^\)]+\))/g;
    const rawLinkRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(markdownLinkRegex).map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/);
      if (match) {
        return <a key={`${baseIndex}-${i}`} href={match[2]} target="_blank" rel="noopener noreferrer" className={`${currentTheme.link} font-bold break-all cursor-pointer hover:underline`} onClick={(e) => e.stopPropagation()}>{match[1]}</a>;
      }
      return part.split(rawLinkRegex).map((subPart, j) => {
        if (subPart.match(/^https?:\/\//)) {
          return <a key={`${baseIndex}-${i}-${j}`} href={subPart} target="_blank" rel="noopener noreferrer" className={`${currentTheme.link} font-bold break-all cursor-pointer hover:underline`} onClick={(e) => e.stopPropagation()}>{subPart}</a>;
        }
        return subPart;
      });
    });
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    setMessages((prev) => [...prev, { text: userMessageText, sender: 'user' }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '24px'; 
    setIsLoading(true); 

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText, chatId: 'unique-user-id' }), 
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const botResponse = data.output || data.text || data.response || data.message || JSON.stringify(data);
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Pasensya, naay problema sa connection.", sender: 'bot' }]);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fade-up { 0% { opacity: 0; transform: translateY(10px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes fall { 
            0% { transform: translate(0, -10px) rotate(0deg); } 
            50% { transform: translate(var(--sway), 50vh) rotate(180deg); }
            100% { transform: translate(0, 100vh) rotate(360deg); } 
          }
          .animate-message { animation: fade-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { 
            background: ${theme === 'dark' ? '#b91c1c' : '#166534'}; 
            border-radius: 10px; 
            border: 2px solid transparent;
            background-clip: content-box;
          }
          ::-webkit-scrollbar-thumb:hover { background-color: ${theme === 'dark' ? '#ef4444' : '#15803d'}; }
        `}
      </style>

      {/* Main Container */}
      <div className={`flex h-[100dvh] ${currentTheme.bg} ${currentTheme.text} font-sans overflow-hidden transition-colors duration-500 relative`}>
        
        {/* --- GLOBAL SNOWFALL EFFECT --- */}
        <Snowfall />

        {/* --- THE SNOWMAN (Fixed Background) --- */}
        <Snowman />

        {/* --- MOBILE OVERLAY --- */}
        {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* --- SIDEBAR --- */}
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col 
            transition-transform duration-300 transform cubic-bezier(0.4, 0, 0.2, 1)
            ${isSidebarOpen ? 'translate-x-0 shadow-3xl' : '-translate-x-full'} 
            md:relative md:translate-x-0 
            ${currentTheme.sidebar}
        `}>
           {/* Christmas Lights on Sidebar Top */}
           <ChristmasLights />

           <div className="p-4 pt-6 flex items-center justify-between relative">
                <div className="flex items-center gap-2 px-2">
                    <div className="relative">
                        <img src={PgasLogo} alt="Logo" className="w-8 h-8 object-contain relative z-10" />
                        <SantaHat className="-top-3 -right-2 w-5 h-5" />
                    </div>
                    <span className="font-bold tracking-tight text-lg">PGAS Bot</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className={`p-2 rounded-full md:hidden ${currentTheme.hoverBtn}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
           </div>
           
           <div className="px-4 mb-6 relative z-30">
                <button 
                    onClick={handleNewChat} 
                    className={`
                        flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                        ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'}
                        text-white text-sm font-medium transition-all shadow-lg active:scale-95 w-full relative overflow-hidden group border border-white/20
                    `}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="text-xl leading-none font-light mb-0.5 relative z-10">+</span>
                    <span className="relative z-10">New Chat</span>
                </button>
           </div>

           <div className="flex-1 overflow-y-auto px-2 space-y-1 relative z-30">
              <h2 className={`mb-2 text-xs font-bold uppercase tracking-widest px-4 ${currentTheme.textSecondary} opacity-60`}>History</h2>
              {recentChats.map((chat) => (
                  <button key={chat.id} className={`w-full text-left px-4 py-3 text-sm rounded-lg ${currentTheme.hoverBtn} truncate transition-all flex items-center gap-3 group opacity-80 hover:opacity-100`}>
                    <svg className={`w-4 h-4 opacity-50 ${theme === 'dark' ? 'group-hover:text-red-400' : 'group-hover:text-green-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    {chat.title}
                  </button>
              ))}
           </div>

           <div className="p-4 border-t border-dashed border-gray-500/20 space-y-2 relative z-30">
               <button className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ${currentTheme.hoverBtn} text-sm transition-colors`} onClick={toggleTheme}>
                   <img src={theme === 'dark' ? SunIcon : MoonIcon} alt="Theme" className={`w-5 h-5 opacity-70 ${theme === 'dark' ? 'invert' : ''}`} /> 
                   <span className="font-medium">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
               </button>
               
               <div className="relative" ref={settingsRef}>
                    <button className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ${currentTheme.hoverBtn} text-sm transition-colors`} onClick={() => setShowSettings(!showSettings)}>
                        <img src={SettingsIcon} alt="Settings" className={`w-5 h-5 opacity-70 ${theme === 'dark' ? 'invert' : ''}`} /> 
                        <span className="font-medium">Settings</span>
                    </button>
                    {showSettings && (
                        <div className={`absolute bottom-full left-0 w-64 mb-2 rounded-xl py-2 shadow-2xl ${currentTheme.dropdown} z-50 animate-message origin-bottom-left border border-white/10`}>
                            <div className="px-4 py-3 border-b border-gray-500/10 flex items-center gap-3">
                                <img src={user?.picture || PgasLogo} className="w-10 h-10 rounded-full bg-gray-500/10 object-cover" alt="User" />
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs opacity-60 truncate">{user?.email || 'user@pgas.ph'}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                Log out
                            </button>
                        </div>
                    )}
               </div>
           </div>
        </aside>

        {/* --- MAIN CHAT AREA --- */}
        <main className="flex-1 flex flex-col relative h-full w-full z-10">
          
          {/* Header */}
          <header className={`absolute top-0 inset-x-0 h-14 md:h-16 px-4 md:px-6 flex items-center justify-between z-30 ${currentTheme.header}`}>
            <div className="flex items-center gap-3 md:gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-lg md:hidden ${currentTheme.hoverBtn}`}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                </button>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tracking-wide flex items-center gap-2">
                        PGAS Assistant 🎄
                    </span>
                    <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Online
                    </span>
                </div>
            </div>
            <img src={user?.picture || PgasLogo} alt="Profile" className="w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-yellow-500/50 cursor-pointer hover:scale-105 transition-transform bg-white/10 p-0.5 object-cover" />
          </header>

          {/* Messages Container */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto relative w-full flex justify-center pt-16 md:pt-20 scroll-smooth"
          >
            
            <div className="w-full max-w-3xl px-4 relative z-10">
              
              {messages.length === 0 && (
                  <div className="mt-12 md:mt-16 text-center animate-message">
                      <div className="mb-6 inline-block p-4 rounded-full bg-gradient-to-br from-red-500/10 to-green-500/10 backdrop-blur-sm border border-white/10 relative">
                         <img src={PgasLogo} className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg relative z-10" alt="Logo" />
                         <SantaHat className="-top-4 -right-2 w-8 h-8" />
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                        Merry Christmas, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">{user?.given_name || 'User'}</span>!
                      </h1>
                      <p className={`text-base md:text-lg mb-8 md:mb-10 ${currentTheme.textSecondary}`}>How can I help you this holiday season?</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl mx-auto text-left px-2">
                          {['Where is the HR office?', 'How to access SPMS?', 'IT Support Request'].map((q, i) => (
                              <button key={i} onClick={() => setInput(q)} className={`p-4 rounded-xl transition-all duration-300 group ${currentTheme.suggestionCard} relative overflow-hidden active:scale-95`}>
                                  <p className="font-medium text-sm mb-2 relative z-10">{q}</p>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] bg-slate-500/10 group-hover:bg-red-500 group-hover:text-white transition-colors relative z-10`}>➜</div>
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* Message List */}
              <div className="space-y-4 md:space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex w-full animate-message ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && (
                            <div className="relative mr-2 md:mr-3 mt-1 self-start">
                                <img src={PgasLogo} alt="Bot" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white p-0.5 shadow-sm border border-gray-200 relative z-10" />
                                <SantaHat className="-top-2 -right-1 w-4 h-4 md:w-5 md:h-5" />
                            </div>
                        )}
                        
                        <div className={`
                            px-4 py-3 md:px-5 md:py-4 max-w-[90%] md:max-w-[85%] rounded-2xl text-[16px] shadow-sm relative overflow-hidden
                            ${msg.sender === 'user' ? `${currentTheme.userBubble} rounded-tr-sm` : `${currentTheme.botBubble} rounded-tl-sm`}
                        `}>
                            {/* Shiny gloss effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                            {formatMessage(msg.text)}
                        </div>

                         {msg.sender === 'user' && (
                             <img src={user?.picture || PgasLogo} alt="User" className="hidden md:block w-8 h-8 rounded-full bg-gray-200 object-cover shadow-sm ml-3 mt-1 self-end ring-2 ring-white/20" />
                         )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex w-full justify-start animate-message">
                         <div className="relative mr-2 md:mr-3 mt-1">
                             <img src={PgasLogo} alt="Bot" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white p-0.5 shadow-sm border border-gray-200 relative z-10" />
                             <SantaHat />
                         </div>
                         <TypingIndicator />
                    </div>
                )}
                
                {/* --- FIX: HUGE SPACER FOR SCROLLING --- */}
                {/* This div forces the scroll to go lower than the input bar */}
                <div ref={messagesEndRef} className="h-40 md:h-48 w-full flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Footer / Input Area */}
          <div className="absolute bottom-0 inset-x-0 pb-4 md:pb-6 pt-6 px-2 md:px-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none flex justify-center z-40">
            <div className={`pointer-events-auto w-[95%] md:w-full max-w-3xl rounded-[24px] md:rounded-[28px] pl-3 md:pl-4 pr-2 py-1.5 md:py-2 flex items-end gap-2 transition-all duration-300 ${currentTheme.inputContainer}`}>
                <button className={`p-2 mb-0.5 rounded-full hover:bg-gray-500/20 transition-colors ${currentTheme.textSecondary}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"/></svg>
                </button>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    rows={1}
                    className={`flex-1 bg-transparent border-none focus:ring-0 text-[16px] outline-none resize-none max-h-[100px] md:max-h-[120px] py-3 ${currentTheme.inputText}`}
                />

                <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className={`p-2.5 md:p-3 rounded-full mb-0.5 transition-all duration-300 
                        ${input.trim() ? `${currentTheme.sendBtn} hover:scale-105` : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    <SendIcon /> 
                </button>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}

export default Chat;