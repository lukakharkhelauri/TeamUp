const express = require('express');
const projectController = require('../controllers/projects.controller');
const Project = require('../models/project.model');

const router = express.Router();

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
        const projectData = req.body;
        const newProject = new Project(projectData);
        await newProject.save();
        
        const populatedProject = await Project.findById(newProject._id)
            .populate('clientId')
            .populate('developerId');
            
        res.status(201).json({ success: true, project: populatedProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Error creating project' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('clientId')
            .populate('developerId');
            
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        res.json({ success: true, project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ success: false, message: 'Error fetching project' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('clientId')
        .populate('developerId');
        
        if (!updatedProject) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        res.json({ success: true, project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, message: 'Error updating project' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
});

module.exports = router; 