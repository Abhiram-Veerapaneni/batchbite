import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";

function AgentProfile() {

    const { account, logout } = useContext(AuthContext);
    const agent = account;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Agent logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    return (
        <div className="agent-profile-page">

            <div className="agent-profile-card">

                <div className="agent-profile-header">

                    <div className="agent-profile-avatar">
                        {agent?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1 className="agent-profile-title">
                            Agent Profile
                        </h1>

                        <p className="agent-profile-subtitle">
                            View your account information
                        </p>
                    </div>

                </div>

                <div className="agent-profile-details">

                    <div className="agent-profile-row">
                        <span className="agent-profile-label">
                            Name
                        </span>

                        <span className="agent-profile-value">
                            {agent.name}
                        </span>
                    </div>

                    <div className="agent-profile-row">
                        <span className="agent-profile-label">
                            Email
                        </span>

                        <span className="agent-profile-value">
                            {agent.email}
                        </span>
                    </div>

                    <div className="agent-profile-row">
                        <span className="agent-profile-label">
                            Phone
                        </span>

                        <span className="agent-profile-value">
                            {agent.phone}
                        </span>
                    </div>

                    <div className="agent-profile-row">
                        <span className="agent-profile-label">
                            Status
                        </span>

                        <span
                            className={`agent-profile-status agent-profile-status-${agent.status}`}
                        >
                            {agent.status}
                        </span>
                    </div>

                    <div className="agent-profile-row">
                        <span className="agent-profile-label">
                            Assigned Zones
                        </span>

                        <div className="agent-profile-zones">

                            {agent.zones?.length > 0 ? (
                                agent.zones.map(zone => (
                                    <span
                                        key={zone}
                                        className="agent-profile-zone"
                                    >
                                        {zone}
                                    </span>
                                ))
                            ) : (
                                <span className="agent-profile-value">
                                    No zones assigned
                                </span>
                            )}

                        </div>
                    </div>

                </div>

                <div className="agent-profile-actions">

                    <button
                        className="agent-profile-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AgentProfile;