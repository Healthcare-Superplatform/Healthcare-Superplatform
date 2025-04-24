const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  id: Number,
  name: String,
  question: String,
  diagnosis_yes: [String],
  diagnosis_no: [String],
}, { collection: 'symptoms' });

module.exports = mongoose.model('Symptom', symptomSchema);
