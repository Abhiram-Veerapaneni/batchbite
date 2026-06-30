import {useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AgentAuthContext } from "../context/AgentAuthContext";

function AgentProtectedRoute({ children }) {

    const { agent, loading } = useContext(AgentAuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!agent) {
        return <Navigate to="/agent-login" replace />;
    }

    return children;
}

export default AgentProtectedRoute;