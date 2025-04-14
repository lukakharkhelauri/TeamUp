import classes from "../../../modules/Profile/Profile.module.scss"
import Navbar from "../../Main/Navbar.jsx"
import ProfilePicture from "../../../assets/Home-page-pics/profile-pic.jpg"
import {useEffect, useState} from "react";
import axios from "axios";
import exampleProject from "../../../assets/Home-page-pics/exampleProject.png";
import clientProfile from "../../../assets/Home-page-pics/profile-pic.jpg";
import Footer from "../../Main/Footer.jsx"

const Profile = () => {
    const [developers, setDevelopers] = useState([]);
    const [userName, setUserName] = useState("");
    const [experience, setExperience] = useState([])
    const [requested, setRequested] = useState(false)

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
        const storedExperience = localStorage.getItem("selectedExperience");
        if (storedUser) {
            setUserName(storedUser);
        }

        if(storedExperience){
            setExperience(storedExperience)
        }
    }, []);

    const requestHandler = () => {
        setRequested(!requested);
    }

    return (
        <>
            <Navbar/>

            <div className={classes["profile-container"]}>
                <div className={classes["profile-side"]}>
                    <img src={ProfilePicture}/>
                    <div>
                        <h2>{userName}</h2>
                        <ul>
                            {experience?.map((exp, index) => {
                                return (
                                    <li key={index}>{exp[index]}</li>
                                )
                            })}
                        </ul>
                    </div>

                    <button onClick={requestHandler} className={classes[`${!requested ? 'request-btn' : 'cancel-btn'}`]}>
                        {!requested ? "Request" : "Cancel"}
                    </button>
                </div>
                <br/><br/>
                <div className={classes["projects-side"]}>

                    <div className={classes['projects']}>
                    <img className={classes["project-picture"]} src={exampleProject}/>

                        <div className={classes["project-description"]}>
                            <h4>Project Name</h4>
                            <p>
                                description:
                                it will be best site
                                ever for clien and
                                developers easy money
                                baby.
                            </p>
                            <br/>
                            <div className={classes["client-side"]}>
                                <div>
                                    <img className={classes["client-profile"]} src={clientProfile}/>
                                    <p>Client Name</p>
                                </div>

                                <h5>$1,000</h5>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <br/><br/><br/><br/><br/><br/>
            <Footer />
        </>
    )
}

export default Profile;