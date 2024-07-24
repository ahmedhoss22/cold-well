const {
  createArea,
  updateArea,
  getAllArea,
  topAreas,
  deleteArea,
  getArea,
  getAreaNames,
} = require("../controllers/areaController");
const multerConfig = require("../utils/multer");
const { validateRequestBody } = require("../utils/validate");
const { createAreaSchema, updateAreaSchema } = require("../utils/validation/areaValidation");

const router = require("express").Router();
router.get("/get-names", getAreaNames);
router.post(
  "/create",
  multerConfig.fields([{ name: "images" }]),
  validateRequestBody(createAreaSchema),
  createArea
); 
router.put(
  "/update/:areaId",
  multerConfig.fields([{ name: "images" }]),
validateRequestBody(updateAreaSchema),
  updateArea
);
router.get("/get-all", getAllArea);
router.get("/top-areas", topAreas);
router.delete("/delete/:areaId", deleteArea);
router.get("/get/:areaId", getArea);
module.exports = router;
