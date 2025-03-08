// server/src/controllers/userController.js
const { User, ROLES } = require('../models/User');
const { ApiError, asyncHandler } = require('../middlewares/errorHanlder');

/**
 * Get all users
 * @route GET /api/users
 * @access Private (Admin only)
 */
const getUsers = asyncHandler(async (req, res) => {
  // Apply filters
  const { role, active, search } = req.query;
  
  const query = {};
  
  if (role && Object.values(ROLES).includes(role)) {
    query.role = role;
  }
  
  if (active !== undefined) {
    query.isActive = active === 'true';
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await User.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    users
  });
});

/**
 * Get a single user by ID
 * @route GET /api/users/:id
 * @access Private (Admin only)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  res.status(200).json({
    success: true,
    user
  });
});

/**
 * Update user role
 * @route PATCH /api/users/:id/role
 * @access Private (Admin only)
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!role || !Object.values(ROLES).includes(role)) {
    throw new ApiError(400, `Role must be one of: ${Object.values(ROLES).join(', ')}`);
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Update role
  user.role = role;
  await user.save();
  
  res.status(200).json({
    success: true,
    user
  });
});

/**
 * Toggle user active status
 * @route PATCH /api/users/:id/status
 * @access Private (Admin only)
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  if (isActive === undefined) {
    throw new ApiError(400, 'isActive field is required');
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Update status
  user.isActive = isActive;
  await user.save();
  
  res.status(200).json({
    success: true,
    user
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus
};