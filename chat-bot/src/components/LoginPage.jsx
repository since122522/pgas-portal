import React from 'react';
import PgasLogo from '../assets/pgas.png'; 
import PimoLogo from '../assets/pimo.png'; 

function LoginPage({ handleLogin }) {
  return (
    <>
      {/* --- CSS ANIMATIONS --- */}
      <style>
        {`
          /* Standard Animations */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes backgroundMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* LED SPIN ANIMATION */
          @keyframes spin-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-bg-gradient { 
            background-size: 200% 200%; 
            animation: backgroundMove 15s ease infinite; 
          }
          
          /* Class para sa nagtuyok nga suga */
          .animate-led-spin {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%; /* Kinahanglan dako ni para dili makita ang edges inig tuyok */
            height: 200%;
            animation: spin-slow 4s linear infinite;
            /* Ang suga: Transparent -> Emerald/Green (PGAS Color) */
            background: conic-gradient(transparent, transparent, transparent, #34d399, #10b981); 
          }
        `}
      </style>

      {/* --- MAIN PAGE --- */}
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gray-900 font-sans">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full animate-bg-gradient bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 z-0"></div>
        
        {/* Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* --- LOGIN CARD WRAPPER --- */}
        {/* Relative container para sa card ug sa LED border */}
        <div className="relative w-full max-w-md p-[2px] rounded-3xl animate-fade-in-up z-10 overflow-hidden">
            
            {/* 1. THE ROTATING LED (Behind the card) */}
            <div className="animate-led-spin"></div>

            {/* 2. THE CARD CONTENT (On top of the LED) */}
            {/* bg-gray-900 ensures the middle of the LED is covered, leaving only the border visible */}
            <div className="relative w-full h-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-8 shadow-2xl">
              
              {/* Top Decorative Line (Static) */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 opacity-50"></div>
              
              <div className="flex flex-col items-center">
                
                {/* Header Text */}
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-8 text-center">
                  Provincial Government of Agusan del Sur
                </span>

                {/* --- DUAL LOGO SECTION --- */}
                <div className="flex items-center justify-center gap-6 mb-8">
                    {/* PGAS LOGO */}
                    <div className="relative group/logo">
                        <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-lg opacity-0 group-hover/logo:opacity-100 transition duration-500"></div>
                        <img src={PgasLogo} alt="PGAS Logo" className="relative w-20 h-20 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110" />
                    </div>

                    {/* Divider */}
                    <div className="h-12 w-px bg-gray-600 opacity-50"></div>

                    {/* PIMO LOGO */}
                    <div className="relative group/logo">
                        <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-lg opacity-0 group-hover/logo:opacity-100 transition duration-500"></div>
                        <img src={PimoLogo} alt="PIMO Logo" className="relative w-20 h-20 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110" />
                    </div>
                </div>

                {/* Titles */}
                <div className="text-center mb-8 space-y-1">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                        PGAS Info Bot
                    </h1>
                    <p className="text-emerald-400 font-medium tracking-wide text-sm">
                        Smart PIMO Assistant
                    </p>
                </div>

                {/* Button */}
                <button
                    onClick={handleLogin}
                    className="group relative w-full py-4 mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/20"
                >
                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <span className="relative flex items-center justify-center gap-2">
                        Start Conversation
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </span>
                </button>

                {/* Footer Divider */}
                <div className="relative w-full flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600/50"></div>
                    </div>
                    <span className="relative z-10 bg-gray-800 px-4 text-xs text-gray-500 uppercase tracking-widest rounded">
                        Integrated Systems
                    </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-3 w-full">
                    {['HRIS', 'SPMS', 'DGSIGN'].map((system) => (
                        <span key={system} className="px-4 py-1.5 text-xs font-semibold text-gray-400 bg-gray-800 rounded-full border border-gray-700 hover:bg-gray-700 hover:text-white hover:border-emerald-500/50 cursor-pointer transition-all duration-300">
                            {system}
                        </span>
                    ))}
                </div>

              </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-xs font-medium tracking-wide animate-fade-in-up">
          &copy; 2025 Provincial Government of Agusan del Sur
        </div>

      </div>
    </>
  );
}

export default LoginPage;