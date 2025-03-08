const Joi = require('joi');

const validateMedication = (data, isUpdate = false) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100)
      .when('$isUpdate', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    description: Joi.string().max(500)
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    dosage: Joi.string()
      .when('$isUpdate', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'any.required': 'Dosage is required'
      }),
    frequency: Joi.string()
      .when('$isUpdate', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'any.required': 'Frequency is required'
      }),
    startDate: Joi.date()
      .when('$isUpdate', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required'
      }),
    endDate: Joi.date().min(Joi.ref('startDate')).allow(null)
      .messages({
        'date.min': 'End date must be after start date'
      }),
    instructions: Joi.string().max(1000)
      .messages({
        'string.max': 'Instructions cannot exceed 1000 characters'
      }),
    patient: Joi.string().hex().length(24)
      .when('$isUpdate', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'string.hex': 'Patient ID must be a valid MongoDB ID',
        'string.length': 'Patient ID must be a valid MongoDB ID',
        'any.required': 'Patient ID is required'
      }),
    isActive: Joi.boolean()
  });

  return schema.validate(data, { 
    abortEarly: false,
    context: { isUpdate }
  });
};

module.exports = {
  validateMedication
};