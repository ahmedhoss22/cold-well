const areaModel = require("../models/areaModel");
const compoundModel = require("../models/compoundModel");
const developerModel = require("../models/developerModel");
const propertyModel = require("../models/propertyModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
const { deleteImages, updateAndSet, uploadImages } = require("../utils/upload");
exports.getDeveloperNames = asyncHandler(async (req, res) => {
  const developers = await dbService.findMany(developerModel,{});
  
  const formattedDevelopers = developers.map((developer) => ({
    _id: developer._id,
    name: {
      en: developer.name.en,
      ar: developer.name.ar,
    },
  }));
  return res.success({ data: formattedDevelopers });
});
exports.createDeveloper = asyncHandler(async (req, res) => {
  await uploadImages("images", req);
  const data = { ...req.body };
  const newDeveloper = await dbService.create(developerModel, data);

  const areaId= req.body.area
  const updateData = { $push: { developers: newDeveloper._id } };
  const getArea = await dbService.findOne(areaModel,{_id: areaId})
 await dbService.updateOne(areaModel,{_id:getArea._id},updateData)
  return res.success({data:newDeveloper});
});
exports.updateDeveloper = asyncHandler(async (req, res) => {
  const developer = await dbService.findOne(developerModel, {
    _id: req.params.developerId,
  });
  if (!developer) {
    return res.recordNotFound({ message: " this developer not founded..." });
  }
  if (req.files.images?.length > 0) {
    await updateAndSet(developer, "images", req);
  }
  
  const updatedDeveloper = await dbService.updateOne(
    developerModel,
    { _id: req.params.developerId },
    req.body
  );
  return res.success({ data: updatedDeveloper });
});

exports.getDeveloper = asyncHandler(async (req, res) => {
  const developer = await dbService.findOne(developerModel, {
    _id: req.params.developerId,
  });
  if (!developer) {
    return res.recordNotFound({ message: " this developer not founded..." });
  }
  const properties= await dbService.findMany(propertyModel,{developer:developer._id})
  const compounds= await dbService.findMany(compoundModel,{developer:developer._id})
  // const properties= await dbService.findMany(lunch,{developer:developer._id})
  const pricesStartFrom = await developerModel.aggregate([
    {
      $match: { _id: developer._id },
    },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "developer",
        as: "properties",
      },
    },
    {
      $unwind: "$properties",
    },
    {
      $group: {
        _id: "$_id",
        min_price: { $min: "$properties.min_price" },
      },
    },
    {
      $project: {
        _id: 0,
        min_price: 1,
      },
    }, 
  ]);
  console.log(pricesStartFrom);
  return res.success({ data: {developer,properties,compounds , pricesStartFrom} });
});
exports.getAllDevelopers = asyncHandler(async (req, res) => {
  const developers = await dbService.findMany(developerModel);
  return res.success({ data: developers });
});
exports.deleteDeveloper = asyncHandler(async (req, res) => {
  const developer = await dbService.findOne(developerModel, {
    _id: req.params.developerId,
  });
  if (!developer) {
    return res.recordNotFound({ message: " this developer not founded..." });
  }
  await deleteImages(developer);
  const deletedDeveloper = await dbService.deleteOne(developerModel, {
    _id: req.params.developerId,
  });
  return res.success({ data: deletedDeveloper });
});
