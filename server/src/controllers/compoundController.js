const areaModel = require("../models/areaModel");
const compoundModel = require("../models/compoundModel");
const developerModel = require("../models/developerModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
const { deleteImages, uploadImages, updateAndSet } = require("../utils/upload");
exports.getCompoundsNames = asyncHandler(async (req, res) => {
  const compounds = await dbService.findMany(compoundModel,{});
  
  const formattedCompounds = compounds.map((compound) => ({
    _id: compound._id,
    name: {
      en: compound.name.en,
      ar: compound.name.ar,
    },
  }));
  return res.success({ data: formattedCompounds });
});
exports.createCompound = asyncHandler(async (req, res) => {
  await uploadImages("images", req);
  await uploadImages("thumbnail", req);

  const data = { ...req.body };
  const newCompound = await dbService.create(compoundModel, data);

  const developer = await dbService.findOne(developerModel, { _id: req.body.developer });
  const area = await dbService.findOne(areaModel, { _id: req.body.area });
  const updateDeveloper = { $push: { compounds: newCompound._id } };
  const updateArea = { $push: { compounds: area._id } };
  await dbService.updateOne(
    developerModel,
    { _id: developer._id },
    updateDeveloper
  );
  await dbService.updateOne(
    areaModel,
    { _id: area._id },
    updateArea
  );

  return res.success({ data: newCompound });
});

exports.updateCompound = asyncHandler(async (req, res) => {
  const query = { _id: req.params.compoundId };
  const compound = await dbService.findOne(compoundModel, query);
  if (!compound) {
    return res.recordNotFound({ message: "compound not founded..." });
  }
  if (req.files.images?.length > 0) {
    await updateAndSet(developer, "images", req);
  }
  if (req.files.thumbnail?.length > 0) {
    await updateAndSet(developer, "thumbnail", req);
  }
  const updatedCompound = await dbService.updateOne(
    compoundModel,
    query,
    req.body
  );
  return res.success({ data: updatedCompound });
});

exports.topCompounds = asyncHandler(async (req, res) => {
  const intermediateResults = await compoundModel.aggregate([
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "compound",
        as: "properties",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        thumbnail: 1,
        properties: 1,
        numberOfProperties: { $size: "$properties" },
      },
    },
    {
      $match: {
        numberOfProperties: { $gt: 0 },
      },
    },
    {
      $limit: 12,
    },
  ]);

  return res.success({ data: intermediateResults });
});


exports.getCompound = asyncHandler(async (req, res) => {
  const query = { _id: req.params.compoundId };
  const compound = await dbService.findOne(compoundModel, query);
  if (!compound) {
    return res.recordNotFound({ message: "compound not founded..." });
  }
  const compoundPropertiesInfo = await compoundModel.aggregate([
    {
      $match: { _id: compound._id }, 
    },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "compound",
        as: "properties",
      },
    },
    {
      $unwind: "$properties", 
    },
    {
      $sort: { "properties.max_price": -1, "properties.min_price": 1 }, 
    },
    {
      $group: {
        _id: null,
           allPropertyLocations: { 
          $push: { 
            lng: "$properties.location.lng", 
            lat: "$properties.location.lat", 
            name: "$properties.name" 
          } 
        }, 
        maxPriceProperty: { $first: "$properties" }, 
        minPriceProperty: { $last: "$properties" },
        properties: { $push: "$properties" }, 
      },
    },
    {
      $project: {
        _id: 0,
        allPropertyLocations: 1,
        maxPriceProperty: {
          location: "$maxPriceProperty.location",
          max_price: "$maxPriceProperty.max_price",
          min_price: "$maxPriceProperty.min_price",
        },
        minPriceProperty: {
          location: "$minPriceProperty.location",
          max_price: "$minPriceProperty.max_price",
          min_price: "$minPriceProperty.min_price",
        },
      },
    },
  ]);
  const recommendations = await compoundModel.aggregate([
    {
      $match: { _id: compound._id },
    },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "compound",
        as: "properties",
      },
    },
    {
      $unwind: {
        path: "$properties",
      },
    },
    {
      $lookup: {
        from: 'areas', 
        localField: 'properties.area',
        foreignField: '_id',
        as: 'properties.area',
      },
    },
    {
      $lookup: {
        from: 'developers', 
        localField: 'properties.developer',
        foreignField: '_id',
        as: 'properties.developer',
      },
    },
    {
      $unwind: {
        path: "$properties.area",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$properties.developer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sample: { size: 6 },
    },
    {
      $project: {
        _id: "$properties._id",
        name: "$properties.name",
        addressLocality:"$properties.addressLocality",
        max_unit_area:"$properties.max_unit_area",
        area: "$properties.area",
        developer: "$properties.developer",
        location: "$properties.location",
        min_price: "$properties.min_price",
        max_price: "$properties.max_price",
        currency: "$properties.currency",
        thumbnail: "$properties.thumbnail",
        number_of_bathrooms: "$properties.number_of_bathrooms",
        number_of_bedrooms: "$properties.number_of_bedrooms",
        finishing: "$properties.finishing",
        resale: "$properties.resale",
        property_type: "$properties.property_type",
        delivery_in: "$properties.delivery_in",
        sale_type: "$properties.sale_type",
        forSale: "$properties.forSale",
        forRent: "$properties.forRent",
        featured: "$properties.featured",
        amenities: "$properties.amenities",
        description: "$properties.description",
        payment_plans: "$properties.payment_plans",
        createdAt: "$properties.createdAt",
        updatedAt: "$properties.updatedAt",
      },
    },
  ]);

  return res.success({ data: {compound, compoundPropertiesInfo,recommendations} });
});

exports.getAllCompounds = asyncHandler(async (req, res) => {
  const compounds = await dbService.findMany(compoundModel);
  return res.success({ data: compounds });
});
exports.deleteCompound = asyncHandler(async (req, res) => {
  const query = { _id: req.params.compoundId };
  const compound = await dbService.findOne(compoundModel, query);
  if (!compound) {
    return res.recordNotFound({ message: "compound not founded..." });
  }
  await deleteImages(compound);
  const deletedCompound = await dbService.deleteOne(compoundModel, query);
  return res.success({ data: deletedCompound });
});
