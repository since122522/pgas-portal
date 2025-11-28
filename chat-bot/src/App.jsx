import { useState } from 'react';
// Run: npm install jwt-decode
import { jwtDecode } from "jwt-decode";
import LoginPage from './components/LoginPage';
import Chat from './components/Chat';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Credential Response:", credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded User:", decoded);
    setUser(decoded); // Save the decoded user info
  };

  const handleLogout = () => {
    setUser(null); // Clear user to return to Login
  };

  return (
    <div className="font-sans">
      {!user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        // Pass the full user object to the Chat component
        <Chat user={user} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;