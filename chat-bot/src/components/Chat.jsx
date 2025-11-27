import { useState, useEffect, useRef } from 'react';
import PgasLogo from '../assets/pgas.png'; 
import SunIcon from '../assets/sun.svg';
import MoonIcon from '../assets/moon.svg';
import SettingsIcon from '../assets/settings.svg';
import SendIcon from './SendIcon';

// --- CHRISTMAS SNOWFALL COMPONENT ---
const Snowfall = () => {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3,
      fontSize: `${Math.random() * 10 + 10}px`,
    };
    return <div key={i} className="snowflake" style={style}>❄</div>;
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {snowflakes}
    </div>
  );
};

function Chat({ handleLogout }) {
  const [theme, setTheme] = useState('dark');
  const [messages, setMessages] = useState([
    { text: "Maayong Pasko! 🎄 I'm the PGAS Smart Assistant. Unsa akong matabang nimo?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showSettings, setShowSettings] = useState(false);
  
  const settingsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const WEBHOOK_URL = "https://workflow.pgas.ph/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const themeClasses = {
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      chatBg: 'bg-gray-900',
      header: 'bg-gray-800 border-gray-700',
      input: 'bg-gray-800 text-white border-gray-600 placeholder-gray-500 focus:ring-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white', 
      recentChat: 'hover:bg-gray-800 text-gray-300 hover:text-emerald-400',
      sender: 'bg-emerald-600 text-white',
      bot: 'bg-gray-800 text-white border border-gray-700',
      sidebar: 'bg-gray-900 border-gray-800',
      iconBtn: 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400',
      dropdown: 'bg-gray-800 border-gray-700 text-white',
      userAvatarBg: 'bg-emerald-900',
      userAvatarText: 'text-emerald-200',
      link: 'text-blue-400 hover:text-blue-300 font-bold underline decoration-2 underline-offset-2'
    },
    light: {
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      chatBg: 'bg-white',
      header: 'bg-white border-gray-200',
      input: 'bg-gray-100 text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      recentChat: 'hover:bg-emerald-50 text-gray-600 hover:text-emerald-700',
      sender: 'bg-emerald-600 text-white',
      bot: 'bg-white text-gray-800 border border-gray-200 shadow-sm',
      sidebar: 'bg-white border-gray-200',
      iconBtn: 'hover:bg-emerald-50 text-gray-500 hover:text-emerald-600',
      dropdown: 'bg-white border-gray-200 text-gray-800',
      userAvatarBg: 'bg-emerald-100',
      userAvatarText: 'text-emerald-700',
      link: 'text-blue-600 hover:text-blue-800 font-bold underline decoration-2 underline-offset-2'
    },
  };

  const currentTheme = themeClasses[theme];

  const recentChats = [
    { id: 1, title: 'HRIS Inquiry' },
    { id: 2, title: 'SPMS Updates' },
    { id: 3, title: 'Christmas Event' },
  ];

  // --- UPDATED: Main Format Function (Handles Lines & Layout) ---
  const formatMessage = (text) => {
    if (!text) return "";

    // 1. Split text by NEWLINES (\n) para ma-separate ang paragraphs ug lists
    const lines = text.split('\n');

    return lines.map((line, index) => {
        // Check if line is a list item (starts with "1.", "-", "•")
        // Kung list item, hatagan natog padding-left (pl-4) para mo-indent
        const isListItem = line.trim().match(/^(\d+\.|-|\*|•)/);
        
        return (
            <div 
                key={index} 
                className={`min-h-[1.5rem] ${isListItem ? 'pl-4 mb-1' : 'mb-1'}`}
            >
                {/* 2. Format content inside the line (Bold & Links) */}
                {formatInlineStyles(line)}
            </div>
        );
    });
  };

  // --- Helper: Formats Bold & Links inside a single line ---
  const formatInlineStyles = (text) => {
    if (!text) return <br />; // Return empty line if text is blank

    // Split by Bold first
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      // Handle Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2); 
        return <strong key={index} className="font-bold text-emerald-500">{content}</strong>;
      }
      // Handle Links
      return formatLinks(part, index);
    });
  };

  // --- Helper: Formats Links ---
  const formatLinks = (text, baseIndex) => {
    const markdownLinkRegex = /(\[[^\]]+\]\(https?:\/\/[^\)]+\))/g;
    const rawLinkRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(markdownLinkRegex).map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/);
      if (match) {
        return (
          <a
            key={`${baseIndex}-${i}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className={`${theme === 'dark' ? themeClasses.dark.link : themeClasses.light.link} cursor-pointer ml-1`}
            onClick={(e) => e.stopPropagation()}
          >
            {match[1]}
          </a>
        );
      }
      return part.split(rawLinkRegex).map((subPart, j) => {
        if (subPart.match(/^https?:\/\//)) {
          return (
            <a
              key={`${baseIndex}-${i}-${j}`}
              href={subPart}
              target="_blank"
              rel="noopener noreferrer"
              className={`${theme === 'dark' ? themeClasses.dark.link : themeClasses.light.link} cursor-pointer ml-1`}
              onClick={(e) => e.stopPropagation()}
            >
              {subPart.length > 25 ? 'Open Link' : subPart}
            </a>
          );
        }
        return subPart;
      });
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    setMessages((prev) => [...prev, { text: userMessageText, sender: 'user' }]);
    setInput('');
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
      console.error('Webhook Error:', error);
      setMessages((prev) => [
        ...prev, 
        { text: "Pasensya, naay problema sa connection sa server. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false); 
    }
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes snowfall {
            0% { transform: translateY(-10px) translateX(0px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) translateX(20px) rotate(360deg); opacity: 0; }
          }
          .snowflake {
            position: absolute; top: -10px; color: white; user-select: none; z-index: 9999;
            animation-name: snowfall; animation-timing-function: linear; animation-iteration-count: infinite;
          }
        `}
      </style>

      <div className={`flex h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 font-sans overflow-hidden`}>
        
        <Snowfall />

        {/* SIDEBAR */}
        <aside className={`flex flex-col w-72 p-4 border-r ${currentTheme.sidebar} hidden md:flex z-30`}>
          <div className="flex items-center mb-8 px-2">
            <img src={PgasLogo} alt="PGAS Logo" className="w-12 h-12 mr-3 object-contain" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">PGAS Portal</h1>
              <p className="text-xs text-gray-500 font-medium">Chat Assistant</p>
            </div>
          </div>
          <button className={`w-full px-4 py-3 mb-6 text-sm font-semibold ${currentTheme.button} rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-all hover:scale-[1.02]`}>
            <span className="mr-2 text-lg">+</span> New Conversation
          </button>
          <div className="flex-1 overflow-y-auto">
              <h2 className="mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Recent History</h2>
              <div className="space-y-1">
              {recentChats.map((chat) => (
                  <button key={chat.id} className={`w-full px-3 py-2 text-sm text-left rounded-lg ${currentTheme.recentChat} transition-colors duration-200 truncate`}>
                  {chat.title}
                  </button>
              ))}
              </div>
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="flex flex-col flex-1 relative z-20">
          
          <header className={`flex items-center justify-between px-6 py-4 border-b ${currentTheme.header} z-20 relative`}>
            <div>
              <h2 className="text-lg font-bold text-emerald-500">PGAS Assistant</h2>
              <p className="text-xs text-gray-500">Official AI System</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className={`p-2.5 rounded-full ${currentTheme.iconBtn}`}>
                <img src={theme === 'dark' ? SunIcon : MoonIcon} alt="Theme" className="w-5 h-5" />
              </button>
              <div className="relative" ref={settingsRef}>
                <button onClick={toggleSettings} className={`p-2.5 rounded-full ${currentTheme.iconBtn}`}>
                   <img src={SettingsIcon} alt="Settings" className="w-5 h-5" />
                </button>
                {showSettings && (
                  <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border py-1 ring-1 ring-black ring-opacity-5 ${currentTheme.dropdown} z-50`}>
                    <div className="px-4 py-3 border-b border-gray-600/20">
                      <p className="text-sm font-medium">My Account</p>
                      <p className="text-xs opacity-70 truncate">user@pgas.gov.ph</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className={`flex-1 p-6 overflow-y-auto relative ${currentTheme.chatBg}`}>
            <div 
              className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
              style={{
                  backgroundImage: `url(${PgasLogo})`, 
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '40%', 
                  opacity: theme === 'dark' ? 0.15 : 0.08, 
              }}
            ></div>

            <div className="max-w-4xl mx-auto space-y-6 relative z-10">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <img src={PgasLogo} alt="Bot" className="w-10 h-10 rounded-full bg-white p-0.5 mb-1 border border-gray-200 shadow-sm object-contain" />
                  )}

                  {/* UPDATED: Message Bubble with proper list formatting */}
                  <div className={`px-5 py-3 max-w-[80%] text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? `rounded-2xl rounded-br-none ${currentTheme.sender}`
                        : `rounded-2xl rounded-bl-none ${currentTheme.bot}`
                    }`}
                  >
                    {formatMessage(msg.text)}
                  </div>
                  
                   {msg.sender === 'user' && (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 border border-emerald-500/20 ${currentTheme.userAvatarBg} ${currentTheme.userAvatarText}`}>
                        ME
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                 <div className="flex items-end gap-3 justify-start">
                    <img src={PgasLogo} alt="Bot" className="w-10 h-10 rounded-full bg-white p-0.5 mb-1 border border-gray-200 shadow-sm object-contain" />
                    <div className={`px-5 py-3 rounded-2xl rounded-bl-none ${currentTheme.bot}`}>
                       <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                       </div>
                    </div>
                 </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className={`p-4 ${currentTheme.header} border-t z-20 relative`}>
            <div className="max-w-4xl mx-auto relative">
              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your concern here..."
                  disabled={isLoading} 
                  className={`w-full pl-5 pr-14 py-4 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${currentTheme.input} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`absolute inset-y-0 right-2 my-auto w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 ${currentTheme.button} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <SendIcon />
                </button>
              </form>
              <p className="text-center text-[10px] text-gray-500 mt-2">
                  PGAS AI System powered by n8n.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

export default Chat;