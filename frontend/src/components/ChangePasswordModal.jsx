import { useState } from "react";
import toast from "react-hot-toast";

import "../styles/ChangePasswordModal.css";

function ChangePasswordModal({
    isOpen,
    onClose,
    onChangePassword
}) {

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleClose = () => {

        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        onClose();

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (form.newPassword.length < 6) {
            return toast.error(
                "Password must be at least 6 characters."
            );
        }

        if (form.newPassword !== form.confirmPassword) {
            return toast.error(
                "Passwords do not match."
            );
        }

        try {

            setLoading(true);

            await onChangePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });

            toast.success(
                "Password updated successfully."
            );

            handleClose();

        } catch (error) {

            toast.error(
                error?.message ||
                "Failed to update password."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="cpm-overlay">

            <div className="cpm-modal">

                <div className="cpm-header">

                    <h2>
                        Change Password
                    </h2>

                    <button
                        className="cpm-close"
                        onClick={handleClose}
                    >
                        ✕
                    </button>

                </div>

                <form
                    className="cpm-form"
                    onSubmit={handleSubmit}
                >

                    <div className="cpm-group">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="cpm-group">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="cpm-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="cpm-actions">

                        <button
                            type="button"
                            className="cpm-cancel"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cpm-save"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Updating..."
                                    : "Update Password"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default ChangePasswordModal;