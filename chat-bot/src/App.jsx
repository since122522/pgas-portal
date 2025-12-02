import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import LandingPage from './components/LandingPage';
import HrisLoginPage from './components/HrisLoginPage';
import HrisChat from './components/HrisChat';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'hris-login', 'hris-chat'

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Credential Response:", credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded User:", decoded);
    setUser(decoded);
    setCurrentPage('hris-chat');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (currentPage === 'hris-chat' && user) {
      return <HrisChat user={user} handleLogout={handleLogout} />;
    }
    if (currentPage === 'hris-login') {
      return <HrisLoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    return <LandingPage navigateTo={navigateTo} />;
  };

  return (
    <div className="font-sans">
      {renderPage()}
    </div>
  );
}

export default App;