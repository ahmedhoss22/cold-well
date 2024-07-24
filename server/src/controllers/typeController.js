const typeModel = require("../models/typeModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
const { uploadImages, updateAndSet, deleteImages } = require("../utils/upload");

exports.createType = asyncHandler(async (req, res) => {
  const newType = await dbService.create(typeModel, { ...req.body });
  return res.success({ data: newType });
});
exports.updateType = asyncHandler(async (req, res) => {
  const query = { _id: req.params.typeId };
  const type = await dbService.findOne(typeModel, query);
  if (!type) {
    return res.recordNotFound({ message: "type not found..." });
  }

  const updatedType = await dbService.updateOne(typeModel, query, req.body);
  return res.success({ data: updatedType });
});
exports.topTypes = asyncHandler(async (req, res) => {
  const top6Types = await typeModel.aggregate([
    {
      $lookup: {
        from: "properties",
        let: { typeId: "$_id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$typeId", "$type"] } } },
          { $count: "propertiesCount" }
        ],
        as: "properties"
      }
    },
    {
      $addFields: {
        propertiesCount: { $arrayElemAt: ["$properties.propertiesCount", 0] }
      }
    },
    {
      $sort: {
        propertiesCount: -1
      }
    },
    {
      $limit: 6
    },
    {
      $project: {
        name: 1,
        propertiesCount: 1,
        images: 1
      }
    }
  ]);
  
  return res.success({ data: top6Types });
});

exports.getAllTypes = asyncHandler(async (req, res) => {
  const types = await typeModel.aggregate([
    {
      $lookup: {
        from: "properties",
        let: { typeId: "$_id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$typeId", "$type"] } } },
          { $count: "propertiesCount" }
        ],
        as: "properties"
      }
    },
    {
      $addFields: {
        propertiesCount: { $arrayElemAt: ["$properties.propertiesCount", 0] }
      }
    },
    {
      $sort: {
        propertiesCount: -1
      }
    },
    {
      $project: {
        name: 1,
        propertiesCount: 1,
      }
    }
  ]);
  return res.success({ data: types });
});
exports.getType = asyncHandler(async (req, res) => {
  const query = { _id: req.params.typeId };
  const type = await dbService.findOne(typeModel, query);
  if (!type) {
    return res.recordNotFound({ message: "type not found..." });
  }
  return res.success({ data: type });
});

exports.deleteType = asyncHandler(async (req, res) => {
  const query = { _id: req.params.typeId };
  const type = await dbService.findOne(typeModel, query);
  if (!type) {
    return res.recordNotFound({ message: "type not found..." });
  }
  await deleteImages(type);
  const deletedType = await dbService.deleteOne(typeModel, query);
  return res.success({ data: deletedType });
});
