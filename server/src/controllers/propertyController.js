const areaModel = require("../models/areaModel");
const compoundModel = require("../models/compoundModel");
const developerModel = require("../models/developerModel");
const propertyModel = require("../models/propertyModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
const { uploadImages } = require("../utils/upload");
exports.Search = asyncHandler(async (req, res) => {
  const { compound, type, beds, price } = req.query;

  const query = {};

  if (compound) {
    query.compound = compound;
  }

  if (type) {
    query.type = type;
  }

  if (beds) {
    query.number_of_bedrooms = parseInt(beds, 10);
  }

  if (price) {
    const priceRanges = {
      1: [1000000, 4000000],
      2: [4000000, 10000000],
      3: [10000000, 15000000],
      4: [15000000, 30000000],
      5: [30000000, 50000000],
    };

    if (priceRanges[price]) {
      query.min_price = { $gte: priceRanges[price][0] };
      query.max_price = { $lte: priceRanges[price][1] };
    }
  }

  const properties = await dbService.findMany(propertyModel, query);
  return res.success({ data: properties });
});
exports.createProperty = asyncHandler(async (req, res) => {
  await uploadImages("thumbnail", req);
  await uploadImages("images", req);
  const area = await dbService.findOne(areaModel, { _id: req.body.area[0] });
  if (!area) {
    return res.recordNotFound({ message: "area not found..." });
  }
  const compound = await dbService.findOne(compoundModel, {
    _id: req.body.compound[0],
  });
  if (!compound) {
    return res.recordNotFound({ message: "compound not found..." });
  }

  const newProperty = await dbService.create(propertyModel, req.body);
  const updateData = { $push: { properties: newProperty._id } };
  await dbService.updateOne(
    areaModel,
    { _id: req.body.area[0] },
    { ...updateData, $inc: { propertiesAvailable: 1 } }
  );
  await dbService.updateOne(
    compoundModel,
    { _id: req.body.compound[0] },
    updateData
  );
  if (req.body.developer) {
    const developer = await dbService.findOne(developerModel, {
      _id: req.body.developer[0],
    });
    if (!developer) {
      return res.recordNotFound({ message: "developer not found..." });
    }

    await dbService.updateOne(
      developerModel,
      { _id: req.body.developer[0] },
      updateData
    );
  }
  return res.success({ data: newProperty });
});
exports.updateProperty = asyncHandler(async (req, res) => {
  const query = { _id: req.params.propertyId };
  const property = await dbService.findOne(propertyModel, query);
  if (!property) {
    return res.recordNotFound({ message: "Property not found." });
  }
  const updatedProperty = await dbService.updateOne(
    propertyModel,
    { _id: query },
    req.body
  );
  return res.success({ data: updatedProperty });
});

exports.latestProperties = asyncHandler(async (req, res) => {
  const filter = {};
  const options = {};
  const limit = 6;
  const latestProperties = await dbService.findMany(
    propertyModel,
    filter,
    options,
    limit
  );
  return res.success({ data: latestProperties });
});

exports.getLatestPropertiesForRent = asyncHandler(async (req, res) => {
  const latestPropertiesForRent = await dbService.findMany(
    propertyModel,
    { forRent: true },
    {},
    6
  );

  return res.success({ data: latestPropertiesForRent });
});

exports.getProperty = asyncHandler(async (req, res) => {
  const query = { _id: req.params.propertyId };
  const property = await dbService.findOne(propertyModel, query);
  console.log(property);
  if (!property) {
    return res.recordNotFound({ message: "Property not found." });
  }
  return res.success({ data: property });
});

exports.compare = asyncHandler(async (req, res) => {
  const { ids } = req.query;
  const propertyIds = ids.split(",");
  console.log(ids);
  const properties = await dbService.findMany(propertyModel, {
    _id: { $in: propertyIds },
  });
  return res.success({ data: properties });
});

exports.getAllProperties = asyncHandler(async (req, res) => {
  const properties = await dbService.findMany(propertyModel, {});
  return res.success({ data: properties });
});
exports.deleteProperty = asyncHandler(async (req, res) => {
  const deletedProperty = await dbService.deleteOne(propertyModel, {
    _id: req.params.propertyId,
  });
  if (!deletedProperty) {
    return res.recordNotFound({ message: "Property not found..." });
  }
  return res.success({
    data: deletedProperty._id,
    message: "Property deleted successfully",
  });
});
