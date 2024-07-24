const {
  updateType,
  getType,
  getAllTypes,
  topTypes,
  deleteType,
  createType,
} = require("../controllers/typeController");
const multerConfig = require("../utils/multer");

const router = require("express").Router();
router.post("/create", createType);
// multerConfig.fields([{ name: "images" }])
router.put(
  "/update/:typeId",
  updateType
);
router.get("/get-all", getAllTypes);
router.get("/get-top", topTypes);
router.get("/get/:typeId", getType);
router.delete("/delete/:typeId", deleteType);
 
module.exports = router;
