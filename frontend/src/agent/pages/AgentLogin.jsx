import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAgent } from "../services/agentService";

import { AgentAuthContext } from "../../context/AgentAuthContext";

import toast from "react-hot-toast";

function AgentLogin() {
    const { agent, loading } = useContext(AgentAuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && agent) {
             navigate("/agent/dashboard");
        }
    }, [agent, loading]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        // backend API call
        try {

            setError("");

            const agent = await loginAgent({
                email,
                password
            })

            console.log("Login Success: ", agent);

            toast.success("Logged in successfully!");
                
            navigate("/agent/dashboard");

            // force refresh agent data after login
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

            </div>

        </div>
    );
}

export default AgentLogin;
