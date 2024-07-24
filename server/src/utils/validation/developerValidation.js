const Joi = require("joi");
const multiLanguageSchema = Joi.object({
  en: Joi.string().required().messages({
    'string.base': 'English text must be a string',
    'string.empty': 'English text is required',
    'any.required': 'English text is required',
  }),
  ar: Joi.string().required().messages({
    'string.base': 'Arabic text must be a string',
    'string.empty': 'Arabic text is required',
    'any.required': 'Arabic text is required',
  }),
});

const developerSchema = Joi.object({
  name: multiLanguageSchema,
  description: multiLanguageSchema,
  callUsNumber: Joi.string().required().messages({
    'number.base': 'Call Us Number must be a valid',
    'any.required': 'Call Us Number is valid',
  }),
  area:Joi.string()
});
module.exports = {
  developerSchema
};
