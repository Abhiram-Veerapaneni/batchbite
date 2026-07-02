import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import "../styles/RegisterRestaurant.css";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterRestaurant() {

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [zones, setZones] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [zone, setZone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {

        const fetchZones = async () => {

            try {

                const res = await axios.get(`${API_URL}/zones`);

                setZones(res.data);

                if (res.data.length > 0) {
                    setZone(res.data[0]._id);
                }

            } catch (err) {
                setError("Failed to load zones");
            }
        };

        fetchZones();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {

            setError("");

            await axios.post(
                `${API_URL}/auth/restaurant/register`,
                {
                    name,
                    email,
                    phone,
                    password,
                    confirmPassword,
                    zone
                },
                {
                    withCredentials: true
                }
            );

            toast.success("Restaurant registered successfully!");

            navigate("/restaurant/dashboard");

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (

        <div className="rr-page">

            <div className="rr-card">

                <h1 className="rr-title">
                    Restaurant Registration
                </h1>

                <form
                    className="rr-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        className="rr-input"
                        type="text"
                        placeholder="Restaurant Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        className="rr-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className="rr-input"
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <select
                        className="rr-select"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
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

                    <input
                        className="rr-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        className="rr-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="rr-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="rr-btn"
                        type="submit"
                    >
                        Register
                    </button>

                </form>

                <p className="rr-footer">

                    Already have an account?{" "}

                    <Link
                        to="/"
                        className="rr-link"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default RegisterRestaurant;