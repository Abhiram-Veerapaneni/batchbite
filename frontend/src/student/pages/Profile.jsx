import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Navigate, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

function Profile() {

    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully!");
        navigate("/");
    }


    return (
        <div className="profile-page">

            <div className="profile-container">

                <img
                    src={
                        user?.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="Profile"
                    className="profile-image"
                />

                <h1 className="profile-name">
                    {user?.name}
                </h1>

                <p className="profile-email">
                    {user?.email}
                </p>

                <p className="profile-university">
                    University: {user?.university}
                </p>

                <p className="profile-role">
                    Role: {user?.role}
                </p>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Profile;