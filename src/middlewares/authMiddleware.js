// server/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { ApiError, asyncHandler } = require('./errorHanlder');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Check for token in headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid token or user is deactivated');
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid token');
    }
    throw error;
  }
});

/**
 * Middleware to check if user has required role
 * @param {Array|String} roles - Required roles to access the route
 */
const authorize = (roles) => {
  // Convert single role to array
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Access denied. Insufficient permissions');
    }
    
    next();
  };
};

/**
 * Refresh token handler
 */
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    
    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    
    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Refresh token expired, please login again');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    throw error;
  }
});

module.exports = {
  authenticate,
  authorize,
  refreshToken
};