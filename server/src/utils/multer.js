const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__basedir, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${uuidv4()}--${file.originalname}`);
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image or video! Please upload an image or video.'), false);
  }
};
const multerConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 30 * 1024 * 1024, 
  },
});

module.exports = multerConfig;
