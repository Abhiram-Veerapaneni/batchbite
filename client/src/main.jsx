import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";
import "./styles/pages.css";
import "./styles/components.css";

createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <App />
  </AuthProvider>
)
