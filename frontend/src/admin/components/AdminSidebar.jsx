import { NavLink } from "react-router-dom";

function AdminSidebar() {

    return (

        <aside className="admin-sidebar">

            <h2>BatchBite Admin</h2>

            <nav>

                <NavLink to="/admin/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/admin/batches">
                    Batches
                </NavLink>

                <NavLink to="/admin/agents">
                    Agents
                </NavLink>

                <NavLink to="/admin/restaurants">
                    Restaurants
                </NavLink>

                <NavLink to="/admin/users">
                    Users
                </NavLink>

                <NavLink to="/admin/analytics">
                    Analytics
                </NavLink>

            </nav>

        </aside>

    );
}

export default AdminSidebar;