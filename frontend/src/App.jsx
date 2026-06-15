import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import Cart from "./pages/Cart";
import RestaurantDetails from "./pages/RestaurantDetails";
import FoodDetails from "./pages/FoodDetails";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";

import MainLayout from "./components/MainLayout";

import { Toaster } from "react-hot-toast";
import SlotDashboard from "./pages/SlotDashboard";


function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" />

            <Routes>
                {/* Pages WITHOUT Navbar */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Pages WITH Navbar */}
                <Route element={<MainLayout />}>

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/restaurants" element={<Restaurants />} />

                    <Route path="/restaurants/:id" element={<RestaurantDetails />} />
                    <Route path="/food/:id" element={<FoodDetails />} />

                    <Route path="/cart" element={<Cart />} />

                    <Route path="/profile" element={<Profile />} />

                    <Route path="/order-history" element={<OrderHistory />} />

                    <Route path="/slots" element={<SlotDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;