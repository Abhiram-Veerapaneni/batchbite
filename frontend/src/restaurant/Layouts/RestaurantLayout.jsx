import { Outlet } from "react-router-dom";

import RestaurantNavBar from "../components/RestaurantNavBar";

import "../styles/RestaurantLayout.css";

function RestaurantLayout() {

    return (
        <div className="rl-layout">

            <RestaurantNavBar />

            <main className="rl-main">
                <Outlet />
            </main>

        </div>
    );
}

export default RestaurantLayout;