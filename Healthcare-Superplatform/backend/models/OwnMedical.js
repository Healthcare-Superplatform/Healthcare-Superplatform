const mongoose = require('mongoose');

// Define the Own Medical schema
const ownMedicalSchema = new mongoose.Schema({
  SSN: { type: String },
  Name: { type: String },
  'Own Medicals': { type: String },
  Link: { type: String }
});

// Explicitly reference the collection name
const OwnMedical = mongoose.model('OwnMedical', ownMedicalSchema, 'own_medical');

module.exports = OwnMedical;
