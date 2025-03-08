// server/src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const medicationRoutes = require('./medicationRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/medications', medicationRoutes);
router.use('/users', userRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

module.exports = router;

