// server/src/controllers/medicationController.js
const Medication = require('../models/Medication');
const MedicationLog = require('../models/MedicationLog');
const { ApiError, asyncHandler } = require('../middlewares/errorHanlder');
const { validateMedication } = require('../validations/medicationValidation');
const { ROLES } = require('../models/User');

/**
 * Create a new medication
 * @route POST /api/medications
 * @access Private (Doctor, Admin)
 */
const createMedication = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = validateMedication(req.body);
  if (error) {
    throw new ApiError(400, 'Validation error', true, null, error.details);
  }
  
  // Create medication
  const medication = new Medication({
    ...value,
    prescribedBy: req.user._id
  });
  
  await medication.save();
  
  res.status(201).json({
    success: true,
    medication
  });
});

/**
 * Get all medications
 * @route GET /api/medications
 * @access Private (Role based)
 */
const getMedications = asyncHandler(async (req, res) => {
  let query = {};
  
  // Filter by role
  if (req.user.role === ROLES.PATIENT) {
    // Patients can only see their own medications
    query.patient = req.user._id;
  } else if (req.user.role === ROLES.DOCTOR) {
    // Doctors can see medications they prescribed
    query.prescribedBy = req.user._id;
  }
  // Admins and nurses can see all medications
  
  // Apply additional filters
  const { patient, active, startDate, endDate } = req.query;
  
  if (patient && req.user.role !== ROLES.PATIENT) {
    query.patient = patient;
  }
  
  if (active !== undefined) {
    query.isActive = active === 'true';
  }
  
  if (startDate) {
    query.startDate = { $gte: new Date(startDate) };
  }
  
  if (endDate) {
    query.endDate = { $lte: new Date(endDate) };
  }
  
  // Execute query with pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const medications = await Medication.find(query)
    .populate('patient', 'name email')
    .populate('prescribedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Medication.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: medications.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    medications
  });
});

/**
 * Get a single medication by ID
 * @route GET /api/medications/:id
 * @access Private (Role based)
 */
const getMedicationById = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id)
    .populate('patient', 'name email')
    .populate('prescribedBy', 'name');
  
  if (!medication) {
    throw new ApiError(404, 'Medication not found');
  }
  
  // Check permission based on role
  if (
    req.user.role === ROLES.PATIENT && 
    medication.patient.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to access this medication');
  }
  
  if (
    req.user.role === ROLES.DOCTOR && 
    medication.prescribedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to access this medication');
  }
  
  res.status(200).json({
    success: true,
    medication
  });
});

/**
 * Update a medication
 * @route PUT /api/medications/:id
 * @access Private (Doctor, Admin)
 */
const updateMedication = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = validateMedication(req.body, true);
  if (error) {
    throw new ApiError(400, 'Validation error', true, null, error.details);
  }
  
  // Find medication
  let medication = await Medication.findById(req.params.id);
  
  if (!medication) {
    throw new ApiError(404, 'Medication not found');
  }
  
  // Check permission for doctors
  if (
    req.user.role === ROLES.DOCTOR && 
    medication.prescribedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to update this medication');
  }
  
  // Update medication
  medication = await Medication.findByIdAndUpdate(
    req.params.id,
    { $set: value },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    medication
  });
});

/**
 * Delete a medication
 * @route DELETE /api/medications/:id
 * @access Private (Doctor, Admin)
 */
const deleteMedication = asyncHandler(async (req, res) => {
  // Find medication
  const medication = await Medication.findById(req.params.id);
  
  if (!medication) {
    throw new ApiError(404, 'Medication not found');
  }
  
  // Check permission for doctors
  if (
    req.user.role === ROLES.DOCTOR && 
    medication.prescribedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to delete this medication');
  }
  
  // Delete medication
  await Medication.findByIdAndDelete(req.params.id);
  
  // Also delete all logs for this medication
  await MedicationLog.deleteMany({ medication: req.params.id });
  
  res.status(200).json({
    success: true,
    message: 'Medication deleted successfully'
  });
});

/**
 * Log medication intake
 * @route POST /api/medications/:id/log
 * @access Private
 */
const logMedicationIntake = asyncHandler(async (req, res) => {
  const { status = 'taken', notes, takenAt } = req.body;
  
  // Find medication
  const medication = await Medication.findById(req.params.id);
  
  if (!medication) {
    throw new ApiError(404, 'Medication not found');
  }
  
  // Check permission for patients
  if (
    req.user.role === ROLES.PATIENT && 
    medication.patient.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to log this medication');
  }
  
  // Create log
  const log = new MedicationLog({
    medication: medication._id,
    patient: medication.patient,
    status,
    notes,
    takenAt: takenAt || new Date(),
    recordedBy: req.user._id
  });
  
  await log.save();
  
  res.status(201).json({
    success: true,
    log
  });
});

/**
 * Get medication logs
 * @route GET /api/medications/:id/logs
 * @access Private (Role based)
 */
const getMedicationLogs = asyncHandler(async (req, res) => {
  // Find medication
  const medication = await Medication.findById(req.params.id);
  
  if (!medication) {
    throw new ApiError(404, 'Medication not found');
  }
  
  // Check permission based on role
  if (
    req.user.role === ROLES.PATIENT && 
    medication.patient.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to access these logs');
  }
  
  if (
    req.user.role === ROLES.DOCTOR && 
    medication.prescribedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to access these logs');
  }
  
  // Execute query with pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const logs = await MedicationLog.find({ medication: req.params.id })
    .populate('recordedBy', 'name role')
    .sort({ takenAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await MedicationLog.countDocuments({ medication: req.params.id });
  
  res.status(200).json({
    successsuccess: true,
    count: logs.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    logs
  });
});

module.exports = {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
  logMedicationIntake,
  getMedicationLogs
};