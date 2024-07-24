const offerCtr = require("../controllers/offerController");
const { validateRequestBody } = require("../utils/validate");
const offerValidationSchema = require("../utils/validation/offerValidation");

const router = require("express").Router();

router.post(
    "/create-new",
    validateRequestBody(offerValidationSchema),
    offerCtr.createOffer
);
router.get("/get-one/:offerId", offerCtr.getOffer);
router.get("/get-all", offerCtr.getAllOffers);
router.put(
  "/update-one/:offerId",
  validateRequestBody(offerValidationSchema),
  offerCtr.updateOffer
);
router.delete("/delete-one/:offerId", offerCtr.deleteOffer);


module.exports = router;
