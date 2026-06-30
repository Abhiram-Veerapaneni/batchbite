import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./student/pages/Login";
import Register from "./student/pages/Register";

import Dashboard from "./student/pages/Dashboard";
import Restaurants from "./student/pages/Restaurants";
import Cart from "./student/pages/Cart";
import RestaurantDetails from "./student/pages/RestaurantDetails";
import FoodDetails from "./student/pages/FoodDetails";
import Profile from "./student/pages/Profile";
import OrderHistory from "./student/pages/OrderHistory";

import MainLayout from "./student/components/MainLayout";

import { Toaster } from "react-hot-toast";
import SlotDashboard from "./student/pages/SlotDashboard";


import ProtectedRoute from "./components/ProtectedRoute";

// admin imports
import AdminLayout from "./admin/Layout/AdminLayout";
import BatchManagement from "./admin/pages/BatchManagement";
import AgentManagement from "./admin/pages/AgentManagement";
import RestaurantManagement from "./admin/pages/RestaurantManagement";
import UserManagement from "./admin/pages/UserManagement";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Analytics from "./admin/pages/Analytics";


// Agent imports
import AgentLogin from "./agent/pages/AgentLogin";
import AgentProtectedRoute from "./components/AgentProtectedRoute";
import AgentDashboard from "./agent/pages/AgentDashboard";
import DeliveryHistory from "./agent/pages/DeliveryHistory";
import AgentProfile from "./agent/pages/AgentProfile";
import AgentLayout from "./agent/layouts/AgentLayout";



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


                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]} >
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route path="dashboard" element={<AdminDashboard />} />

                    <Route path="batches" element={<BatchManagement />} />

                    <Route path="agents" element={<AgentManagement />} />

                    <Route path="restaurants" element={<RestaurantManagement />} />

                    <Route path="users" element={<UserManagement />} />

                    <Route path="analytics" element={<Analytics />} />

                </Route>

                <Route path="/agent-login" element={<AgentLogin />} />
                
                <Route
                    path="/agent"
                    element={ <AgentProtectedRoute>
                        <AgentLayout />
                    </AgentProtectedRoute> }    
                >

                    <Route path="dashboard" element={<AgentDashboard /> } />
                    <Route path="delivery-history" element={<DeliveryHistory />} />
                    <Route path="profile" element={<AgentProfile />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;