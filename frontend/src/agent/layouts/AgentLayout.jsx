import { Outlet } from "react-router-dom";

function AgentLayout() {
    return (
        <div>
            <header>
                <h2>Agent Panel</h2>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AgentLayout;