import axios from 'axios';
import { postRequest } from "../../../utils/api.js"
import { useState } from "react";
import "../../../modules/singIn/SignIn.css";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginData = {
                email: email,
                password: password
            }
            const response = await postRequest('/login', loginData);
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem("selectedRole", response.user.selectedRole || "");
                localStorage.setItem("userName", response.user.name);
                localStorage.setItem("isAuthenticated", "true");
                navigate("/");
            } else {
                setIsError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsError(true);
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault(); 
    //     setIsError(false);
    //     console.log("Login was submitted with:", { email, password });
    
    //     try {
    //         const data = await postRequest("/login", { email, password }); 
    
    //         if (data.success && data.user) {
    //             const userData = data.user;
    //             localStorage.setItem("user", JSON.stringify(userData));
    //             localStorage.setItem("selectedRole", userData.selectedRole || "");
    //             localStorage.setItem("userName", userData.name);
    //             localStorage.setItem("isAuthenticated", "true");
    
    //             navigate("/"); 
    //         } else {
    //             setIsError(true);
    //         }
    //     } catch (error) {
    //         console.error("Error:", error); 
    //         setIsError(true); 
    //     }
    // };

    

    return (
        <div className="signin-container">
            <div className="signin-left">
                <div className="signin-form">
                    <h1 className="signin-title">Sign In</h1>
                    <form onSubmit={handleSubmit} className="signin-form-container">
                        <div>
                            <label className="signin-label">Email Address</label>
                            <input
                                type="email"
                                className={`signin-input ${isError ? "error" : ""}`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="signin-label">Password</label>
                            <input
                                type="password"
                                className={`signin-input ${isError ? "error" : ""}`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {isError && <p className="error-message">Invalid email or password</p>}
                        <button 
                            type="submit" 
                            className="signin-button"
                            disabled={!email || !password}
                        >
                            Sign In
                        </button>
                    </form>
                    <p className="signin-footer">
                        Don't have an account? {' '}
                        <Link to="/SignUp" className="signin-link">Sign Up</Link>
                    </p>
                </div>
            </div>

            <div className="signin-right">
                <div className="community-box"></div>
                <div className="signin-info">
                    <h2 className="signin-heading">Join our growing community</h2>
                    <p>Connect with thousands of developers and clients worldwide. Start your journey today!</p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
