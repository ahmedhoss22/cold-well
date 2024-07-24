const Joi = require("joi");

const createAreaSchema = Joi.object({
    title: Joi.object({
        en: Joi.string().required().messages({
          'string.base': 'Title (English) must be a string',
          'string.empty': 'Title (English) is required',
        }),
        ar: Joi.string().required().messages({
          'string.base': 'Title (Arabic) must be a string',
          'string.empty': 'Title (Arabic) is required',
        }),
      }).required(),
      description: Joi.object({
        en: Joi.string().required().messages({
          'string.base': 'Description (English) must be a string',
          'string.empty': 'Description (English) is required',
        }),
        ar: Joi.string().required().messages({
          'string.base': 'Description (Arabic) must be a string',
          'string.empty': 'Description (Arabic) is required',
        }),
      }).required(),
      callUsNumber: Joi.string().required().messages({
        'string.base': 'Call Us Number must be a string',
        'string.empty': 'Call Us Number is required',
      }),
     
  launches: Joi.array().items(Joi.string().hex().length(24)).optional(),
  developers: Joi.array().items(Joi.string().hex().length(24)).optional(),
  compounds: Joi.array().items(Joi.string().hex().length(24)).optional(),
  properties: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

const updateAreaSchema = Joi.object({
    title: Joi.object({
        en: Joi.string().required().messages({
          'string.base': 'Title (English) must be a string',
          'string.empty': 'Title (English) is required',
        }),
        ar: Joi.string().required().messages({
          'string.base': 'Title (Arabic) must be a string',
          'string.empty': 'Title (Arabic) is required',
        }),
      }).required(),
      description: Joi.object({
        en: Joi.string().required().messages({
          'string.base': 'Description (English) must be a string',
          'string.empty': 'Description (English) is required',
        }),
        ar: Joi.string().required().messages({
          'string.base': 'Description (Arabic) must be a string',
          'string.empty': 'Description (Arabic) is required',
        }),
      }).required(),
      callUsNumber: Joi.string().required().messages({
        'string.base': 'Call Us Number must be a string',
        'string.empty': 'Call Us Number is required',
      }),
     
  launches: Joi.array().items(Joi.string().hex().length(24)).optional(),
  developers: Joi.array().items(Joi.string().hex().length(24)).optional(),
  compounds: Joi.array().items(Joi.string().hex().length(24)).optional(),
  properties: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

module.exports = {
  createAreaSchema,
  updateAreaSchema,
};
