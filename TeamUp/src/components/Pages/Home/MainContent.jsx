import { useState, useEffect } from "react";
import { getRequest, postRequest } from "../../../utils/api.js"
import classes from "../../../modules/MainContent.module.scss"

const MainContent = () => {
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

    return (
        <>
            <div className={classes["main-container"]}>
                <div className={classes["left-side"]}>
                    <div className={classes["content-wrapper"]}>
                        <h1>Connect with top developers and clients worldwide</h1>
                        <br/>
                        <p>
                            Lorem Ipsum is simply dummy
                            text of the printing and
                            typesetting industry. Lorem Ipsum
                            has been the industry's standard dummy
                            text ever since the 1500s
                            and best site ever you can see
                        </p>
                        <br/>
                        <div className={classes["two-btn"]}>
                            {!isUserSignedIn && (
                                <button className={classes["blue-btn"]}>Get Started</button>
                            )}
                            <button className={classes["white-btn"]}>Learn More</button>
                        </div>
                        <br/><br/>
                        <div className={classes["result-side"]}>
                            <div>
                                <h2>{developers.length}</h2>
                                <p>Active Developers</p>
                            </div>
                            <div>
                                <h2>5k+</h2>
                                <p>Projects Completed</p>
                            </div>
                            <div>
                                <h2>8k+</h2>
                                <p>Happy Clients</p>
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