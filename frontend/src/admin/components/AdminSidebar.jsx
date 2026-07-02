import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AdminSidebar() {

    const { logout } = useContext(AuthContext);

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
            <NavLink to="/" onClick={logout}>
               Logout
            </NavLink>
            
        </aside>

    );
}

export default AdminSidebar;