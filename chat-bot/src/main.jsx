import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="814270586876-18b9o16kv2g8iikvghrsqcsit8s4sakb.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);