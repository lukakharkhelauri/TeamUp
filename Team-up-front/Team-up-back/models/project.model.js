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
    },
    showAdvanced: {
        type: Boolean,
        default: false
    },
    problemSolution: String,
    targetUsers: String,
    expectedResults: String,
    projectGoals: String,
    improvements: String,
    specificResults: String,
    mainFunctions: String,
    functionUsage: String,
    userActions: String,
    designLook: String,
    designElements: String,
    contentOrganization: String,
    technologies: String,
    operatingSystems: String,
    hardwareRequirements: String,
    performanceStandards: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);