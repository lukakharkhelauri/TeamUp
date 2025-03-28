import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Main/Navbar.jsx"
import styles from "../../../modules/Projects/Projects.module.scss"
import clientProfile from "../../../assets/Home-page-pics/profile-pic.jpg"
import Footer from "../../Main/Footer.jsx"

const Projects = () => {
    const signedInUser = JSON.parse(localStorage.getItem("user"));

    const [showProjects, setShowProjects] = useState(true);
    const [projects, setProjects] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [developers, setDevelopers] = useState({
        lowBudget: [],
        matching: [],
        premium: []
    });
    const [showDevelopers, setShowDevelopers] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [formData, setFormData] = useState({
        projectName: "",
        projectType: "",
        problemSolution: "",
        targetUsers: "",
        expectedResults: "",
        projectGoals: "",
        improvements: "",
        specificResults: "",
        mainFunctions: "",
        functionUsage: "",
        userActions: "",
        designLook: "",
        designElements: "",
        contentOrganization: "",
        technologies: "",
        operatingSystems: "",
        hardwareRequirements: "",
        performanceStandards: "",
        budget: "",
        deadline: "",
    });
    const [dateError, setDateError] = useState("");
    const [fixedDevelopers, setFixedDevelopers] = useState([]);

    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 5);

    useEffect(() => {
        const signedInUser = JSON.parse(localStorage.getItem("user"));
    
        if (signedInUser) {
            fetchProjects();
        } else {
            setProjects([]); 
        }
    }, []);
    

    const fetchProjects = async () => {
        const signedInUser = JSON.parse(localStorage.getItem("user"));
        
        if (!signedInUser) {
            setProjects([]); 
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:5005/projects');
            const allProjects = response.data.projects || [];

            const filteredProjects = allProjects.filter(project => {
                if (signedInUser.selectedRole?.toLowerCase() === "client") {
                    return project.clientId?._id === signedInUser.id || project.clientId === signedInUser.id;
                } else if (signedInUser.selectedRole?.toLowerCase() === "developer") {
                    return project.developerId?._id === signedInUser.id || project.developerId === signedInUser.id;
                }
                return false;
            });
    
            console.log("Filtered projects:", filteredProjects);
            setProjects(filteredProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };    

    const handleDateChange = (e) => {
        const selectedValue = e.target.value;
        setFormData({ ...formData, deadline: selectedValue });

        if (selectedValue.length === 10) {
            const selectedDate = new Date(selectedValue);

            if (selectedDate < today) {
                setDateError("Deadline cannot be in the past");
            } else if (selectedDate > maxDate) {
                setDateError("Deadline cannot be more than 5 years in the future");
            } else {
                setDateError("");
            }
        } else {
            setDateError("");
        }
    };

    const handleStartSearching = async (e) => {
        e.preventDefault();
        if (dateError) {
            alert("Please fix the deadline date error");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5005/users');
            const allDevelopers = response.data.users.filter(user =>
                user.selectedRole === "developer"
            );

            const groupSize = Math.ceil(allDevelopers.length / 3);

 
            const Team1 = allDevelopers.slice(0, groupSize);
            const Team2 = allDevelopers.slice(groupSize, groupSize * 2);
            const Team3 = allDevelopers.slice(groupSize * 2);

            console.log("Team 1:", Team1.map(dev => dev.name));
            console.log("Team 2:", Team2.map(dev => dev.name));
            console.log("Team 3:", Team3.map(dev => dev.name));

            setDevelopers({
                lowBudget: Team1,
                matching: Team2,
                premium: Team3
            });

            setShowDevelopers(true);
            setShowProjects(false);
            setShowCreateForm(false);
        } catch (error) {
            console.error("Error fetching developers:", error);
        }
    };

    const handleSubmit = async (teamName, teamMembers) => {
        try {
            const projectData = {
                projectName: formData.projectName,
                projectType: formData.projectType,
                problemSolution: formData.problemSolution,
                targetUsers: formData.targetUsers,
                expectedResults: formData.expectedResults,
                projectGoals: formData.projectGoals,
                improvements: formData.improvements,
                specificResults: formData.specificResults,
                mainFunctions: formData.mainFunctions,
                functionUsage: formData.functionUsage,
                userActions: formData.userActions,
                designLook: formData.designLook,
                designElements: formData.designElements,
                contentOrganization: formData.contentOrganization,
                technologies: formData.technologies,
                operatingSystems: formData.operatingSystems,
                hardwareRequirements: formData.hardwareRequirements,
                performanceStandards: formData.performanceStandards,
                clientId: signedInUser.id,
                budget: Number(formData.budget),
                deadline: formData.deadline,
                status: "pending"
            };

            console.log("Sending project data:", projectData);

            // Create the project
            const projectResponse = await axios.post('http://localhost:5005/projects', projectData);

            // Create the conversation group
            const conversationData = {
                participants: [...teamMembers.map(dev => dev._id), signedInUser.id],
                isGroup: true,
                groupName: `${formData.projectName} - ${teamName} Group`
            };

            await axios.post('http://localhost:5005/conversations', conversationData);

            setShowCreateForm(false);
            setFormData({
                projectName: "",
                projectType: "",
                problemSolution: "",
                targetUsers: "",
                expectedResults: "",
                projectGoals: "",
                improvements: "",
                specificResults: "",
                mainFunctions: "",
                functionUsage: "",
                userActions: "",
                designLook: "",
                designElements: "",
                contentOrganization: "",
                technologies: "",
                operatingSystems: "",
                hardwareRequirements: "",
                performanceStandards: "",
                budget: "",
                deadline: "",
            });
            setDateError("");
            setShowDevelopers(false);
            setShowProjects(true);
            await fetchProjects();

        } catch (error) {
            console.error("Error creating project and group:", error);
            console.error("Error details:", error.response?.data);
            alert("Error creating project: " + (error.response?.data?.message || error.message));
        }
    };

    const handleModalClick = (e) => {
        if (e.target.className === styles.modal) {
            setShowCreateForm(false);
        }
    };

    return (
        <div className={styles.projectsPage}>
            <Navbar />
            <div className={styles.projectsContainer}>
                <div className={styles.header}>
                    <h1>Projects</h1>
                    {signedInUser && signedInUser.selectedRole?.toLowerCase() === "client" && (
                        <button
                            className={styles.createButton}
                            onClick={() => setShowCreateForm(true)}
                        >
                            Create New Project
                        </button>
                    )}
                </div>

                {showCreateForm && (
                    <div className={styles.modal} onClick={handleModalClick}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <h2 className={styles.modalTitle}>Create New Project</h2>
                            <div className={styles.modalBody}>
                                <form onSubmit={handleStartSearching} className={styles.projectForm}>
                                    <input
                                        type="text"
                                        placeholder="Project Name"
                                        value={formData.projectName}
                                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                        required
                                    />

                                    <div className={styles.formSection}>
                                        <h3>1. Project Description</h3>
                                        <select
                                            value={formData.projectType}
                                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Project Type</option>
                                            <option value="website">Website</option>
                                            <option value="app">Mobile App</option>
                                            <option value="Startup">Startup</option>
                                        </select>
                                        <textarea
                                            placeholder="What problem will this project solve or satisfy?"
                                            value={formData.problemSolution}
                                            onChange={(e) => setFormData({ ...formData, problemSolution: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="Who needs this project (users)?"
                                            value={formData.targetUsers}
                                            onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What results should you get?"
                                            value={formData.expectedResults}
                                            onChange={(e) => setFormData({ ...formData, expectedResults: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3>2. Goals</h3>
                                        <textarea
                                            placeholder="What goals should this project achieve?"
                                            value={formData.projectGoals}
                                            onChange={(e) => setFormData({ ...formData, projectGoals: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What should be changed/improved after use?"
                                            value={formData.improvements}
                                            onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What specific results should you get?"
                                            value={formData.specificResults}
                                            onChange={(e) => setFormData({ ...formData, specificResults: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3>3. Main Functions</h3>
                                        <textarea
                                            placeholder="What main functions should the project have?"
                                            value={formData.mainFunctions}
                                            onChange={(e) => setFormData({ ...formData, mainFunctions: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="How should these functions be used by users?"
                                            value={formData.functionUsage}
                                            onChange={(e) => setFormData({ ...formData, functionUsage: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What actions will be available to users?"
                                            value={formData.userActions}
                                            onChange={(e) => setFormData({ ...formData, userActions: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3>4. Design Requirements</h3>
                                        <textarea
                                            placeholder="What should the product look like?"
                                            value={formData.designLook}
                                            onChange={(e) => setFormData({ ...formData, designLook: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What elements should be in the design (quality, visualization, interface)?"
                                            value={formData.designElements}
                                            onChange={(e) => setFormData({ ...formData, designElements: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="How should the content be organized and what should be easy for the user?"
                                            value={formData.contentOrganization}
                                            onChange={(e) => setFormData({ ...formData, contentOrganization: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3>5. Technical Requirements</h3>
                                        <textarea
                                            placeholder="What technologies should the project use?"
                                            value={formData.technologies}
                                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What operating systems should be supported?"
                                            value={formData.operatingSystems}
                                            onChange={(e) => setFormData({ ...formData, operatingSystems: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What hardware requirements should it have (memory, processor)?"
                                            value={formData.hardwareRequirements}
                                            onChange={(e) => setFormData({ ...formData, hardwareRequirements: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="What performance and quality standards must be maintained?"
                                            value={formData.performanceStandards}
                                            onChange={(e) => setFormData({ ...formData, performanceStandards: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3>Budget and Deadline</h3>
                                        <input
                                            type="number"
                                            placeholder="Budget ($)"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            required
                                        />
                                        <div className={styles.dateInputContainer}>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={handleDateChange}
                                                min={today.toISOString().split('T')[0]}
                                                max={maxDate.toISOString().split('T')[0]}
                                                required
                                            />
                                            {dateError && (
                                                <span className={styles.errorMessage}>{dateError}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.formButtons}>
                                        <button type="submit">Start Searching</button>
                                        <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showDevelopers && (
                    <div className={styles.developersSection}>
                        <h3>Suggested developers by AI</h3>
                        <div className={styles.developersColumns}>
                            <div className={styles.developerColumn}>
                                <h4>Team A</h4>
                                <p className={styles.teamDescription}>
                                    Budget: ${formData.budget}
                                </p>
                                <div className={styles.developersGrid}>
                                    {developers.lowBudget.map((dev) => (
                                        <div key={dev._id} className={styles.developerCard}>
                                            <div className={styles.aboutDev}>
                                                <img src={clientProfile} alt="Developer" />
                                                <div>
                                                    <h4>{dev.name}</h4>
                                                    <p>{dev.selectedRole} - {dev.selectedStatus}</p>
                                                </div>
                                            </div>
                                            <p className={styles.email}>{dev.email}</p>
                                            <div className={styles.devKnowledge}>
                                                {dev.selectedExperience?.map((exp, index) => (
                                                    <p key={index}>{exp}</p>
                                                ))}
                                            </div>
                                            <div className={styles.priceInfo}>
                                                <p>Price range: <span>${dev.priceRange || 'Not specified'}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className={styles.teamSelectButton}
                                    onClick={() => handleSubmit('Team A', developers.lowBudget)}
                                >
                                    Select Team A
                                </button>
                            </div>

                            <div className={styles.developerColumn}>
                                <h4>Team B</h4>
                                <p className={styles.teamDescription}>
                                    Budget: ${formData.budget}
                                </p>
                                <div className={styles.developersGrid}>
                                    {developers.matching.map((dev) => (
                                        <div key={dev._id} className={styles.developerCard}>
                                            <div className={styles.aboutDev}>
                                                <img src={clientProfile} alt="Developer" />
                                                <div>
                                                    <h4>{dev.name}</h4>
                                                    <p>{dev.selectedRole} - {dev.selectedStatus}</p>
                                                </div>
                                            </div>
                                            <p className={styles.email}>{dev.email}</p>
                                            <div className={styles.devKnowledge}>
                                                {dev.selectedExperience?.map((exp, index) => (
                                                    <p key={index}>{exp}</p>
                                                ))}
                                            </div>
                                            <div className={styles.priceInfo}>
                                                <p>Price range: <span>${dev.priceRange || 'Not specified'}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className={styles.teamSelectButton}
                                    onClick={() => handleSubmit('Team B', developers.matching)}
                                >
                                    Select Team B
                                </button>
                            </div>

                            <div className={styles.developerColumn}>
                                <h4>Team C</h4>
                                <p className={styles.teamDescription}>
                                    Budget: ${formData.budget}
                                </p>
                                <div className={styles.developersGrid}>
                                    {developers.premium.map((dev) => (
                                        <div key={dev._id} className={styles.developerCard}>
                                            <div className={styles.aboutDev}>
                                                <img src={clientProfile} alt="Developer" />
                                                <div>
                                                    <h4>{dev.name}</h4>
                                                    <p>{dev.selectedRole} - {dev.selectedStatus}</p>
                                                </div>
                                            </div>
                                            <p className={styles.email}>{dev.email}</p>
                                            <div className={styles.devKnowledge}>
                                                {dev.selectedExperience?.map((exp, index) => (
                                                    <p key={index}>{exp}</p>
                                                ))}
                                            </div>
                                            <div className={styles.priceInfo}>
                                                <p>Price range: <span>${dev.priceRange || 'Not specified'}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className={styles.teamSelectButton}
                                    onClick={() => handleSubmit('Team C', developers.premium)}
                                >
                                    Select Team C
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showProjects && (
                    <div className={styles.projectsGrid}>
                        {projects.map((project) => (
                            <div key={project._id} className={styles.projectCard}>
                                <div className={styles.cardHeader}>
                                    <h3>{project.projectName}</h3>
                                    <div className={styles.cardMeta}>
                                        <span>Budget: ${project.budget}</span>
                                        <span className={styles.status}>{project.status}</span>
                                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    <details>
                                        <summary>Project Overview</summary>
                                        <div className={styles.detailsContent}>
                                            <p><strong>Type:</strong> {project.projectType}</p>
                                            <p><strong>Problem:</strong> {project.problemSolution}</p>
                                            <p><strong>Users:</strong> {project.targetUsers}</p>
                                            <p><strong>Expected Results:</strong> {project.expectedResults}</p>
                                        </div>
                                    </details>

                                    <details>
                                        <summary>Goals & Functions</summary>
                                        <div className={styles.detailsContent}>
                                            <p><strong>Goals:</strong> {project.projectGoals}</p>
                                            <p><strong>Improvements:</strong> {project.improvements}</p>
                                            <p><strong>Specific Results:</strong> {project.specificResults}</p>
                                            <p><strong>Core Functions:</strong> {project.mainFunctions}</p>
                                            <p><strong>Function Usage:</strong> {project.functionUsage}</p>
                                            <p><strong>User Actions:</strong> {project.userActions}</p>
                                        </div>
                                    </details>

                                    <details>
                                        <summary>Design & Technical</summary>
                                        <div className={styles.detailsContent}>
                                            <p><strong>Design Look:</strong> {project.designLook}</p>
                                            <p><strong>Design Elements:</strong> {project.designElements}</p>
                                            <p><strong>Content Organization:</strong> {project.contentOrganization}</p>
                                            <p><strong>Technologies:</strong> {project.technologies}</p>
                                            <p><strong>Operating Systems:</strong> {project.operatingSystems}</p>
                                            <p><strong>Hardware Requirements:</strong> {project.hardwareRequirements}</p>
                                            <p><strong>Performance Standards:</strong> {project.performanceStandards}</p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
