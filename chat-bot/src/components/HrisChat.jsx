import { useState, useEffect, useRef } from 'react';
import HrisLogo from '../assets/hris.png';
import SunIcon from '../assets/sun.svg';
import MoonIcon from '../assets/moon.svg';
import SendIcon from './SendIcon';
import TypingIndicator from './TypingIndicator';

function HrisChat({ user, handleLogout, webhookUrl }) {
  const [theme, setTheme] = useState('dark');
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showSettings, setShowSettings] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const textareaRef = useRef(null);
  const settingsRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const messagesEndRef = useRef(null);

  const WEBHOOK_URL = webhookUrl || "https://workflow.pgas.ph/webhook/5a3b20a5-4c7d-4c16-811b-fdd13bbf3f3f/chat";

  const scrollToBottom = () => {
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
    setCurrentChatId(null);
    if (textareaRef.current) textareaRef.current.style.height = '24px';
    setIsSidebarOpen(false); 
  };

  const handleSelectChat = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/chat/${chatId}`);
      if (response.ok) {
        const history = await response.json();
        setMessages(history);
        setCurrentChatId(chatId);
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

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
                    <span className="flex-shrink-0 mt-1.5 text-[10px] text-blue-500">★</span>
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
    const markdownLinkRegex = /(\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
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
      userBubble: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-900/30 border border-blue-500/20', 
      botBubble: 'bg-[#1e293b]/80 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm', 
      inputContainer: 'bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5',
      inputText: 'text-white placeholder-slate-400',
      sendBtn: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/20',
      dropdown: 'bg-[#1e293b] text-white border border-white/10 shadow-2xl rounded-xl',
      link: 'text-blue-400 hover:text-blue-300',
      bold: 'font-bold text-white',
      hoverBtn: 'hover:bg-white/10',
      suggestionCard: 'bg-[#1e293b]/60 border border-white/5 hover:bg-[#334155] hover:border-blue-500/30 text-slate-300'
    },
    light: {
      bg: 'bg-gradient-to-b from-[#f0f9ff] to-[#dfe7ef]',
      text: 'text-slate-800',
      textSecondary: 'text-slate-500',
      sidebar: 'bg-white/90 backdrop-blur-xl border-r border-slate-200',
      header: 'bg-white/70 backdrop-blur-xl border-b border-white/40', 
      userBubble: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-900/20', 
      botBubble: 'bg-white/80 backdrop-blur-sm text-slate-800 border border-slate-200 shadow-sm',
      inputContainer: 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100',
      inputText: 'text-slate-800 placeholder-slate-400',
      sendBtn: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/20',
      dropdown: 'bg-white border border-slate-200 text-slate-800 shadow-xl rounded-xl',
      link: 'text-blue-600 hover:text-blue-500',
      bold: 'font-bold text-slate-900',
      hoverBtn: 'hover:bg-slate-100',
      suggestionCard: 'bg-white/60 border border-slate-200 hover:bg-white hover:border-blue-400 text-slate-600'
    },
  };

  const currentTheme = themeClasses[theme];

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/chat/recent/${user.email}`);
        if (response.ok) {
          const recent = await response.json();
          setRecentChats(recent);
        }
      } catch (error) {
        console.error("Failed to fetch recent chats:", error);
      }
    };

    if (user && user.email) {
      fetchRecentChats();
    }
  }, [user, messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    const userMessage = { text: userMessageText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '24px'; 
    setIsLoading(true); 

    try {
      const messagePayload = {
        userId: user.email,
        sender: 'user',
        text: userMessageText,
        chatId: currentChatId
      };
      
      const saveUserMessageResponse = await fetch('http://localhost:3001/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload),
      });

      const savedUserMessage = await saveUserMessageResponse.json();
      if (!currentChatId) {
        setCurrentChatId(savedUserMessage._id);
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText, chatId: user.email }), 
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const botResponseText = data.output || data.text || data.response || data.message || JSON.stringify(data);
      const botMessage = { text: botResponseText, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);

      // Save bot message
      await fetch('http://localhost:3001/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.email, sender: 'bot', text: botResponseText, chatId: currentChatId || savedUserMessage._id }),
      });

    } catch (error) {
      const errorMessage = { text: "Apologies, there seems to be a connection issue.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
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
          .animate-message { animation: fade-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { 
            background: ${theme === 'dark' ? '#2563eb' : '#1d4ed8'}; 
            border-radius: 10px; 
            border: 2px solid transparent;
            background-clip: content-box;
          }
          ::-webkit-scrollbar-thumb:hover { background-color: ${theme === 'dark' ? '#3b82f6' : '#2563eb'}; }
        `}
      </style>

      {/* Main Container */}
      <div className={`flex h-[100dvh] ${currentTheme.bg} ${currentTheme.text} font-sans overflow-hidden transition-colors duration-500 relative`}> 
        
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
           <div className="p-4 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 px-2">
                    <img src={HrisLogo} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold tracking-tight text-lg">HRIS Bot</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className={`p-2 rounded-full md:hidden ${currentTheme.hoverBtn}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
           </div>
           
           <div className="px-4 mb-6">
                <button 
                    onClick={handleNewChat} 
                    className={`
                        flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                        ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-700 hover:bg-blue-600'}
                        text-white text-sm font-medium transition-all shadow-lg active:scale-95 w-full relative overflow-hidden group border border-white/20
                    `}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="text-xl leading-none font-light mb-0.5 relative z-10">+</span>
                    <span className="relative z-10">New Chat</span>
                </button>
           </div>

           <div className="flex-1 overflow-y-auto px-2 space-y-1">
              <h2 className={`mb-2 text-xs font-bold uppercase tracking-widest px-4 ${currentTheme.textSecondary} opacity-60`}>History</h2>
              {recentChats.map((chat) => (
                  <button key={chat.id} onClick={() => handleSelectChat(chat.id)} className={`w-full text-left px-4 py-3 text-sm rounded-lg ${currentTheme.hoverBtn} truncate transition-all flex items-center gap-3 group opacity-80 hover:opacity-100`}>
                    <svg className={`w-4 h-4 opacity-50 ${theme === 'dark' ? 'group-hover:text-blue-400' : 'group-hover:text-blue-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    {chat.title}
                  </button>
              ))}
           </div>

           <div className="p-4 border-t border-dashed border-gray-500/20 space-y-2">
               <button className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ${currentTheme.hoverBtn} text-sm transition-colors`} onClick={toggleTheme}>
                   <img src={theme === 'dark' ? SunIcon : MoonIcon} alt="Theme" className={`w-5 h-5 opacity-70 ${theme === 'dark' ? 'invert' : ''}`} /> 
                   <span className="font-medium">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
               </button>
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
                        HRIS Assistant
                    </span>
                    <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Online
                    </span>
                </div>
            </div>
            <div className="relative" ref={profileDropdownRef}>
              <img
                src={user?.picture || HrisLogo}
                alt="Profile"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-blue-500/50 cursor-pointer hover:scale-105 transition-transform bg-white/10 p-0.5 object-cover"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              />
              {showProfileDropdown && (
                <div
                  className={`absolute top-full right-0 mt-2 w-56 rounded-xl py-2 shadow-2xl ${currentTheme.dropdown} z-50 animate-message origin-top-right border border-white/10`}
                >
                  <div className="px-4 py-3 border-b border-gray-500/10 flex items-center gap-3">
                    <img
                      src={user?.picture || HrisLogo}
                      className="w-10 h-10 rounded-full bg-gray-500/10 object-cover"
                      alt="User"
                    />
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs opacity-60 truncate">
                        {user?.email || "user@pgas.ph"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto relative w-full flex justify-center pt-16 md:pt-20 scroll-smooth">
            
            <div className="w-full max-w-3xl px-4 relative z-10">
              
              {messages.length === 0 && (
                  <div className="mt-12 md:mt-16 text-center animate-message">
                      <div className="mb-6 inline-block p-4 rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-sm border border-white/10">
                         <img src={HrisLogo} className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg" alt="Logo" />
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">{user?.given_name || 'User'}</span>!
                      </h1>
                      <p className={`text-base md:text-lg mb-8 md:mb-10 ${currentTheme.textSecondary}`}>How can I help you with your HRIS concerns today?</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto text-left px-2">
                          {['Check my leave credits', 'How to file a leave?'].map((q, i) => (
                              <button key={i} onClick={() => setInput(q)} className={`p-4 rounded-xl transition-all duration-300 group ${currentTheme.suggestionCard} relative overflow-hidden active:scale-95`}>
                                  <p className="font-medium text-sm mb-2 relative z-10">{q}</p>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] bg-slate-500/10 group-hover:bg-blue-500 group-hover:text-white transition-colors relative z-10`}>➜</div>
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
                            <img src={HrisLogo} alt="Bot" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white p-0.5 shadow-sm border border-gray-200 mr-2 md:mr-3 mt-1 self-start" />
                        )}
                        
                        <div className={`
                            px-4 py-3 md:px-5 md:py-4 max-w-[90%] md:max-w-[85%] rounded-2xl text-[16px] shadow-sm relative overflow-hidden
                            ${msg.sender === 'user' ? `${currentTheme.userBubble} rounded-tr-sm` : `${currentTheme.botBubble} rounded-tl-sm`}
                        `}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                            {formatMessage(msg.text)}
                        </div>

                         {msg.sender === 'user' && (
                             <img src={user?.picture || HrisLogo} alt="User" className="hidden md:block w-8 h-8 rounded-full bg-gray-200 object-cover shadow-sm ml-3 mt-1 self-end ring-2 ring-white/20" />
                         )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex w-full justify-start animate-message">
                         <img src={HrisLogo} alt="Bot" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white p-0.5 shadow-sm border border-gray-200 mr-2 md:mr-3 mt-1" />
                         <TypingIndicator />
                    </div>
                )}
                
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
                    placeholder="Ask about HRIS..."
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

export default HrisChat;
