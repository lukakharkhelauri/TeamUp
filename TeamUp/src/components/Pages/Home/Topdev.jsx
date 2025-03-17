import classes from "../../../modules/Topdev.module.scss";
import { getRequest, postRequest } from "../../../utils/api.js"
import devProfile from "../../../assets/Home-page-pics/profile-pic.jpg";
import axios from "axios";
import { useState, useEffect } from "react";
import RequestModal from "../Home/RequestModal";

const TopDevelopers = () => {
    const [developers, setDevelopers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);

    const handleSelectDeveloper = (developer) => {
        setSelectedDeveloper(developer);
    };

    const fetchRequests = async (developerId) => {
        try {
            const data = await getRequest(`/requests`, { developerId });
            console.log("Fetched requests:", data);
        } catch (error) {
            console.error("Error fetching requests:", error); 
        }
    };

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const data = await getRequest('/users');
                console.log("API Response:", data);
                const onlyDevelopers = data.users.filter(user => user.selectedRole === "developer");
                setDevelopers(onlyDevelopers || []); 
            } catch (error) {
                console.error("Error fetching developers:", error); 
            }
        };
        
        fetchDevelopers(); 
    }, []);

    const handleRequest = (dev) => {
        setSelectedDeveloper(dev);
        setIsModalOpen(true); 
    };

    const handleSubmitRequest = async (requestData) => {
        try {
            const data = await postRequest("/requests", {
                developerId: selectedDeveloper._id,
                developerName: selectedDeveloper.name,
                developerEmail: selectedDeveloper.email,
                developerStatus: selectedDeveloper.selectedStatus,
                developerExperience: selectedDeveloper.selectedExperience,
                priceRange: requestData.priceRange,
                projectName: requestData.projectName,
                description: requestData.description
            });
            alert("Request sent successfully!");
        } catch (error) {
            alert("Failed to send request.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDeveloper(null);
    };

    return (
        <>
            <center><h1 className={classes["top-dev-title"]}>Top Developers</h1></center>

            <div className={classes["dev-side"]}>
                {developers.length > 0 ? (
                    developers.slice(0, 10).map((dev) => (
                        <div key={dev._id} className={classes["developers"]}>
                            <div>
                                <div className={classes["about-dev"]}>
                                    <img src={devProfile} className={classes["dev-profile"]} alt="Developer" />
                                    <div>
                                        <h4>{dev.name}</h4>
                                        <p>{dev.selectedStatus}</p>
                                    </div>
                                </div>

                                <p className={classes["email"]}>{dev.email}</p>
                                <br />
                                <div className={classes["dev-knowledge"]}>
                                    {dev.selectedExperience && dev.selectedExperience.length > 0 ? (
                                        dev.selectedExperience.map((exp, index) => (
                                            <p key={index}>{exp}</p>
                                        ))
                                    ) : (
                                        <p className={classes["no-experience"]}>No experiences listed</p>
                                    )}
                                </div>
                                <div className={classes["price-info"]}>
                                    <p>Price range: <span>${dev.priceRange || 'Not specified'}</span></p>
                                </div>
                            </div>
                            <button 
                                className={classes["request-btn"]}
                                onClick={() => handleRequest(dev)}
                            >
                                Request
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Loading developers...</p>
                )}
            </div>

            {selectedDeveloper && (
                <RequestModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    developerName={selectedDeveloper.name}
                    selectedDeveloper={selectedDeveloper}
                    onSubmit={handleSubmitRequest}
                />
            )}
        </>
    );
};

export default TopDevelopers;
