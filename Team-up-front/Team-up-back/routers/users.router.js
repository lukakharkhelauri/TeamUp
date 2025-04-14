const express = require('express');
const userController = require('../controllers/users.controller');
const User = require('../models/users.model');

const router = express.Router();

router.route('/')
  .get(userController.getAll)
  .post(userController.create);

router.route('/:id')
  .get(userController.getOne)
  .delete(userController.deleteOne);

router.get('/developers', async (req, res) => {
    try {
        const developers = await User.find({ selectedRole: 'developer' })
            .select('name _id');
        res.json(developers);
    } catch (error) {
        console.error('Error fetching developers:', error);
        res.status(500).json({ message: 'Error fetching developers' });
    }
});

module.exports = router;
