const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  SSN: { type: String, required: true },

  // Include all possible record types (add 'treatment_plan')
  recordType: {
    type: String,
    required: true,
    enum: [
      'lab_result',
      'vital_sign',
      'imaging',
      'prescription',
      'vaccination',
      'procedure',
      'treatment_plan'  // ✅ Added for compatibility
    ]
  },

  title: { type: String, required: true },
  date: { type: Date, required: true },

  // Keep it flexible to support various structures
  values: mongoose.Schema.Types.Mixed,

  // Optional flags like 'abnormal', 'elevated', etc.
  flags: [{ type: String }],

  // Optional additional notes
  notes: { type: String },

  // Doctor, hospital, clinic etc.
  provider: { type: String },

  // If archived, hide from normal views
  archived: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema, 'medical_records');
