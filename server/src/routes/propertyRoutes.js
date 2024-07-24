const {
  createProperty,
  updateProperty,
  latestProperties,
  getLatestPropertiesForRent,
  getProperty,
  Search,
  compare,
  getAllProperties,
  deleteProperty,
} = require("../controllers/propertyController");
const multerConfig = require("../utils/multer");
const { validateRequestBody } = require("../utils/validate");
const { propertySchema } = require("../utils/validation/propertyValidation");

const router = require("express").Router();
router.get("/get-all",getAllProperties);
router.post(
  "/create",
  multerConfig.fields([{ name: "images" , maxCount:8 }, { name: "thumbnail" }]),
validateRequestBody(propertySchema),
  createProperty
);
router.put(
  "/update/:propertyId",
  multerConfig.fields([{ name: "images" }, { name: "thumbnail" }]),
  updateProperty
);
router.get("/get-latest", latestProperties);
router.get("/get/:propertyId", getProperty);
router.get("/for-rent", getLatestPropertiesForRent);
router.get("/search", Search);
router.get("/compare", compare);
router.delete("/delete/:propertyId", deleteProperty);

module.exports = router;
