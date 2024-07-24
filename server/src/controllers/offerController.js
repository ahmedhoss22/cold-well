const developerModel = require("../models/developerModel");
const offerModel = require("../models/offerModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");

exports.createOffer = asyncHandler(async (req, res) => {
  console.log(req.body);
  const developer = await dbService.findOne(developerModel, {
    _id: req.body.developer,
  });
  if (!developer) {
    return res.recordNotFound({ message: "developer not found..." });
  }
  const newOffer = await dbService.create(offerModel, { ...req.body });
  return res.success({ data: newOffer });
});

exports.updateOffer = asyncHandler(async (req, res) => {
  const updatedOffer = await dbService.updateOne(
    offerModel,
    { _id: req.params.offerId },
    req.body
  );
  if (!updatedOffer) {
    return res.recordNotFound({ message: "Offer not found..." });
  }
  return res.success({ data: updatedOffer });
}); 

exports.getOffer = asyncHandler(async (req, res) => {
  const offer = await dbService.findOne(offerModel, {
    _id: req.params.offerId,
  });
  if (!offer) {
    return res.recordNotFound({ message: "offer not found..." });
  }
  return res.success({ data: offer });
});
exports.getAllOffers = asyncHandler(async (req, res) => {
  const offers = await dbService.findMany(offerModel, {});
  return res.success({ data: offers });
});

exports.deleteOffer = asyncHandler(async (req, res) => {
  const deletedOffer = await dbService.deleteOne(offerModel, {
    _id: req.params.offerId,
  });
  if (!deletedOffer) {
    return res.recordNotFound({ message: "Offer not found..." });
  }
  res.status(200).json({ message: "Offer deleted successfully" });
  return res.success({ data: deletedOffer._id });
});
