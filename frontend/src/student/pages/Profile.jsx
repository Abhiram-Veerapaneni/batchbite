import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getProfile,
    updateProfile,
    changePassword
} from "../services/StudentServices.js";

import { getZones } from "../../services/OtherServices.js";

import ChangePasswordModal from "../../components/ChangePasswordModal";

import { AuthContext } from "../../context/AuthContext";

// import "../styles/StudentProfile.css";

function Profile() {

    const { logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const [zones, setZones] = useState([]);

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        university: "",
        addressLine: "",
        zone: "",
        role: "",
        image: null
    });

    const [preview, setPreview] = useState("");

    const fetchProfile = async () => {

        try {

            const [profile, zoneData] = await Promise.all([
                getProfile(),
                getZones()
            ]);

            setZones(zoneData);

            setForm({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                university: profile.university,
                addressLine: profile.address?.addressLine || "",
                zone: profile.address?.zone || "",
                role: profile.role,
                image: null
            });

            setPreview(profile.profileImage);

        } catch (error) {

            toast.error(
                error?.message ||
                "Failed to load profile."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setForm(prev => ({
            ...prev,
            image: file
        }));

        setPreview(
            URL.createObjectURL(file)
        );

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await updateProfile(form);

            toast.success(
                "Profile updated successfully."
            );

            fetchProfile();

        } catch (error) {

            toast.error(
                error?.message ||
                "Failed to update profile."
            );

        }

    };

    if (loading) {

        return (
            <div className="rp-loading">
                Loading profile...
            </div>
        );

    }

        return (

        <div className="rp-page">

            <div className="rp-header">

                <div className="rp-header-left">

                    <h1 className="rp-title">
                        Student Profile
                    </h1>

                    <p className="rp-subtitle">
                        Manage your account information
                    </p>

                </div>

                <button
                    className="rp-logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

            <form
                className="rp-card"
                onSubmit={handleSubmit}
            >

                <div className="rp-image-section">

                    <div className="rp-image-wrapper">

                        {preview ? (

                            <img
                                src={preview}
                                alt="Profile"
                                className="rp-image"
                            />

                        ) : (

                            <div className="rp-image-placeholder">
                                No Image
                            </div>

                        )}

                    </div>

                    <label className="rp-upload">

                        Change Image

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />

                    </label>

                </div>

                <div className="rp-form">

                    <div className="rp-group">

                        <label className="rp-label">
                            Name
                        </label>

                        <input
                            className="rp-input"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="rp-group">

                        <label className="rp-label">
                            Email
                        </label>

                        <input
                            className="rp-input"
                            value={form.email}
                            readOnly
                        />

                    </div>

                    <div className="rp-group">

                        <label className="rp-label">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            className="rp-input"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="rp-group">

                        <label className="rp-label">
                            University
                        </label>

                        <input
                            className="rp-input"
                            name="university"
                            value={form.university}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="rp-group">

                        <label className="rp-label">
                            Address Line
                        </label>

                        <input
                            className="rp-input"
                            name="addressLine"
                            value={form.addressLine}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="rp-group">

                        <label className="rp-label">
                            Zone
                        </label>

                        <select
                            className="rp-input"
                            name="zone"
                            value={form.zone}
                            onChange={handleChange}
                            required
                        >

                            {zones.map(zone => (

                                <option
                                    key={zone._id}
                                    value={zone._id}
                                >
                                    {zone.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="rp-group">

                        <label className="rp-label">
                            Role
                        </label>

                        <input
                            className="rp-input"
                            value={form.role}
                            readOnly
                        />

                    </div>

                </div>

                <div className="rp-actions">

                    <button
                        type="button"
                        className="rp-password-btn"
                        onClick={() =>
                            setShowPasswordModal(true)
                        }
                    >
                        Change Password
                    </button>

                    <button
                        type="submit"
                        className="rp-save-btn"
                    >
                        Save Changes
                    </button>

                </div>

            </form>

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() =>
                    setShowPasswordModal(false)
                }
                onChangePassword={changePassword}
            />

        </div>

    );

}

export default Profile;