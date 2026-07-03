import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginAccount } from "../../services/authService.js";
import { AuthContext } from "../../context/AuthContext";

import toast from "react-hot-toast";

import "../styles/login.css";

function Login() {

    const {
        account,
        accountType,
        loading,
        refreshAccount
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [account_type, setAccount_type] =
        useState("student");

    const [error, setError] = useState("");

    useEffect(() => {

        if (!loading && account && accountType) {

            if (accountType === "student") {

                navigate("/dashboard");

            } else {

                navigate(`/${accountType}/dashboard`);

            }

        }

    }, [account, accountType, loading, navigate]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");

            await loginAccount({

                email,

                password,

                accountType: account_type

            });

            await refreshAccount();

            toast.success("Logged in successfully!");

            if (account_type === "student") {

                navigate("/dashboard");

            } else {

                navigate(`/${account_type}/dashboard`);

            }

        } catch (err) {

            setError(

                err?.response?.data?.message ||

                "Login failed"

            );

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <div className="login-header">

                    <h1 className="login-title">
                        BatchBite
                    </h1>

                    <p className="login-subtitle">
                        Welcome back! Sign in to continue.
                    </p>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="login-account-menu">

                        <button
                            type="button"
                            className={`login-account-item ${
                                account_type === "student"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setAccount_type("student")
                            }
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            className={`login-account-item ${
                                account_type === "restaurant"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setAccount_type("restaurant")
                            }
                        >
                            Restaurant
                        </button>

                        <button
                            type="button"
                            className={`login-account-item ${
                                account_type === "agent"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setAccount_type("agent")
                            }
                        >
                            Agent
                        </button>

                        <button
                            type="button"
                            className={`login-account-item ${
                                account_type === "admin"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setAccount_type("admin")
                            }
                        >
                            Admin
                        </button>

                    </div>
                                        <input
                        className="login-input"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="login-btn"
                        type="submit"
                    >
                        Login
                    </button>

                </form>

                <div className="login-footer">

                    <p>
                        Don't have an account?
                    </p>

                    <Link
                        className="login-link"
                        to="/register"
                    >
                        Register as Student
                    </Link>

                    <Link
                        className="login-link"
                        to="/register/restaurant"
                    >
                        Register as Restaurant
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;