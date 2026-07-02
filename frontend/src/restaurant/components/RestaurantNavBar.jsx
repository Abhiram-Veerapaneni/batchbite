import { NavLink } from "react-router-dom";

import "../styles/RestaurantNavbar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function RestaurantNavbar() {

    const {account} = useContext(AuthContext);

    const getClassName = ({ isActive }) =>
        isActive ? "rn-link rn-active" : "rn-link";

    return (
        <nav className="rn-navbar">

            <div className="rn-logo">
                {account.name}
            </div>

            <div className="rn-links">

                <NavLink
                    to="/restaurant/dashboard"
                    className={getClassName}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/restaurant/menu"
                    className={getClassName}
                >
                    Menu
                </NavLink>

                <NavLink
                    to="/restaurant/orders"
                    className={getClassName}
                >
                    Orders
                </NavLink>

                <NavLink
                    to="/restaurant/profile"
                    className={getClassName}
                >
                    Profile
                </NavLink>

            </div>

        </nav>
    );
}

export default RestaurantNavbar;