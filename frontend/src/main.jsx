import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext.jsx';


import { Toaster } from "react-hot-toast";

import "./student/styles/global.css";
import "./student/styles/navbar.css";
import "./student/styles/dashboard.css";
import "./student/styles/foodCard.css";
import "./student/styles/foodDetails.css";
import "./student/styles/restaurantDetails.css";
import "./student/styles/cart.css";
import "./student/styles/profile.css";
import "./student/styles/orderHistory.css";
import "./student/styles/slotDashboard.css"
import "./student/styles/liveBatchCard.css";

import "./admin/styles/Global.css"
import "./admin/styles/BatchManagement.css"
import "./admin/styles/AdminLayout.css"
import "./admin/styles/RestaurantManagement.css"
import "./admin/styles/AgentManagement.css"


import "./agent/styles/AgentLayout.css"
import "./agent/styles/AgentNavbar.css"
import "./agent/styles/DeliveryHistory.css"
import "./agent/styles/AgentProfile.css"
import "./agent/styles/AgentDashboard.css"

import "./styles/Profile.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "not-configured";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={googleClientId}>
        <CartProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </CartProvider>
    </GoogleOAuthProvider>
);
