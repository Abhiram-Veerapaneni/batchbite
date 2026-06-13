import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService.js";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import toast from "react-hot-toast";

function Login() {

    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard");
        }
    }, [user, loading]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        // backend API call
        try {

            setError("");

            const data = await loginUser({
                email,
                password
            })

            console.log("Login Success: ", data);

            toast.success("Logged in successfully!");
            navigate("/dashboard");

            // force refresh user data after login
            window.location.reload();

        } catch (err) {
            setError(
                err?.response?.data?.message || "Login Failed"
            );
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <h1 className="login-title">
                    BatchBite Login
                </h1>

                <form className="login-form" onSubmit={handleSubmit}>

                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* TO display error */}

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button className="login-btn" type="submit">
                        Login
                    </button>
                </form>

                {/* Navigation to Register page */}

                <p className="login-footer">
                    Don't have an account?{" "}
                    <Link className="login-link" to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
