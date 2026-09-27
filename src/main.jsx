import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={googleClientId}>
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
);
