// server/src/models/MedicationLog.js
const mongoose = require('mongoose');

const MedicationLogSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: [true, 'Medication reference is required']
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient reference is required']
  },
  takenAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'postponed'],
    default: 'taken'
  },
  notes: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User who recorded this entry is required']
  }
}, {
  timestamps: true
});

// Create index for efficient querying
MedicationLogSchema.index({ medication: 1, patient: 1, takenAt: -1 });

module.exports = mongoose.model('MedicationLog', MedicationLogSchema);