const User = require('../models/users.model');
const Request = require('../models/request.model');
const mongoose = require('mongoose');
const Conversation = require('../models/conversation.model');

const getRequests = async (req, res) => {
    try {
        const { developerId } = req.query; 
        console.log("Fetching requests for developer:", developerId);

        if (!developerId || !mongoose.Types.ObjectId.isValid(developerId)) {
            return res.status(400).json({ message: "Invalid or missing developer ID" });
        }

        const requests = await Request.find({ developerId });
        console.log("Filtered requests:", requests);

        res.json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Error fetching requests" });
    }
};

const sendRequest = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body);

        let { userId, name, selectedRole, description, priceRange, projectName, developerId } = req.body;

        if (!developerId || !userId) {  
            return res.status(400).json({ 
                message: "Invalid or missing developer ID or client ID",
                receivedId: developerId
            });
        }

        // Check for existing pending request
        const existingRequest = await Request.findOne({
            userId: userId,
            developerId: developerId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You have already sent a request to this developer"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(developerId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                message: "Invalid ID format",
            });
        }

        const developer = await User.findById(developerId);
        if (!developer) {
            return res.status(404).json({ 
                message: "Developer not found",
                searchedId: developerId
            });
        }

        const newRequest = new Request({
            developerId: new mongoose.Types.ObjectId(developerId),
            userId: new mongoose.Types.ObjectId(userId),
            name,
            selectedRole,
            description,
            priceRange,
            projectName,
            status: 'pending',
        });

        await newRequest.save();

        res.status(201).json({
            message: "Request sent successfully!",
            request: newRequest,
        });
    } catch (error) {
        console.error("Error saving request:", error);
        res.status(500).json({ 
            message: "Error sending request", 
            error: error.message 
        });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        console.log("Backend: Processing accept request for ID:", requestId);
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ 
                message: "Request not found" 
            });
        }
        console.log("Backend: Found request:", request);
        const deleteResult = await Request.deleteOne({ _id: requestId });
        console.log("Backend: Delete result:", deleteResult);

        if (deleteResult.deletedCount === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Failed to delete request" 
            });
        }

        res.json({ 
            success: true,
            message: "Request accepted and deleted successfully",
            request: request
        });

    } catch (error) {
        console.error('Backend: Error in acceptRequest:', error);
        res.status(500).json({ 
            message: "Error accepting request",
            error: error.message 
        });
    }
};

const denyRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        await Request.findByIdAndDelete(requestId);
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ success: false, message: 'Error deleting request' });
    }
};

const checkExistingRequest = async (req, res) => {
    try {
        const { userId, developerId } = req.query;
        
        if (!userId || !developerId) {
            return res.status(400).json({
                message: "Missing userId or developerId"
            });
        }

        const existingRequest = await Request.findOne({
            userId: userId,
            developerId: developerId,
            status: "pending" // Only check for pending requests
        });

        console.log("Checking existing request:", { userId, developerId, exists: !!existingRequest });

        res.json({
            exists: !!existingRequest,
            request: existingRequest
        });

    } catch (error) {
        console.error("Error checking request:", error);
        res.status(500).json({
            message: "Error checking request",
            error: error.message
        });
    }
};

module.exports = {
    getRequests,
    sendRequest,
    denyRequest,
    acceptRequest,
    checkExistingRequest
};
