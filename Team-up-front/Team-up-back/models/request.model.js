const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true,
  },
  userId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  selectedRole: {
    type: String,
    required: true,
    enum: ['client', 'developer'],  
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "denied"],
    default: "pending",
  },
  description: {
    type: String,  
  },
  priceRange: {
    type: String
  },
  projectName: {
    type: String, 
  }
});

module.exports = mongoose.model('Request', requestSchema);
