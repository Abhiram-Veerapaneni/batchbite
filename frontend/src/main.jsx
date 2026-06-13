import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext.jsx';

import { Toaster } from "react-hot-toast";

import "./styles/global.css";
import "./styles/pages.css"
import "./styles/navbar.css";
import "./styles/dashboard.css";
import "./styles/foodCard.css";
import "./styles/foodDetails.css";
import "./styles/restaurantDetails.css";
import "./styles/cart.css";
import "./styles/profile.css";
import "./styles/orderHistory.css";

createRoot(document.getElementById('root')).render(

  <CartProvider>
    <AuthProvider>
            <App />
    </AuthProvider>
</CartProvider>
)
