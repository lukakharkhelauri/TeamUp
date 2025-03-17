const User = require('../models/users.model');
const bcrypt = require('bcrypt');

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ success: false, message: `User not found with id "${req.params.id}"` });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, password, selectedRole, selectedStatus, selectedExperience, experienceYears, projectStyle, selectedFocus, priceRange} = req.body;

    if (!name || !email || !password || !selectedRole) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const user_candidate = await User.findOne({ email });
    if (user_candidate) {
      return res.status(400).json({ success: false, message: `User already registered with email "${email}"` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const new_user = new User({
      name,
      email,
      password: hashedPassword, 
      selectedRole,
      selectedStatus,
      selectedExperience,
      experienceYears,
      projectStyle,
      selectedFocus,
      priceRange
    });

    const savedUser = await new_user.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found with id "${req.params.id}"` });
    }

    const updated_user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({ success: true, user: updated_user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found with id "${req.params.id}"` });
    }
    await User.findByIdAndDelete(user._id);
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  updateOne,
  deleteOne,
};
