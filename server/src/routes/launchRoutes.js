const {
  createLaunch,
  latestLaunches,
  getLaunch,
  getDeveloperLaunches,
  getAllLaunches,
  updateLaunch,
  deleteLaunch,
} = require("../controllers/launchController");
const multerConfig = require("../utils/multer");
const { validateRequestBody } = require("../utils/validate");
const launchValidationSchema = require("../utils/validation/launchValidation");

const router = require("express").Router();

router.post(
  "/create",
  multerConfig.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateRequestBody(launchValidationSchema),
  createLaunch
);
router.get("/get/:launchId", getLaunch);
router.get("/developer-launch/:developerId", getDeveloperLaunches);
router.get("/get-all", getAllLaunches);
router.get("/get-latest", latestLaunches);
router.put(
  "/update/:launchId",
  multerConfig.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateRequestBody(launchValidationSchema),
  updateLaunch
);
router.delete("/delete/:launchId", deleteLaunch);
module.exports = router;
