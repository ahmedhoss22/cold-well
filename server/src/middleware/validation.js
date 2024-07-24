const validateRequestParameters = (validationSchema) => {
    return (req, res, next) => {
      const validationResult = validationSchema.validate(req.body, { abortEarly: false, convert: false });
  
      if (validationResult.error) {
        if (req.files && req.files.image?.length > 0) {
          req.files.image.forEach(file => {
            fs.promises.unlink(path.join(__basedir, `uploads/${file.filename}`), err => {
              if (err) {
                console.error(`Failed to delete uploaded file on validation error: ${file.filename}`, err);
              }
            });
          });
        }
        if(req.files && req.files.video?.length>0){ 
          req.files.video.forEach(file => {
            fs.promises.unlink(path.join(__basedir, `uploads/${file.filename}`), err => {
              if (err) {
                console.error(`Failed to delete uploaded file on validation error: ${file.filename}`, err);
              }
            });
          });
        }
        const errors = validationResult.error.details.reduce((acc, errorDetail) => {
          acc[errorDetail.path.join('.')] = errorDetail.message;
          return acc;
        }, {});
        console.error(`Validation error: ${Object.values(errors).join(', ')}`);
        return res.validationError({errors});
      }
      next();
    };
  };