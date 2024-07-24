const Joi = require("joi");

const multiLanguage = Joi.object({
  en: Joi.string().optional().allow(""),
  ar: Joi.string().optional().allow(""),
});

const offerValidationSchema = Joi.object({
  offerNumber: Joi.number().integer().optional(),
  offerNote: multiLanguage.optional(),
  offerName: multiLanguage.required().messages({
    "any.required": "Offer Name is required in both English and Arabic",
  }),
  developer: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional(),
  downPayment: Joi.string().required().messages({
    "string.empty": "Down Payment is required",
  }),
  installmentYears: Joi.string().required().messages({
    "string.empty": "Installment Years are required",
  }),
  oldOffer: Joi.object({
    downPayment: Joi.string().optional().allow(""),
    installmentYears: Joi.string().optional().allow(""),
  }).optional(),
  whatsapp: Joi.string().required().messages({
    "string.base": "whatsapp must be a string",
    "string.empty": "whatsapp is required",
  }),
  referenceNumber: Joi.string().length(8).pattern(/^\d+$/).optional(),
});

module.exports = offerValidationSchema;
