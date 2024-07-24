const Joi = require('joi')

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

const locationSchema = Joi.object({
  lat: Joi.number().required().messages({
    'number.base': 'Latitude must be a number',
    'any.required': 'Latitude is required',
  }),
  lng: Joi.number().required().messages({
    'number.base': 'Longitude must be a number',
    'any.required': 'Longitude is required',
  }),
});


const compoundSchema = Joi.object({
  contactUsNumber: Joi.number().required().messages({
    'number.base': 'Contact Us Number must be a number',
    'any.required': 'Contact Us Number is required',
  }),
  name: multiLanguageSchema,
  description: multiLanguageSchema,
  location: locationSchema,
 
  area:Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'array.base': 'Area must be an array',
    'string.pattern.base': 'Area ID must be a valid ObjectId',
  }),
  developer: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'array.base': 'Developer must be an array',
    'string.pattern.base': 'Developer ID must be a valid ObjectId',
  }),
});

module.exports={
  compoundSchema
}