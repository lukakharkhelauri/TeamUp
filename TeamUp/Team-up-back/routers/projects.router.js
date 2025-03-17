const express = require('express');
const projectController = require('../controllers/projects.controller');
const Project = require('../models/project.model');

const router = express.Router();

router.route('/')
    .get(projectController.getAllProjects)
    .post(projectController.createProject);

router.route('/:id')
    .get(projectController.getProjectById)
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('clientId')
            .populate('developerId');
        res.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Error fetching projects' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { projectName, description, budget, deadline, clientId, projectType, status } = req.body;
        
        const newProject = new Project({
            projectName,
            description,
            budget,
            deadline,
            clientId,
            projectType,
            status
        });

        await newProject.save();
        res.status(201).json({ success: true, project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Error creating project' });
    }
});

module.exports = router; 