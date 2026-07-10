import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="553316521983-un50oi8nqpphfd4c4kcj7bfq9rms4v3d.apps.googleusercontent.com">
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
);
