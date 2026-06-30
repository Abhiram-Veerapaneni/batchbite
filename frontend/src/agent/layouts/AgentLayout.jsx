import { Outlet } from "react-router-dom";

import AgentNavbar from "../components/AgentNavbar";

function AgentLayout() {

    return (
        <div className="agent-layout">

            <AgentNavbar />

            <main className="agent-main">
                <Outlet />
            </main>

        </div>
    );
}

export default AgentLayout;