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
        {errorMessage && (
          <div className={classes["error-message"]}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={classes["error-icon"]}>
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {errorMessage}
          </div>
        )}
      
        <div className={classes["findDeveloper"]}>
          <div className={classes["filter-container"]}>
            <h2>Find Options</h2>
            <div className={classes["filter-options"]}>
              {["Front-End", "Back-End", "Full-Stack", "UI/UX-Designer", "Graphic-Designer", "QA-Engineer"].map((skill) => (
                <p
                  key={skill}
                  onClick={() => handleSkillClick(skill.replace("-", " "))}
                  className={selectedSkills.includes(skill.replace("-", " ")) ? classes["selected"] : ""}
                >
                  {skill}
                </p>
              ))}
            </div>

            <h4>Price Range</h4>
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
      
            <button onClick={applyFilters}>Press to Filter</button>
          </div>
      
          <div className={classes["filtered-devs"]}>
            {filteredDevelopers.length > 0 ? (
              filteredDevelopers.map((dev) => (
                <div key={dev._id} className={classes["devs"]}>
                  <div className={classes["dev-flex"]}>
                    <img src={devProfile} alt="Developer" />
                    <div className={classes["flex-option"]}>
                      <h3>{dev.name}</h3>
                      <h4>${dev.priceRange || "Not specified"}</h4>
                    </div>
                  </div>
                  <h4>{dev.email}</h4>
                  <div className={classes["skills"]}>
                    {dev.selectedExperience && dev.selectedExperience.length > 0 ? (
                      dev.selectedExperience.map((exp, index) => <p key={index}>{exp}</p>)
                    ) : (
                      <p className={classes["no-experience"]}>No experiences listed</p>
                    )}
                  </div>
                  <button onClick={() => handleRequestClick(dev)}>Request</button>
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
      </>
    )
}

export default FindDevelopers;