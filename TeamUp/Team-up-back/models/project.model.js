const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        enum: ['website', 'app', 'Startup'],
        required: true
    },
    problemSolution: {
        type: String,
        required: true
    },
    targetUsers: {
        type: String,
        required: true
    },
    expectedResults: {
        type: String,
        required: true
    },

    projectGoals: {
        type: String,
        required: true
    },
    improvements: {
        type: String,
        required: true
    },
    specificResults: {
        type: String,
        required: true
    },
    mainFunctions: {
        type: String,
        required: true
    },
    functionUsage: {
        type: String,
        required: true
    },
    userActions: {
        type: String,
        required: true
    },
    designLook: {
        type: String,
        required: true
    },
    designElements: {
        type: String,
        required: true
    },
    contentOrganization: {
        type: String,
        required: true
    },
    technologies: {
        type: String,
        required: true
    },
    operatingSystems: {
        type: String,
        required: true
    },
    hardwareRequirements: {
        type: String,
        required: true
    },
    performanceStandards: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);