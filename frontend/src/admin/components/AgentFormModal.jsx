import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { createAgent, updateAgent } from "../services/agentService";

const AVAILABLE_REGIONS = [
    "North",
    "South",
    "East",
    "West",
    "Hostels",
    "Academic",
    "Library",
    "Food Court"
];

function AgentFormModal({ agent, onClose, onSaved }) {

    const isEdit = !!agent;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [zones, setZones] = useState([]);
    const [status, setStatus] = useState("available");

    const [saving, setSaving] = useState(false);

    useEffect(() => {

        if (!agent) return;

        setName(agent.name);
        setPhone(agent.phone);
        setEmail(agent.email);
        setZones(agent.zones || []);
        setStatus(agent.status);

    }, [agent]);

    const toggleRegion = (zone) => {

        if (zones.includes(zone)) {

            setZones(
                zones.filter(r => r !== zone)
            );

        } else {

            setZones([
                ...zones,
                zone
            ]);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name.trim()) {

            toast.error("Enter agent name");
            return;

        }

        if (!email.trim()) {

            toast.error("Enter agent email");
            return;

        }

        if (password.trim().length < 1) {

            toast.error("Password is too small");
            return;
        }

        if (password.trim() !== confirmPassword.trim()) {
            toast.error("Passwords do not too match");
            return;
        }

        if (!phone.trim()) {

            toast.error("Enter phone number");
            return;

        }

        if (zones.length === 0) {

            toast.error("Select at least one zone");
            return;

        }

        try {

            setSaving(true);

            const payload = {

                name,
                email,
                password,
                phone,
                zones

            };

            if (isEdit) {

                payload.status = status;

                await updateAgent(
                    agent._id,
                    payload
                );

                toast.success(
                    "Agent updated successfully"
                );

            } else {

                await createAgent(payload);

                toast.success(
                    "Agent created successfully"
                );

            }

            onSaved();

        } catch (err) {

            console.error(err);

            toast.error(
                err?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };

    return (

        <div className="agent-modal-overlay">

            <div className="agent-modal">

                <div className="agent-modal-header">

                    <h2 className="agent-modal-title">

                        {isEdit ? "Edit Agent" : "Add New Agent"}

                    </h2>

                    <button
                        className="agent-modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <form
                    className="agent-form"
                    onSubmit={handleSubmit}
                >

                    <div className="agent-modal-body">

                        <div className="agent-form-group">

                            <label className="agent-form-label">

                                Agent Name

                            </label>

                            <input
                                className="agent-input"
                                type="text"
                                placeholder="Enter agent name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />

                        </div>
                        
                        <div className="agent-form-group">

                            <label className="agent-form-label">

                                Agent Email

                            </label>

                            <input
                                className="agent-input"
                                type="text"
                                placeholder="Enter agent email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>
                        {
                            !isEdit &&
                            <>
                                <div className="agent-form-group">

                                    <label className="agent-form-label">

                                        Password

                                    </label>

                                    <input
                                        className="agent-input"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="agent-form-group">

                                    <label className="agent-form-label">

                                        Confirm Password
                                    </label>

                                    <input
                                        className="agent-input"
                                        type="text"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />

                                </div>
                            </>
                        }

                        <div className="agent-form-group">

                            <label className="agent-form-label">

                                Phone Number

                            </label>

                            <input
                                className="agent-input"
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                            />

                        </div>

                        <div className="agent-form-group">

                            <label className="agent-form-label">

                                Working Zones

                            </label>

                            <div className="agent-zone-grid">

                                {

                                    AVAILABLE_REGIONS.map(zone => (

                                        <label
                                            key={zone}
                                            className="agent-zone-option"
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    zones.includes(zone)
                                                }
                                                onChange={() =>
                                                    toggleRegion(zone)
                                                }
                                            />

                                            <span>

                                                {zone}

                                            </span>

                                        </label>

                                    ))

                                }

                            </div>

                        </div>

                        {

                            isEdit &&

                            <div className="agent-form-group">

                                <label className="agent-form-label">

                                    Status

                                </label>

                                <select
                                    className="agent-status-select"
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                >

                                    <option value="available">

                                        Available

                                    </option>

                                    <option value="busy">

                                        Busy

                                    </option>

                                    <option value="offline">

                                        Offline

                                    </option>

                                </select>

                            </div>

                        }

                    </div>

                    <div className="agent-modal-footer">

                        <button
                            type="button"
                            className="agent-cancel-btn"
                            onClick={onClose}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="agent-save-btn"
                            disabled={saving}
                        >

                            {

                                saving

                                    ? "Saving..."

                                    : isEdit

                                        ? "Update Agent"

                                        : "Create Agent"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AgentFormModal;