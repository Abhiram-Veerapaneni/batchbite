import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAccount } from "../../services/authService.js";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import toast from "react-hot-toast";

function Login() {

    const { account, accountType, loading, refreshAccount } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [account_type, setAccount_type] = useState("student");

    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && account && accountType) {

            if(accountType === "student") 
                navigate("/dashboard")
            else 
                navigate(`${accountType}/dashboard`)
        }

    }, [account, loading]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        // backend API call
        try {

            setError("");

            const account = await loginAccount({
                email,
                password,
                accountType: account_type
            })

            await refreshAccount();

            console.log("Login Success: ", account);

            toast.success("Logged in successfully!");

            if(account_type === "student") 
                navigate("/dashboard")
            else 
                navigate(`/${account_type}/dashboard`)

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

                    <select className="login-select"
                        value={account_type}
                        onChange={(e) => setAccount_type(e.target.value)}    
                    >
                        <option value="student"> Student </option>
                        <option value="agent"> Agent </option>
                        <option value="restaurant"> Restaurant </option>
                        <option value="admin"> Admin </option>
        
                    </select>

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
                    <br />
                    <Link className="login-link" to="/register">
                        Register as Student ?
                    </Link>
                    <br />
                    <Link className="login-link" to="/register/restaurant">
                        Register as Restaurant ?
                    </Link>
                </p>
            </div>
            
        </div>
    );
}

export default Login;
