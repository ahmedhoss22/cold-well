const requestsModel = require("../models/requestsModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
exports.markAsRead = asyncHandler(async (req, res) => {
  const request = await dbService.findOne(requestsModel, {
    _id: req.params.requestId,
  });
  if (!request) {
    return res.recordNotFound({ message: "This Request is not Found..." });
  }
  if (request.markAsRead) {
    return res.badRequest({ message: "This Request Already Mark As Read..." });
  }
  await dbService.updateOne(
    requestsModel,
    { _id: req.params.requestId },
    { markAsRead: true }
  );
  return res.success();
});
exports.createAcademyRequest = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const alreadyRegistered = await dbService.findOne(requestsModel, {
    phone,
    academy: true,
  });
  if (alreadyRegistered) {
    return res.badRequest({ message: "Already registered" });
  }
  req.body.academy = true;
  const newAcademy = await dbService.create(requestsModel, req.body);
  return res.success({ data: newAcademy });
});

exports.getAllAcademyRequests = asyncHandler(async (req, res) => {
  const academyRequests = await dbService.findMany(requestsModel, {
    academy: true,
  });
  return res.success({ data: academyRequests });
});

exports.createContactRequest = asyncHandler(async (req, res) => {
  req.body.contact = true;
  const newContact = await dbService.create(requestsModel, req.body);
  return res.success({ data: newContact });
});


exports.getAllContactRequests = asyncHandler(async (req, res) => {
  const contactRequests = await dbService.findMany(requestsModel, {
    contact: true,
  });
  return res.success({ data: contactRequests });
});
exports.createSellPropertyRequest = asyncHandler(async (req, res) => {
  req.body.sellProperty = true;
  const newSellRequest = await dbService.create(requestsModel, req.body);
  return res.success({ data: newSellRequest });
});
exports.getAllSellPropertyRequest = asyncHandler(async (req, res) => {
  const sellRequests = await dbService.findMany(requestsModel, {
    sellProperty: true,
  });
  return res.success({ data: sellRequests });
});
exports.createPropertyRequest = asyncHandler(async (req, res) => {
  req.body.property = true;
  const newProperty = await dbService.create(requestsModel, req.body);
  return res.success({ data: newProperty });
});

exports.getAllPropertyRequests = asyncHandler(async (req, res) => {
  const propertyRequests = await dbService.findMany(requestsModel, {
    property: true,
  });
  return res.success({ data: propertyRequests });
});
