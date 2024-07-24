const {
  createDeveloper,
  updateDeveloper,
  getDeveloper,
  getAllDevelopers,
  deleteDeveloper,
  getDeveloperNames,
} = require("../controllers/developerController");
const multerConfig = require("../utils/multer");
const { validateRequestBody } = require("../utils/validate");
const {developerSchema} =require('../utils/validation/developerValidation')
const router = require("express").Router();
router.post(
  "/create",
  multerConfig.fields([{ name: "images" }]),
  validateRequestBody( developerSchema ),
  createDeveloper
);
router.put(
  "/update/:developerId",
  multerConfig.fields([{ name: "images" }]), 
  updateDeveloper
);

router.get("/get/:developerId", getDeveloper);
router.get("/get-all", getAllDevelopers);
router.get("/get-names", getDeveloperNames);
router.delete("/delete/:developerId", deleteDeveloper);

module.exports = router;
