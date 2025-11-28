import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import PgasLogo from '../assets/pgas.png'; 

function LoginPage({ onLoginSuccess }) {
  return (
    <>
      {/* --- CSS ANIMATIONS --- */}
      <style>
        {`
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
          .animate-led-spin {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%; 
            height: 200%;
            animation: spin-slow 4s linear infinite;
            background: conic-gradient(transparent, transparent, transparent, #34d399, #10b981); 
          }
        `}
      </style>

      {/* --- MAIN PAGE --- */}
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gray-900 font-sans">
        
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full animate-bg-gradient bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 z-0"></div>
        
        {/* Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* --- LOGIN CARD WRAPPER --- */}
        <div className="relative w-full max-w-md p-[2px] rounded-3xl animate-fade-in-up z-10 overflow-hidden">
            
            {/* ROTATING LED */}
            <div className="animate-led-spin"></div>

            {/* CARD CONTENT */}
            <div className="relative w-full h-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-8 shadow-2xl">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 opacity-50"></div>
              
              <div className="flex flex-col items-center">
                
                {/* Header */}
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-8 text-center">
                  Provincial Government of Agusan del Sur
                </span>

                {/* PGAS LOGO */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative group/logo">
                        <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover/logo:opacity-100 transition duration-500"></div>
                        <img src={PgasLogo} alt="PGAS Logo" className="relative w-24 h-24 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110" />
                    </div>
                </div>

                {/* Titles */}
                <div className="text-center mb-8 space-y-1">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                        PGAS Info Bot
                    </h1>
                    <p className="text-emerald-400 font-medium tracking-wide text-sm">
                        Official AI Assistant
                    </p>
                </div>

                {/* GOOGLE SIGN IN BUTTON */}
                <div className="mb-8">
                  <GoogleLogin
                    onSuccess={onLoginSuccess}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
                

                {/* --- BAG-ONG SECTION: WHAT CAN I DO? --- */}
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-gray-700"></div>
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">I can help you with</span>
                        <div className="h-px flex-1 bg-gray-700"></div>
                    </div>

                    <div className="space-y-3">
                        {/* Item 1 */}
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                            <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-200">Instant System Support</h3>
                                <p className="text-[10px] text-gray-500">Login issues, Account resets</p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                             <div className="p-2 bg-blue-500/10 rounded-full text-blue-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-200">Navigation Guide</h3>
                                <p className="text-[10px] text-gray-500">Locate HRIS, SPMS, & DGSIGN</p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                             <div className="p-2 bg-purple-500/10 rounded-full text-purple-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-200">24/7 Automated Assistance</h3>
                                <p className="text-[10px] text-gray-500">Always available to help</p>
                            </div>
                        </div>
                    </div>
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