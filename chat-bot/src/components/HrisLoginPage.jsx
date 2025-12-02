import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import HrisLogo from '../assets/hris.png';

function HrisLoginPage({ onLoginSuccess }) {
  return (
    <>
      {/* --- CSS ANIMATIONS (can be refactored into a separate CSS file) --- */}
      <style>
        {`
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes backgroundMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-bg-gradient { background-size: 200% 200%; animation: backgroundMove 15s ease infinite; }
        `}
      </style>

      {/* --- MAIN PAGE --- */}
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gray-900 font-sans">
        
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full animate-bg-gradient bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 z-0"></div>
        
        {/* Blobs */}
        <div className="absolute top-10 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* --- LOGIN CARD WRAPPER --- */}
        <div className="relative w-full max-w-sm p-8 bg-gray-900/80 backdrop-blur-xl border border-gray-700/30 rounded-3xl shadow-2xl animate-fade-in-up z-10">
              
              <div className="flex flex-col items-center">
                
                {/* Header */}
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-4 text-center">
                  Human Resource Information System
                </span>

                {/* HRIS LOGO */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative group/logo">
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover/logo:opacity-100 transition duration-500"></div>
                        <img src={HrisLogo} alt="HRIS Logo" className="relative w-28 h-28 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110" />
                    </div>
                </div>

                {/* Titles */}
                <div className="text-center mb-8 space-y-1">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">
                        HRIS Chatbot
                    </h1>
                    <p className="text-blue-400 font-medium tracking-wide text-sm">
                        Please sign in to continue
                    </p>
                </div>

                {/* GOOGLE SIGN IN BUTTON */}
                <div className="mb-4">
                  <GoogleLogin
                    onSuccess={onLoginSuccess}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                    theme="filled_blue"
                    size="large"
                    shape="pill"
                  />
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

export default HrisLoginPage;