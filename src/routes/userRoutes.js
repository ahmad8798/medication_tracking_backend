// server/src/routes/userRoutes.js
const express = require('express');
const {
  getUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../models/User');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

// Get all users
router.get('/', getUsers);

// Get single user
router.get('/:id', getUserById);

// Update user role
router.patch('/:id/role', updateUserRole);

// Toggle user active status
router.patch('/:id/status', toggleUserStatus);

module.exports = router;