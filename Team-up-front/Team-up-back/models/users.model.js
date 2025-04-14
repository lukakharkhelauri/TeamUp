const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  selectedRole: {
    type: String,
    required: true,
    enum: ['client', 'developer'],  
  },
  selectedStatus: {
    type: String,  
    default: "company",
  },
  selectedExperience: {
    type: [String], 
    default: []     
  },
  experienceYears: {
    type: Map,
    of: Number, 
  },
  projectStyle: {
    type: [String]
  },
  selectedFocus: {
    type: [String]
  },
  priceRange: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
