const express = require('express');
const {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
  logMedicationIntake,
  getMedicationLogs
} = require('../controllers/medicationController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../models/User');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all medications (role-based)
router.get('/', getMedications);

// Create medication (doctors and admins only)
router.post(
  '/',
  authorize([ROLES.DOCTOR, ROLES.ADMIN]),
  createMedication
);

// Get single medication (role-based)
router.get('/:id', getMedicationById);

// Update medication (doctors and admins only)
router.put(
  '/:id',
  authorize([ROLES.DOCTOR, ROLES.ADMIN]),
  updateMedication
);

// Delete medication (doctors and admins only)
router.delete(
  '/:id',
  authorize([ROLES.DOCTOR, ROLES.ADMIN]),
  deleteMedication
);

// Log medication intake (all roles)
router.post('/:id/log', logMedicationIntake);

// Get medication logs (role-based)
router.get('/:id/logs', getMedicationLogs);

module.exports = router;