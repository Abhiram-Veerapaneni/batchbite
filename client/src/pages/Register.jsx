import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();
    const [error, setError] = useState("");

    // name, email, university, role, password

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [university, setUniversity] = useState("VIT AP");
    const [role, setRole] = useState("student");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        const registerData = {
            name,
            email,
            password,
            university,
            role,
            confirmPassword
        };

        // backend API call
        try {
            setError("");

            await registerUser(registerData);

            navigate("/dashboard");

        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed");
        }
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

                    <select
                        className="register-select"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                    >
                        <option value="VIT AP">VIT AP</option>
                        <option value="KL University">KL University</option>
                        <option value="SRM AP">SRM AP</option>
                    </select>

                    <select
                        className="register-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="restaurant">Restaurant</option>
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