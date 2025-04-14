import { useEffect, useState, useRef } from "react";
import classes from "../../modules/Navbar.module.scss";
import profileImg from "../../assets/Home-page-pics/profile-pic.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/teamup-logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const [profileMenu, setProfileMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [developers, setDevelopers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [userName, setUserName] = useState("");
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const navigate = useNavigate();

    // 🔧 Added refs for detecting outside clicks
    const profileRef = useRef(null);
    const navRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5005/users')
            .then(response => {
                if (response.data.users && response.data.users.length > 1) {
                    console.log("Second User:", response.data.users[1]);
                } else {
                    console.log("No second user in the array.");
                }
                setDevelopers(response.data.users || []);
            })
            .catch(error => {
                console.error("Error fetching developers:", error);
            });

        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setIsUserSignedIn(true);
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.name) setUserName(parsedUser.name);
            } catch (e) {
                console.error("Invalid user data in localStorage");
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target) &&
                navRef.current &&
                !navRef.current.contains(e.target)
            ) {
                setProfileMenu(false);
                setMobileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        setIsUserSignedIn(false);
        setUserName("");
        navigate("/signin");
        window.location.reload();
    };

    const handleSignIn = () => {
        navigate("/signIn");
    };

    const handleSignUp = () => {
        navigate("/signUp");
    };

    const dropDownHandler = () => {
        setProfileMenu(!profileMenu);
    };

    const toggleMobileMenu = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <nav ref={navRef}>
            <div className={classes["nav-left"]}>
                <img src={logo} onClick={() => { navigate('/');}}className={classes["nav-logo"]} alt="TeamUp logo" />
                <ul className={`${classes["nav-links"]} ${mobileMenu ? classes["active"] : ""}`}>
                    <li onClick={() => { navigate('/'); setMobileMenu(false); }}>Home</li>
                    <li onClick={() => { navigate('/FindDevelopers'); setMobileMenu(false); }}>Find Developers</li>
                    <li onClick={() => { navigate('/Projects'); setMobileMenu(false); }}>Projects</li>
                    <li onClick={() => setMobileMenu(false)}>Auction</li>
                </ul>
            </div>

            <div className={classes["nav-right"]}>
                <button className={classes["profile-btn"]} onClick={dropDownHandler}>
                    <div>
                        <FontAwesomeIcon icon={faUser} className={classes["profile-icon"]} />
                        <h3 className={classes["active"]}>{userName}</h3>
                    </div>
                </button>

                {profileMenu && (
                    <ul className={classes["dropdown-menu"]} ref={profileRef}>
                        <li className={classes["user-li"]}>
                            <a className={classes["user"]}>{userName}</a>
                        </li>
                        <li><a onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a onClick={() => navigate("/Messenger")}>Messenger</a></li>
                        <li><a onClick={() => navigate("/Request")}>Requests</a></li>
                        <li><a>Support</a></li>
                        {!isUserSignedIn && (
                            <>
                                <li><a onClick={handleSignUp}>SignUp</a></li>
                                <li><a onClick={handleSignIn}>SignIn</a></li>
                            </>
                        )}
                        {isUserSignedIn && (
                            <li><a onClick={handleLogout}>Logout</a></li>
                        )}
                    </ul>
                )}

                <div className={classes["hamburger"]} onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
