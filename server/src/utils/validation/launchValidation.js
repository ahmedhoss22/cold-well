const Joi = require('joi');

const multiLanguageSchema = Joi.object({
  en: Joi.string().optional(),
  ar: Joi.string().optional(),
});

const launchValidationSchema = Joi.object({
  developer:Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
  .optional(),

  launchDetails: multiLanguageSchema.optional(),
  launchName: multiLanguageSchema.optional(),

  location: Joi.object({
    name: multiLanguageSchema.optional(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  }).required(),

  description: multiLanguageSchema.optional(),
});

module.exports = launchValidationSchema;
