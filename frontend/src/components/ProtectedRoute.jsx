import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function ProtectedRoute({ allowedRoles, children }) {

    const { account, accountType, loading } = useContext(AuthContext)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!account) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(accountType)) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;