// server/src/controllers/authController.js
const { User } = require('../models/User');
const { ApiError, asyncHandler } = require('../middlewares/errorHanlder');
const { validateLogin, validateRegister } = require('../validations/authValidation');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = validateRegister(req.body);
  if (error) {
    throw new ApiError(400, 'Validation error', true, null, error.details);
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: value.email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }
  
  // Create new user
  const user = new User({
    name: value.name,
    email: value.email,
    password: value.password,
    role: value.role || 'patient' // Default role is patient
  });
  
  await user.save();
  
  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  
  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();
  
  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = validateLogin(req.body);
  if (error) {
    throw new ApiError(400, 'Validation error', true, null, error.details);
  }
  
  // Check if user exists
  const user = await User.findOne({ email: value.email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, 'Account is deactivated');
  }
  
  // Check if password is correct
  const isMatch = await user.comparePassword(value.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  
  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();
  
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  });
});

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token
  req.user.refreshToken = undefined;
  await req.user.save();
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile
};