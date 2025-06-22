import { useState, useEffect } from "react";
import { getRequest, postRequest } from "../../../utils/api.js"
import { useNavigate } from "react-router-dom";
import classes from "../../../modules/MainContent.module.scss"
import mainContentPic from "../../../assets/Home-page-pics/mainPic.png"

const MainContent = () => {
    const navigate = useNavigate();
    const [developers, setDevelopers] = useState([]);
    const isUserSignedIn = localStorage.getItem('user');

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const data = await getRequest('/users?role=developer');
                const developersOnly = data.users?.filter(user => user.selectedRole === "developer") || [];
                setDevelopers(developersOnly);
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchDevelopers();
    }, []);

    const handleSignUp = () => {
        navigate("/signUp");
    };

    return (
        <>
        <div className={classes["main-content"]}>
            <div className={classes["left-side"]}>
                <h1 className={classes["main-title"]}>Connect with <mark>Top</mark> developers and clients
                    worldwide
                </h1>

                <p className={classes["bottom-text"]}>
                    In today's fast-paced digital landscape,
                    building meaningful connections with top developers
                    and clients worldwide is essential for success.
                </p>

                <div className={classes["result-side"]}>
                    <div>
                        <h2>55+</h2>
                        <p className={classes["p"]}>Active Developers</p>
                    </div>
                    <div>
                        <h2>10+</h2>
                        <p className={classes["p"]}>Projects Completed</p>
                    </div>
                    <div>
                        <h2>8+</h2>
                        <p className={classes["p"]}>Our Happy Clients</p>
                    </div>
                </div>
            </div>

            <div className={classes["right-side"]}>
                <img src={mainContentPic}/>
            </div>
        </div>
    </>
)
}

export default MainContent;