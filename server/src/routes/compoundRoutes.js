const {
  createCompound,
  updateCompound,
  getAllCompounds,
  getCompound,
  topCompounds,
  getCompoundsNames,
  deleteCompound,
} = require("../controllers/compoundController");
const multerConfig = require("../utils/multer");

const router = require("express").Router();
router.post(
  "/create", 
  multerConfig.fields([{ name: "thumbnail" },{name:"images", maxCount:8}]),
  createCompound
);
router.put(
  "/update/:compoundId",
  multerConfig.fields([{ name: "images" }, { name: "thumbnail" }]),
  updateCompound
);
router.get("/get-all", getAllCompounds);
router.get("/get/:compoundId", getCompound);
router.get("/get-top", topCompounds);
router.get("/get-names", getCompoundsNames);
router.delete("/delete/:compoundId", deleteCompound);
module.exports = router;
