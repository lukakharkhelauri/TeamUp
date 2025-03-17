const Project = require('../models/project.model');

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('clientId', 'name email selectedStatus')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Error fetching projects' });
    }
};

const createProject = async (req, res) => {
    try {
        const {
            projectName,
            projectType,
            problemSolution,
            targetUsers,
            expectedResults,
            projectGoals,
            improvements,
            specificResults,
            mainFunctions,
            functionUsage,
            userActions,
            designLook,
            designElements,
            contentOrganization,
            technologies,
            operatingSystems,
            hardwareRequirements,
            performanceStandards,
            budget,
            deadline,
            clientId
        } = req.body;

        // Check for required fields
        const requiredFields = [
            'projectName',
            'projectType',
            'problemSolution',
            'targetUsers',
            'expectedResults',
            'projectGoals',
            'improvements',
            'specificResults',
            'mainFunctions',
            'functionUsage',
            'userActions',
            'designLook',
            'designElements',
            'contentOrganization',
            'technologies',
            'operatingSystems',
            'hardwareRequirements',
            'performanceStandards',
            'budget',
            'deadline',
            'clientId'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const newProject = new Project({
            projectName,
            projectType,
            problemSolution,
            targetUsers,
            expectedResults,
            projectGoals,
            improvements,
            specificResults,
            mainFunctions,
            functionUsage,
            userActions,
            designLook,
            designElements,
            contentOrganization,
            technologies,
            operatingSystems,
            hardwareRequirements,
            performanceStandards,
            budget,
            deadline,
            clientId
        });

        const savedProject = await newProject.save();
        const populatedProject = await Project.findById(savedProject._id)
            .populate('clientId', 'name email selectedStatus');

        res.status(201).json({
            success: true,
            project: populatedProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project'
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('clientId', 'name email selectedStatus');
        
        if (!project) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found' 
            });
        }

        res.status(200).json({ success: true, project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching project' 
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('clientId', 'name email selectedStatus');

        if (!updatedProject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found' 
            });
        }

        res.status(200).json({ success: true, project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating project' 
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        
        if (!deletedProject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Project deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting project' 
        });
    }
};

module.exports = {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
}; 