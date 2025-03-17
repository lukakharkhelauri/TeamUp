const express = require('express');
const router = express.Router();
const Connection = require('../models/connection.model');
const User = require('../models/users.model');

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Fetching connections for user:", userId);

        // Find connections where the user is either developer or client
        const connections = await Connection.find({
            $or: [
                { developerId: userId },
                { clientId: userId }
            ]
        })
        .populate('developerId', 'name email selectedRole')
        .populate('clientId', 'name email selectedRole');

        console.log("Found connections:", connections);

        res.json({ 
            success: true,
            connections 
        });
    } catch (error) {
        console.error("Error fetching connections:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching connections",
            error: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { developerId, clientId, status } = req.body;
        console.log("Creating connection with:", { developerId, clientId, status });

        // Check if users exist
        const [developer, client] = await Promise.all([
            User.findById(developerId),
            User.findById(clientId)
        ]);

        if (!developer || !client) {
            console.log("User not found:", { developer, client });
            return res.status(404).json({
                success: false,
                message: "Developer or client not found"
            });
        }

        // Check for existing connection
        const existingConnection = await Connection.findOne({
            $or: [
                { developerId, clientId },
                { developerId: clientId, clientId: developerId }
            ]
        });

        if (existingConnection) {
            console.log("Connection already exists");
            return res.json({
                success: true,
                message: "Connection already exists",
                connection: existingConnection
            });
        }

        // Create new connection
        const newConnection = new Connection({
            developerId,
            clientId,
            status: status || 'active'
        });

        await newConnection.save();
        console.log("Connection created successfully:", newConnection);

        res.status(201).json({
            success: true,
            message: "Connection created successfully",
            connection: newConnection
        });

    } catch (error) {
        console.error("Error creating connection:", error);
        res.status(500).json({
            success: false,
            message: "Error creating connection",
            error: error.message
        });
    }
});

module.exports = router; 