import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Main/Navbar.jsx"
import classes from "../../../modules/FindDevelopers/FindDevelopers.module.scss"
import devProfile from "../../../assets/Home-page-pics/profile-pic.jpg";
import Footer from "../../Main/Footer.jsx"

const FindDevelopers = () => {
    const [developers, setDevelopers] = useState([]);
    const [filteredDevelopers, setFilteredDevelopers] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [priceRange, setPriceRange] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const signedInUser = JSON.parse(localStorage.getItem("user"));
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        console.log("Fetching developers...");
        
        axios.get('http://localhost:5005/users')
            .then(response => {
                console.log("All users from backend:", response.data.users);
                
                const filteredDevelopers = response.data.users?.filter(user => 
                    user._id !== signedInUser?.id && user.selectedRole === "developer"
                ) || [];
                
                console.log("Filtered developers:", filteredDevelopers);
                
                setDevelopers(filteredDevelopers);
                setFilteredDevelopers(filteredDevelopers);
            })
            .catch(error => {
                console.error("Error fetching developers:", error);
            });
    }, []);

    const handleSkillClick = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const applyFilters = () => {
        let filtered = [...developers];

        if (selectedSkills.length > 0) {
            filtered = filtered.filter(dev => 
                selectedSkills.some(skill => 
                    dev.selectedExperience?.includes(skill) ||
                    dev.selectedFocus?.includes(skill) ||
                    dev.projectStyle?.includes(skill)
                )
            );
        }

        if (priceRange && priceRange !== "") {
            filtered = filtered.filter(dev => {
                const devPrice = dev.priceRange ? parseInt(dev.priceRange) : null;
                const maxPrice = parseInt(priceRange);
                return devPrice !== null && devPrice <= maxPrice;
            });
        }
        setFilteredDevelopers(filtered);
    };

    const handleRequestClick = async (developer) => {
        if (!signedInUser) {
            setErrorMessage("Please sign in to send requests");
            return;
        }

        try {
            const existingRequests = await axios.get(`http://localhost:5005/requests/check`, {
                params: {
                    userId: signedInUser.id,
                    developerId: developer._id
                }
            });

            if (existingRequests.data.exists) {
                setErrorMessage("You have already sent a request to this developer");
                return;
            }

            setErrorMessage(""); 
            setSelectedDeveloper(developer);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error checking existing requests:", error);
            setErrorMessage("Error checking request status. Please try again.");
        }
    };

    const handleSendRequest = async () => {
        if (!signedInUser) {
            alert("Please sign in to send requests");
            return;
        }

        if (!projectName || !projectDescription) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const requestData = {
                userId: signedInUser.id,
                name: signedInUser.name,
                email: signedInUser.email,
                projectName: projectName,
                description: projectDescription,
                priceRange: selectedDeveloper.priceRange || "Not specified",
                status: "pending",
                selectedRole: signedInUser.selectedRole,
                developerId: selectedDeveloper._id,
            };
            const response = await axios.post('http://localhost:5005/requests', requestData);
            
            if (response.data) {
                alert("Request sent successfully!");
                setSelectedDeveloper(null);
                setProjectName("");
                setProjectDescription("");
            }
        } catch (error) {
            console.error("Error sending request:", error);
            alert("Failed to send request. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <br /><br />
            {errorMessage && (
                <div className={classes["error-message"]}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={classes["error-icon"]}>
                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {errorMessage}
                </div>
            )}
            <div className={classes["filter-container"]}>
                <div className={classes["filter"]}>
                    <h3>Filter Developers</h3>
                    <br />
                    <h4>Skills</h4>
                    <br />
                    <div className={classes["dev-skills"]}>
                        <p 
                            onClick={() => handleSkillClick("Front End Developer")}
                            className={selectedSkills.includes("Front End Developer") ? classes["selected"] : ""}
                        >
                            Front end
                        </p>
                        <p 
                            onClick={() => handleSkillClick("Back End Developer")}
                            className={selectedSkills.includes("Back End Developer") ? classes["selected"] : ""}
                        >
                            Back end
                        </p>
                        <p 
                            onClick={() => handleSkillClick("Full Stack Developer")}
                            className={selectedSkills.includes("Full Stack Developer") ? classes["selected"] : ""}
                        >
                            Full Stack
                        </p>
                        <p 
                            onClick={() => handleSkillClick("UI/UX Designer")}
                            className={selectedSkills.includes("UI/UX Designer") ? classes["selected"] : ""}
                        >
                            UI/UX Designer
                        </p>
                        <p 
                            onClick={() => handleSkillClick("Graphic Designer")}
                            className={selectedSkills.includes("Graphic Designer") ? classes["selected"] : ""}
                        >
                            Graphic Designer
                        </p>
                        <p 
                            onClick={() => handleSkillClick("QA Engineer")}
                            className={selectedSkills.includes("QA Engineer") ? classes["selected"] : ""}
                        >
                            QA Engineer
                        </p>
                    </div>

                    <br />
                    <h4>Price Range</h4>
                    <br />
                    <div className={classes["search-box"]}>
                        <input 
                            type="number" 
                            placeholder="Enter maximum price..." 
                            min={0}
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                        />
                        <p className={classes["price-hint"]}>Enter maximum price per hour ($)</p>
                    </div>
                    <br /><br />
                    <button 
                        className={classes["filter-btn"]}
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
                <div className={classes["dev_side"]}>
                    {filteredDevelopers.length > 0 ? (
                        filteredDevelopers.map((dev) => (
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
                                    onClick={() => handleRequestClick(dev)}
                                >
                                    Request
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className={classes["no-results"]}>
                            <p>No developers match your filters</p>
                            <button 
                                className={classes["clear-filters"]}
                                onClick={() => {
                                    setSelectedSkills([]);
                                    setPriceRange("");
                                    setFilteredDevelopers(developers);
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedDeveloper && (
                <div className={classes["request-modal"]}>
                    <div className={classes["modal-content"]}>
                        <h3>Send Request to {selectedDeveloper.name}</h3>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Project Description"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            required
                        />
                        <div className={classes["modal-buttons"]}>
                            <button 
                                onClick={handleSendRequest}
                                disabled={!projectName || !projectDescription}
                            >
                                Send Request
                            </button>
                            <button onClick={() => {
                                setSelectedDeveloper(null);
                                setProjectName("");
                                setProjectDescription("");
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <br/><br/><br/><br/><br/><br/>
            <Footer />
        </>
    )
}

export default FindDevelopers;