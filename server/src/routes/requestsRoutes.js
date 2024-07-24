const router = require("express").Router();

const requestsController = require("../controllers/requestsController");

router.put("/mark-as-read/:requestId/read", requestsController.markAsRead);
router.post("/academy", requestsController.createAcademyRequest);

router.get("/academy", requestsController.getAllAcademyRequests);

router.post("/contact", requestsController.createContactRequest);

router.get("/contact", requestsController.getAllContactRequests);

router.post("/property", requestsController.createPropertyRequest);

router.get("/property", requestsController.getAllPropertyRequests);

router.post("/sell-property", requestsController.createSellPropertyRequest);
router.get("/sell-property", requestsController.getAllSellPropertyRequest);

module.exports = router;
