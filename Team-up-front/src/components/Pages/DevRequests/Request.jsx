import { useEffect, useState } from "react";
import { getRequest, postRequest, patchRequest } from "../../../utils/api.js"
import NavBar from "../../Main/Navbar.jsx";
import classes from "../../../modules/Requests/Request.module.scss";
import profilePic from "../../../assets/Home-page-pics/profile-pic.jpg";
import Footer from "../../Main/Footer.jsx"

const Request = () => {
    const [requests, setRequests] = useState([]); 
    const [filteredRequests, setFilteredRequests] = useState([]); 
    const signedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getRequest(`/requests`, { developerId: signedInUser.id });
                console.log("Fetched requests:", data);
                setRequests(data || []);
                setFilteredRequests(data?.filter(request => request.status === "pending") || []);
            } catch (error) {
                console.error("Error", error);
            }
        };

        if (signedInUser?.id) {
            fetchRequests();
        }
    }, []); 

    const handleAcceptRequest = async (requestId, requestData) => {
        try {
            await patchRequest(`/requests/${requestId}/accept`);
            console.log("Request accepted:", requestId);

            const connectionData = {
                developerId: signedInUser.id,
                clientId: requestData.userId,
                status: 'active'
            };
            
            console.log("Creating connection with data:", connectionData);
            await postRequest('/connections', connectionData);

            const updatedRequests = requests.filter(req => req._id !== requestId);
            const updatedFilteredRequests = filteredRequests.filter(req => req._id !== requestId);
            
            setRequests(updatedRequests);
            setFilteredRequests(updatedFilteredRequests);
            
            console.log("Request removed from UI");

        } catch (error) {
            console.error("Frontend: Error in accept process:", error);
            alert("Error accepting request. Please try again.");
        }
    };

    const handleDenyRequest = async (requestId) => {
        try {
            await patchRequest(`/requests/${requestId}/deny`);
            setRequests(prev => prev.filter(req => req._id !== requestId));
            setFilteredRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (error) {
            console.error("Error", error);
        }
    };

    return (
        <>
            <NavBar />
            <br /><br /><br /><br />
            <div className={classes["page-title"]}>
                <h1>Project Requests</h1>
                <br />
                <p>Review and manage incoming project requests</p>
            </div>

            <div className={classes["requests-container"]}>
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                        <div key={request._id} className={classes["client-requests"]}>
                            <div className={classes["client-name"]}>
                                <img src={profilePic} alt="Client Profile" className={classes["profile-img"]} />
                                <h3>{request.name}</h3>
                                <p>Status: {request.status}</p>
                            </div>

                            <div className={classes["project-info"]}>
                                <h4>Project Name: {request.projectName}</h4>
                                <p>Description: {request.description}</p>
                                <p>Price Range: {request.priceRange}</p>
                            </div>

                            <div className={classes["main-btns"]}>
                                <button
                                    className={classes["accept-btn"]}
                                    onClick={() => handleAcceptRequest(request._id, request)}
                                >
                                    Accept
                                </button>

                                <button
                                    className={classes["cancel-btn"]}
                                    onClick={() => handleDenyRequest(request._id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No pending requests yet.</p>
                )}
            </div>
            <br/><br/><br/><br/><br/><br/>
            <Footer />
        </>
    );
};

export default Request;