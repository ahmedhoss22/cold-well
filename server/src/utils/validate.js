const validateRequestBody = (validationSchema) => {

  return (req, res, next) => {
    console.log(req.body);
    const validationResult = validationSchema.validate(req.body, {
      abortEarly: false,
      convert: false,
      context: { index: 0 },
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map(
        (errorDetail) => errorDetail.message
      );
      console.error(`Validation error: ${errorMessages.join(", ")}`);
      return res.validationError({ errors: errorMessages });
    }

    next();
  };
};

module.exports = { validateRequestBody };
