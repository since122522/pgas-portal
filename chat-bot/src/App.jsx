import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Chat from './components/Chat';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage handleLogin={handleLogin} />
      ) : (
        <Chat handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
