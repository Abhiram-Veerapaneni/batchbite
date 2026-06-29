import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout() {
    return (
        <>
            <Navbar />

            <main className="page-container">
                <Outlet />
            </main>
        </>
    );
}

export default MainLayout;



// App
// ├── Auth Layout
// │   ├── Login
// │   └── Register
// │
// └── Main Layout
//     ├── Navbar
//     ├── Dashboard
//     ├── Restaurants
//     ├── Cart
//     ├── Food Details
//     ├── Profile
//     └── Order History