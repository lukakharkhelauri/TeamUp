import { useEffect, useState } from "react";
import classes from "../../modules/Navbar.module.scss";
import profileImg from "../../assets/Home-page-pics/profile-pic.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [profileMenu, setProfileMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [developers, setDevelopers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [userName, setUserName] = useState("");
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const navigate = useNavigate();

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
        const storedUser = localStorage.getItem("userName");
        if (storedUser) {
            setUserName(storedUser);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setIsUserSignedIn(true);
            setUserName(JSON.parse(storedUser).name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        setIsUserSignedIn(false);
        localStorage.removeItem("token");
        setUserName("");
        navigate("/signin");
        window.location.reload();
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
        <nav>
            <div className={classes["nav-left"]}>
                <h1 className={classes["nav-logo"]}>TeamUp</h1>
                <div className={classes["hamburger"]} onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={`${classes["nav-links"]} ${mobileMenu ? classes["active"] : ""}`}>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li onClick={() => navigate('/FindDevelopers')}>Find Developers</li>
                    <li onClick={() => navigate('/Projects')}>Projects</li>
                    <li>Auction</li>
                </ul>
            </div>

            <div className={classes["nav-right"]}>
                <button className={classes["profile-btn"]} onClick={dropDownHandler}>
                    <div>
                        <img src={profileImg} className={classes["profile-pic"]} alt="Profile" />
                        <h3>{userName}</h3>
                    </div>
                </button>


                {profileMenu && (
                    <ul className={classes["dropdown-menu"]}>
                        <li><a onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a onClick={() => navigate("/Messenger")}>Messenger</a></li>
                        <li><a onClick={() => navigate("/Request")}>Requests</a></li>
                        <li><a>Support</a></li>
                        {!isUserSignedIn && (
                            <li><a onClick={handleSignUp}>SignUp</a></li>
                        )}
                        {isUserSignedIn && (
                            <li><a onClick={handleLogout}>Logout</a></li>
                        )}
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;