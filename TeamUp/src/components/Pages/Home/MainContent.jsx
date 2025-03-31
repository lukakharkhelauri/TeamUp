import { useState, useEffect } from "react";
import { getRequest, postRequest } from "../../../utils/api.js"
import { useNavigate } from "react-router-dom";
import classes from "../../../modules/MainContent.module.scss"

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
            <div className={classes["main-container"]}>
                <div className={classes["left-side"]}>
                    <div className={classes["content-wrapper"]}>
                        <h1 className={classes["center-text"]}>Connect with top developers and clients worldwide</h1>
                        <p className={classes["center-text"]}>
                            Lorem Ipsum is simply dummy
                            text of the printing and
                            typesetting industry. Lorem Ipsum
                            has been the industry's standard dummy
                            text ever since the 1500s
                            and best site ever you can see
                        </p>
                        <br />
                        <div className={classes["two-btn"]}>
                            {!isUserSignedIn && (
                                <button className={classes["blue-btn"]} onClick={handleSignUp}>Get Started</button>
                            )}
                            <button className={classes["white-btn"]}>Learn More</button>
                        </div>
                        <br /><br />
                        <div className={classes["result-side"]}>
                            <div>
                                <h2>6K+</h2>
                                <p className={classes["p"]}>Active Developers</p>
                            </div>
                            <div>
                                <h2>5k+</h2>
                                <p className={classes["p"]}>Projects Completed</p>
                            </div>
                            <div>
                                <h2>8k+</h2>
                                <p className={classes["p"]}>Happy Clients</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classes["right-side"]}>
                    <div className={classes["right-side_img"]}></div>
                </div>
            </div>
        </>
    )
}

export default MainContent;