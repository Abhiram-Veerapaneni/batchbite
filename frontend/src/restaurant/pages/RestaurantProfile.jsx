import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getRestaurantProfile,
    updateRestaurantProfile
} from "../services/RestaurantServices";

import ChangePasswordModal from "../components/ChangePasswordModal";

import "../styles/RestaurantProfile.css";
import { AuthContext } from "../../context/AuthContext";

function RestaurantProfile() {

    const { logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        zone: "",
        image: null
    });

    const [preview, setPreview] = useState("");

    const fetchProfile = async () => {

        try {

            const data = await getRestaurantProfile();

            setForm({
                name: data.name,
                email: data.email,
                phone: data.phone,
                zone: data.zone?.name || "",
                image: null
            });

            setPreview(data.image);

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

            await updateRestaurantProfile(form);

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
                        Restaurant Profile
                    </h1>

                    <p className="rp-subtitle">
                        Manage your restaurant information
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
                                alt="Restaurant"
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
                            onChange={handleImageChange}
                            hidden
                        />

                    </label>

                </div>

                <div className="rp-form">

                    <div className="rp-group">

                        <label className="rp-label">
                            Restaurant Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            className="rp-input"
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
                            type="email"
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
                            Delivery Zone
                        </label>

                        <input
                            type="text"
                            className="rp-input"
                            value={form.zone}
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
            />
        </div>
    );
}
export default RestaurantProfile;
