import { useEffect, useState, useRef } from "react";
import classes from "../../modules/Navbar.module.scss";
import profileImg from "../../assets/Home-page-pics/profile-user.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/team-up-logo.png";
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
<>
  <nav className={classes["header"]} ref={navRef}>
    <div className={classes["left-side"]}>
      <div className={classes["header_logo"]}>
        <img src={logo} onClick={() => navigate("/")} className={classes["nav-logo"]} alt="TeamUp logo" />
      </div>

      <ul className={`${classes["li-links"]} ${mobileMenu ? classes["active"] : ""}`}>
        <li onClick={() => { navigate("/"); setMobileMenu(false); }}>Home</li>
        <li onClick={() => { navigate("/FindDevelopers"); setMobileMenu(false); }}>Find Developer</li>
        <li onClick={() => { navigate("/Projects"); setMobileMenu(false); }}>Projects</li>
        <li onClick={() => { navigate("/Request"); setMobileMenu(false); }}>Request</li>
      </ul>
    </div>

    <div className={classes["profile-side"]}>
    {!isUserSignedIn && (
          <>
            <button>Get Start</button>
          </>
        )}
        {isUserSignedIn && (
            <div style={{ width: "0px" }}></div>
        )}
      <img src={profileImg} onClick={dropDownHandler} alt="Profile" />

      <div className={classes["hamburger"]} onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    {profileMenu && (
      <ul className={classes["dropdown-menu"]} ref={profileRef}>
        <li className={classes["user-li"]}>
          <a className={classes["user"]}>{userName}</a>
        </li>
        <li><a onClick={() => navigate("/profile")}>Profile</a></li>
        <li><a onClick={() => navigate("/Messenger")}>Messenger</a></li>
        <li><a onClick={() => navigate("/FindDevelopers")}>Find developers</a></li>
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
  </nav>
</>

    );
};

export default Navbar;
