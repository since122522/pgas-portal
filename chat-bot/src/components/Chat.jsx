import { useState, useEffect, useRef } from 'react';
import PgasLogo from '../assets/pgas.png'; 
import SunIcon from '../assets/sun.svg';
import MoonIcon from '../assets/moon.svg';
import SettingsIcon from '../assets/settings.svg';
import SendIcon from './SendIcon';
// import SparkleIcon from './SparkleIcon'; // Removed based on request

// --- SNOWFALL COMPONENT (Optimized & Subtler) ---
const Snowfall = () => {
  const snowflakes = Array.from({ length: 30 }).map((_, i) => { // Reduced count for performance
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`, // Slower fall
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.3 + 0.1, // More subtle opacity
      fontSize: `${Math.random() * 10 + 5}px`,
    };
    return <div key={i} className="snowflake" style={style}>❄</div>;
  });

  return <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">{snowflakes}</div>;
};

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

  const WEBHOOK_URL = "https://workflow.pgas.ph/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`; 
    }
  }, [input]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]); 
    setInput('');    
    if (textareaRef.current) textareaRef.current.style.height = '24px';
    setIsSidebarOpen(false); 
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
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

  // --- ENHANCED THEME CLASSES ---
  const themeClasses = {
    dark: {
      bg: 'bg-[#0f1012]', // Darker base
      text: 'text-[#E3E3E3]',
      sidebar: 'bg-[#18191b] border-r border-[#2d2f31]',
      header: 'bg-[#0f1012]/80 backdrop-blur-md border-b border-[#2d2f31]', // Glass effect
      userBubble: 'bg-gradient-to-br from-[#2b2d31] to-[#1e1f21] text-[#E3E3E3] rounded-2xl rounded-tr-sm shadow-sm border border-white/5',
      botBubble: 'text-[#E3E3E3] pl-0', 
      inputContainer: 'bg-[#1e1f21] border border-[#3c4043] rounded-[24px] shadow-lg', 
      inputText: 'text-white placeholder-[#8E918F]',
      dropdown: 'bg-[#1e1f21] text-white border border-[#3c4043] shadow-2xl rounded-xl',
      link: 'text-[#8ab4f8] hover:underline cursor-pointer font-medium',
      bold: 'font-bold text-white',
      hoverBtn: 'hover:bg-[#2d2f31]',
      suggestionCard: 'bg-[#1e1f21] border border-[#3c4043] hover:bg-[#2d2f31] text-gray-300'
    },
    light: {
      bg: 'bg-white',
      text: 'text-[#1F1F1F]',
      sidebar: 'bg-[#f8f9fa] border-r border-gray-200',
      header: 'bg-white/80 backdrop-blur-md border-b border-gray-100', // Glass effect
      userBubble: 'bg-gradient-to-br from-[#f0f4f9] to-[#e1e5ea] text-[#1F1F1F] rounded-2xl rounded-tr-sm shadow-sm',
      botBubble: 'text-[#1F1F1F] pl-0',
      inputContainer: 'bg-[#f0f4f9] border-none rounded-[24px] shadow-sm',
      inputText: 'text-gray-800 placeholder-gray-500',
      dropdown: 'bg-white border border-gray-200 text-gray-800 shadow-xl rounded-xl',
      link: 'text-[#0B57D0] hover:underline cursor-pointer font-medium',
      bold: 'font-bold text-black',
      hoverBtn: 'hover:bg-gray-200',
      suggestionCard: 'bg-[#f0f4f9] hover:bg-[#dfe4ea] text-gray-700'
    },
  };

  const currentTheme = themeClasses[theme];
  const recentChats = [{ id: 1, title: 'HRIS Inquiry' }, { id: 2, title: 'SPMS Updates' }];

  const formatMessage = (text) => {
    if (!text) return "";
    const lines = text.split('\n');
    return lines.map((line, index) => {
        const isListItem = line.trim().match(/^(\d+\.|-|\*|•)/);
        return (
            <div key={index} className={`min-h-[1.5rem] leading-7 ${isListItem ? 'pl-5 mb-1' : 'mb-2'} transition-all`}>
                {formatInlineStyles(line)}
            </div>
        );
    });
  };

  const formatInlineStyles = (text) => {
    if (!text) return <br />;
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
        return <a key={`${baseIndex}-${i}`} href={match[2]} target="_blank" rel="noopener noreferrer" className={currentTheme.link} onClick={(e) => e.stopPropagation()}>{match[1]}</a>;
      }
      return part.split(rawLinkRegex).map((subPart, j) => {
        if (subPart.match(/^https?:\/\//)) {
          return <a key={`${baseIndex}-${i}-${j}`} href={subPart} target="_blank" rel="noopener noreferrer" className={currentTheme.link} onClick={(e) => e.stopPropagation()}>{subPart.length > 30 ? 'Link' : subPart}</a>;
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
          @keyframes snowfall { 0% { transform: translateY(-10px); opacity: 0; } 20% { opacity: 0.5; } 100% { transform: translateY(100vh); opacity: 0; } }
          @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          .snowflake { position: absolute; top: -10px; color: white; user-select: none; z-index: 10; animation-name: snowfall; animation-timing-function: linear; animation-iteration-count: infinite; }
          .animate-message { animation: fade-in-up 0.3s ease-out forwards; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #444746; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #5E5E5E; }
        `}
      </style>

      <div className={`flex h-screen ${currentTheme.bg} ${currentTheme.text} font-sans overflow-hidden transition-colors duration-300 selection:bg-blue-500/30`}>
        <Snowfall />

        {/* --- SIDEBAR --- */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-[280px] p-4 flex flex-col 
            transition-transform duration-300 transform ease-in-out
            ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
            md:relative md:translate-x-0 
            ${currentTheme.sidebar}
        `}>
           <div className="mb-6 px-2 flex justify-between items-center">
                <div className="flex items-center gap-2 opacity-80 md:hidden">
                    <span className="font-semibold tracking-tight">Menu</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-500/20 md:hidden transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
           </div>
           
           <div className="px-2 mb-6">
                <button onClick={handleNewChat} className={`flex items-center gap-3 px-4 py-3 rounded-full ${theme === 'dark' ? 'bg-[#28292A] hover:bg-[#333537]' : 'bg-[#e3e8ef] hover:bg-[#dbe0e7]'} text-sm transition-all shadow-sm w-full group`}>
                    <span className="text-xl font-light text-blue-500 group-hover:scale-110 transition-transform">+</span> 
                    <span className="font-medium opacity-90">New chat</span>
                </button>
           </div>

           <div className="flex-1 overflow-y-auto px-2 space-y-1">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider opacity-50 px-3">Recent</h2>
              {recentChats.map((chat) => (
                  <button 
                    key={chat.id} 
                    onClick={() => {
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg ${currentTheme.hoverBtn} truncate opacity-80 hover:opacity-100 transition-all flex gap-3 items-center`}
                  >
                    <svg className="w-4 h-4 opacity-50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    {chat.title}
                  </button>
              ))}
           </div>

           <div className="mt-auto px-2 space-y-1 pt-4 border-t border-gray-500/10">
               <button className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ${currentTheme.hoverBtn} text-sm opacity-80 transition-colors`} onClick={toggleTheme}>
                   {theme === 'dark' ? 
                     <img src={SunIcon} alt="Sun" className="w-5 h-5 filter invert opacity-70" /> : 
                     <img src={MoonIcon} alt="Moon" className="w-5 h-5 opacity-70" /> 
                   }
                   <span className="font-medium">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
               </button>
               
               <div className="relative" ref={settingsRef}>
                    <button className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ${currentTheme.hoverBtn} text-sm opacity-80 transition-colors`} onClick={toggleSettings}>
                        <img src={SettingsIcon} alt="Settings" className={`w-5 h-5 opacity-70 ${theme === 'dark' ? 'filter invert' : ''}`} /> 
                        <span className="font-medium">Settings</span>
                    </button>
                    {showSettings && (
                        <div className={`absolute bottom-12 left-0 w-56 rounded-xl py-2 ${currentTheme.dropdown} z-50 animate-fade-in-up`}>
                            <div className="px-4 py-3 text-xs opacity-60 border-b border-gray-500/20 mb-1">
                                <p className="font-semibold text-sm opacity-100 mb-0.5">User Account</p>
                                {user.email}
                            </div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Log out
                            </button>
                        </div>
                    )}
               </div>
           </div>
        </aside>

        {/* MAIN CHAT CONTENT */}
        <main className="flex flex-col flex-1 relative z-20 h-full">
          {/* Header with Blur */}
          <header className={`absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 ${currentTheme.header} z-30`}>
            <div className="flex items-center gap-3">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-500/20 md:hidden transition-colors">
                    <svg className="w-6 h-6 opacity-70" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                </button>

                <div className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                    <span className="text-lg font-semibold tracking-tight">PGAS Assistant</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-500 font-medium">BETA</span>
                </div>
            </div>
            
            <img 
                src={PgasLogo} 
                alt="Profile" 
                className="w-8 h-8 rounded-full bg-white p-0.5 border border-gray-500/30 object-contain shadow-sm cursor-pointer hover:scale-105 transition-transform" 
            />
          </header>

          <div className={`flex-1 overflow-y-auto relative w-full flex justify-center pt-16`}>
            
            {/* --- BACKGROUND LOGO (Watermark) --- */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 flex items-center justify-center overflow-hidden"
            >
                <img 
                    src={PgasLogo} 
                    alt="Watermark"
                    className={`w-[40%] max-w-[400px] object-contain transition-all duration-500 ${theme === 'dark' ? 'opacity-[0.03] grayscale' : 'opacity-[0.04] grayscale'}`}
                />
            </div>

            <div className="w-full max-w-[850px] px-4 pb-40 pt-6 relative z-10">
              
              {messages.length === 0 && (
                  <div className="flex flex-col items-start mt-8 animate-message">
                      <div className="mb-8">
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]">Hello, {user.given_name || user.name}</span>
                        </h1>
                        <h2 className={`text-4xl md:text-5xl font-medium ${theme === 'dark' ? 'text-[#444746]' : 'text-[#C4C7C5]'}`}>
                            How can I help you today?
                        </h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                          {['Where is the HR office?', 'How to access SPMS?', 'Document Tracking help'].map((q, i) => (
                              <div 
                                key={i} 
                                onClick={() => setInput(q)} 
                                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${currentTheme.suggestionCard}`}
                              >
                                  <p className="text-sm font-medium relative z-10">{q}</p>
                                  <div className="mt-8 flex justify-end relative z-10">
                                      <span className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-black/50 group-hover:bg-black' : 'bg-white group-hover:bg-white shadow-sm'}`}>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className="mb-6 w-full group animate-message">
                  {msg.sender === 'user' ? (
                      <div className="flex justify-end">
                          <div className={`px-5 py-3.5 text-[15px] leading-relaxed max-w-[85%] md:max-w-[70%] whitespace-pre-wrap ${currentTheme.userBubble}`}>
                              {formatMessage(msg.text)}
                          </div>
                      </div>
                  ) : (
                      <div className="flex gap-4 items-start w-full pr-4 md:pr-12">
                          <div className="flex-shrink-0 mt-1">
                              {/* --- PGAS LOGO as Bot Avatar (Strictly followed) --- */}
                              <img src={PgasLogo} alt="PGAS Bot" className="w-8 h-8 rounded-full bg-white p-0.5 shadow-md object-contain border border-gray-200" />
                          </div>
                          <div className={`flex-1 text-[16px] leading-7 font-light tracking-wide ${currentTheme.botBubble}`}>
                              {formatMessage(msg.text)}
                          </div>
                      </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                 <div className="flex gap-4 items-start w-full mt-2 animate-pulse">
                    <img src={PgasLogo} alt="Thinking..." className="w-8 h-8 rounded-full bg-white p-0.5 shadow-md object-contain border border-gray-200" />
                    <div className="flex-1 space-y-2.5 pt-2 max-w-[50%]">
                        <div className={`h-2.5 w-full rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div className={`h-2.5 w-[80%] rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    </div>
                 </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className={`absolute bottom-0 left-0 w-full pb-6 pt-2 px-4 z-40 bg-gradient-to-t ${theme === 'dark' ? 'from-[#0f1012] via-[#0f1012] to-transparent' : 'from-white via-white to-transparent'}`}>
            <div className="max-w-[850px] mx-auto">
              <div className={`relative flex items-end w-full px-4 py-3 transition-all duration-200 ${currentTheme.inputContainer}`}>
                {/* Floating Action Button Style Input */}
                
                <button type="button" className={`p-2 mb-0.5 rounded-full mr-1 hover:bg-gray-500/20 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about PGAS HR, Documents, or Services..."
                  disabled={isLoading}
                  rows={1}
                  className={`flex-1 bg-transparent border-none focus:ring-0 text-[16px] outline-none resize-none overflow-hidden max-h-[200px] ${currentTheme.inputText}`}
                  style={{ minHeight: '24px', padding: '0', margin: '5px 0' }} 
                />

                {input.trim() ? (
                    <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className={`p-2 ml-2 mb-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all transform hover:scale-105 active:scale-95`}
                    >
                        <SendIcon />
                    </button>
                ) : (
                    <div className="w-10"></div> // Spacer to keep layout stable
                )}
              </div>
              <p className="text-center text-[10px] mt-3 opacity-50 font-medium">
                PGAS Assistant can make mistakes. Consider checking important information.
              </p>
            </div>
          </footer>

        </main>
      </div>
    </>
  );
}

export default Chat;