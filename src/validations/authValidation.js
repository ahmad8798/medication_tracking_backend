// server/src/validations/authValidation.js
const Joi = require('joi');
const { ROLES } = require('../models/User');

const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required()
      .messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      }),
    role: Joi.string().valid(...Object.values(ROLES))
      .messages({
        'any.only': `Role must be one of: ${Object.values(ROLES).join(', ')}`
      })
  });

  return schema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateRegister,
  validateLogin
};

