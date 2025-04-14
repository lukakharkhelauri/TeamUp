const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const axios = require('axios');

const HUNTER_API_KEY = '663462e543fab55bd97ecaa16c4d81e8f32c53a7';

// router.post('/', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Email and password required" });
//   }

//   try {
//     const hunterResponse = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${HUNTER_API_KEY}`);
//     const emailExists = hunterResponse.data.data.status !== 'invalid';

//     if (!emailExists) {
//       return res.status(400).json({ success: false, message: "Email does not exist." });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ success: false, message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid credentials" });
//     }

//     res.status(200).json({
//       success: true,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         email: user.email,
//         selectedRole: user.selectedRole
//       }
//     });
//   } catch (err) {
//     console.error("Error verifying email:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        selectedRole: user.selectedRole
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;