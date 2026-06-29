import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-logo">
                <NavLink to="/dashboard">
                    BatchBite
                </NavLink>
            </div>

            <div className="navbar-links">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Cart
                </NavLink>

                <NavLink
                    to="/order-history"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    My Orders
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Profile
                </NavLink>

            </div>

        </nav>
    );
}

export default Navbar;