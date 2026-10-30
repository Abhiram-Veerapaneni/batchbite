import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLoginAccount } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";

import toast from "react-hot-toast";
import axios from "axios";

import "../styles/Register.css";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {

    const navigate = useNavigate();
    const { refreshAccount } = useContext(AuthContext);
    const [error, setError] = useState("");

    // name, email, university, role, password

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [university, setUniversity] = useState("VIT AP");
    const [address, setAddress] = useState({
        addressLine: "",
        zone: ""
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [zones, setZones] = useState([]);

    useEffect(() => {

        const fetchZones = async () => {
            try {
                const res = await axios.get(`${API_URL}/zones`);
                setZones(res.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Registration failed");
            }
        }

        fetchZones();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const registerData = {
            name,
            email,
            phone,
            password,
            confirmPassword,
            university,
            address
        };

        // backend API call
        try {
            setError("");

            await registerUser(registerData);
            await refreshAccount();

            toast.success("Registered successfully!");

            navigate("/dashboard");

        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed");
        }
    };

    const handleGoogleSuccess = async (credential) => {
        try {
            setError("");
            await googleLoginAccount(credential, "student");
            await refreshAccount();
            toast.success("Registered and logged in with Google!");
            navigate("/dashboard");
        } catch (err) {
            setError(err?.response?.data?.message || "Google sign-up failed");
        }
    };

    const handleGoogleError = (errorMessage) => {
        setError(errorMessage || "Google sign-up was unsuccessful. Please try again.");
    };

    return (
        <div className="register-page">
            <div className="register-container">

                <h1 className="register-title">
                    BatchBite Registration
                </h1>

                <form className="register-form" onSubmit={handleSubmit}>

                    <input
                        className="register-input"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="register-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        className="register-select"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                    >
                        <option value="VIT AP">VIT AP</option>
                        <option value="KL University">KL University</option>
                        <option value="SRM AP">SRM AP</option>
                    </select>

                    <input
                        className="register-input"
                        type="text"
                        placeholder="Address Line"
                        value={address.addressLine}
                        onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    />

                    <select
                        className="register-select"
                        value={address.zone}
                        onChange={(e) => setAddress({ ...address, zone: e.target.value })}
                    >

                        {
                            zones.map((zone) => {
                                return (
                                    <option key={zone._id} value={zone._id}>
                                        {zone.name}
                                    </option>
                                );
                            })
                        }

                    </select>

                    <input
                        className="register-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        className="register-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {/* to display error */}
                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="register-btn"
                        type="submit"
                    >
                        Register
                    </button>

                </form>

                <div className="register-divider">
                    <span>OR</span>
                </div>

                <div className="register-google-section">
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signup_with"
                    />
                </div>

                <p className="register-footer">
                    Already have an account?{" "}
                    <Link className="register-link" to="/">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );

}

export default Register;
