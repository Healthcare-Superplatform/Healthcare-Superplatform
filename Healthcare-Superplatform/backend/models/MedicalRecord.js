const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  SSN: { type: String, required: true },
  recordType: { 
    type: String, 
    required: true,
    enum: ['lab_result', 'vital_sign', 'imaging', 'prescription', 'vaccination', 'procedure']
  },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  values: mongoose.Schema.Types.Mixed, // Flexible structure for different record types
  flags: [{ type: String }], // e.g., ['abnormal', 'critical']
  notes: String,
  provider: String,
  archived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema, 'medical_records');