import { NavLink } from "react-router-dom";

function AgentNavbar() {

    return (
        <nav className="agent-navbar">

            <div className="agent-logo">
                BatchBite Agent
            </div>

            <div className="agent-nav-links">

                <NavLink
                    to="/agent/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/agent/delivery-history"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Delivery History
                </NavLink>

                <NavLink
                    to="/agent/profile"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Profile
                </NavLink>

            </div>

        </nav>
    );
}

export default AgentNavbar;