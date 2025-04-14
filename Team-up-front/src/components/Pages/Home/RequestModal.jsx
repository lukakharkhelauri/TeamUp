import React, { useState } from 'react';
import { postRequest } from "../../../utils/api.js";
import Modal from 'react-modal';
import classes from "../../../modules/RequestModal.module.scss";

Modal.setAppElement('#root');

const RequestModal = ({ isOpen, onClose, selectedDeveloper }) => {
    const [priceRange, setPriceRange] = useState('');
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [requestSent, setRequestSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (requestSent) {
            setErrorMessage("You have already sent a request!");
            return;
        }

        const loggedUser = JSON.parse(localStorage.getItem("user"));
    
        if (!loggedUser || !loggedUser.name) {
            console.error('User not logged in or missing name');
            return;
        }

        if (!selectedDeveloper) {
            console.error("Error: No developer selected!");
            return; 
        }

        const requestData = {
            userId: loggedUser.id,
            name: loggedUser.name,  
            priceRange,
            projectName,
            description,
            status: "pending",
            selectedRole: loggedUser.selectedRole,  
            developerId: selectedDeveloper._id,  
        };

        try {
            await postRequest("/requests", requestData);
            setRequestSent(true);
            setErrorMessage('');
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Request Form"
            className={`${classes["modal-content"]} ${isOpen ? classes.show : ""}`}
            overlayClassName={`${classes["modal-overlay"]} ${isOpen ? classes.show : ""}`}
        >
            <h2>Send Request to {selectedDeveloper?.name || "No Developer Selected"}</h2>
            {requestSent && (
                <div className={classes.successBox}>Request sent successfully!</div>
            )}
            {errorMessage && (
                <div className={classes.errorBox}>{errorMessage}</div>
            )}
            <div>
                <label>Price Range:</label>
                <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="Enter price range"
                />
            </div>
            <div>
                <label>Project Name:</label>
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter project description"
                />
            </div>
            <button onClick={handleSubmit}>Submit Request</button>
            <button className={classes["close-btn"]} onClick={onClose}>Close</button>
        </Modal>
    );
};

export default RequestModal;