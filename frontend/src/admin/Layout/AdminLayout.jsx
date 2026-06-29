import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

function AdminLayout() {

    return (

        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-content">

                <AdminNavbar />

                <main>

                    <Outlet />

                </main>

            </div>

        </div>

    );
}

export default AdminLayout;