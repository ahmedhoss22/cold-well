const {
  register,
  login,
  currentUser,
} = require("../controllers/authController");
const { validateRequestBody } = require("../utils/validate");
const {
  registerSchema,
  loginSchema,
} = require("../utils/validation/authValidation");

const router = require("express").Router();
router.post("/register", validateRequestBody(registerSchema), register);
router.post("/login", validateRequestBody(loginSchema), login);
router.post("/current-user", currentUser);

module.exports = router;
