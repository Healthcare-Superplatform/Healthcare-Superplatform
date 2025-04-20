const mongoose = require('mongoose');

// Define the Medical List schema
const medicalListSchema = new mongoose.Schema({
  Location: { type: String },
  'Hospital name': { type: String },
  Link: { type: String },
  'Category(Public/private)': { type: String }
});

// Make sure the collection name is explicitly defined here
const MedicalList = mongoose.model('MedicalList', medicalListSchema, 'medical_list');

module.exports = MedicalList;
