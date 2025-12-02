import React from 'react';
import PgasLogo from '../assets/pgas.png'; 
import HrisLogo from '../assets/hris.png';
import SpmsLogo from '../assets/pimo.png';
import DgsignLogo from '../assets/pgas.png'; 

function LandingPage({ navigateTo }) {
  const handleLogin = (system) => {
    if (system === 'HRIS') {
      navigateTo('hris-login');
    } else {
      console.log(`Login attempt for ${system}`);
      // Handle other systems if needed
    }
  };

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
          @keyframes title-pulse {
            0%, 100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
            50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.7); }
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
          .animate-title-pulse {
            animation: title-pulse 5s ease-in-out infinite;
          }
          .card-glow {
            transition: box-shadow 0.3s ease-in-out;
          }
          .card-glow:hover {
            box-shadow: 0 0 25px rgba(52, 211, 153, 0.5);
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
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight animate-title-pulse">
                        PGAS Info Bot
                    </h1>
                    <p className="text-emerald-400 font-medium tracking-wide text-sm">
                        Official AI Assistant
                    </p>
                </div>

                {/* --- System Selection --- */}
                <div className="w-full mt-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-px flex-1 bg-gray-700"></div>
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Select a System</span>
                        <div className="h-px flex-1 bg-gray-700"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        {/* HRIS Card */}
                        <div onClick={() => handleLogin('HRIS')} className="card-glow cursor-pointer p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:bg-gray-800 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 group flex flex-col justify-between">
                            <div>
                                <img src={HrisLogo} alt="HRIS Logo" className="w-16 h-16 mx-auto mb-4 object-contain transition-transform duration-300 group-hover:scale-110"/>
                                <h3 className="font-bold text-lg text-gray-200">HRIS</h3>
                                <p className="text-xs text-gray-500 mb-4">Human Resource Info System</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Proceed to Login &rarr;</span>
                        </div>
                        {/* SPMS Card */}
                        <div onClick={() => handleLogin('SPMS')} className="card-glow cursor-pointer p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:bg-gray-800 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 group flex flex-col justify-between">
                            <div>
                                <img src={SpmsLogo} alt="SPMS Logo" className="w-16 h-16 mx-auto mb-4 object-contain transition-transform duration-300 group-hover:scale-110"/>
                                <h3 className="font-bold text-lg text-gray-200">SPMS</h3>
                                <p className="text-xs text-gray-500 mb-4">Strategic Performance Mgt. System</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Proceed to Login &rarr;</span>
                        </div>
                        {/* DGSIGN Card */}
                        <div onClick={() => handleLogin('DGSIGN')} className="card-glow cursor-pointer p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:bg-gray-800 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 group flex flex-col justify-between">
                            <div>
                                <img src={DgsignLogo} alt="DGSIGN Logo" className="w-16 h-16 mx-auto mb-4 object-contain transition-transform duration-300 group-hover:scale-110"/>
                                <h3 className="font-bold text-lg text-gray-200">DGSIGN</h3>
                                <p className="text-xs text-gray-500 mb-4">Digital Signature</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Proceed to Login &rarr;</span>
                        </div>
                    </div>
                </div>

              </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-xs font-medium tracking-wide animate-fade-in-up">
          &copy; 2.25 Provincial Government of Agusan del Sur
        </div>

      </div>
    </>
  );
}

export default LandingPage;