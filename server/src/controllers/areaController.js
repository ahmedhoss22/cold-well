const areaModel = require("../models/areaModel");
const compoundModel = require("../models/compoundModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
const { uploadImages, updateAndSet, deleteImages } = require("../utils/upload");
exports.getAreaNames = asyncHandler(async (req, res) => {
  const areas = await dbService.findMany(areaModel, {});

  const formattedAreas = areas.map((area) => ({
    _id: area._id,
    name: {
      en: area.title.en,
      ar: area.title.ar,
    },
  }));
  return res.success({ data: formattedAreas });
});
exports.createArea = asyncHandler(async (req, res) => {
  await uploadImages("images", req);
  const data = { ...req.body };
  const newArea = await dbService.create(areaModel, data);
  return res.success({ data: newArea });
});
exports.updateArea = asyncHandler(async (req, res) => {
  const area = await dbService.findOne(areaModel, { _id: req.params.areaId });
  if (!area) {
    return res.recordNotFound({ message: "this area not found..." });
  }
  if (req.files.images?.length > 0) {
    await updateAndSet(area, "images", req);
  }
  console.log(req.body);
  const updatedArea = await dbService.updateOne(
    areaModel,
    { _id: req.params.areaId },
    req.body
  );
  return res.success({ data: updatedArea });
});
exports.getAllArea = asyncHandler(async (req, res) => {
  const areas = await dbService.findMany(areaModel, {});
  return res.success({ data: areas });
});
exports.getArea = asyncHandler(async (req, res) => {
  const { areaId } = req.params;
  const { page = 1, size = 12 } = req.query;
  const pageNumber = parseInt(page);
  const pageSize = parseInt(size);
  const area = await dbService.findOne(areaModel, { _id: areaId });
  if (!area) {
    return res.recordNotFound({ message: "this area not found..." });
  }

  const skip = (pageNumber - 1) * pageSize;
  const compounds = await compoundModel
    .find({ area: areaId })
    .skip(skip)
    .limit(pageSize)
    .populate("developer")
    .populate("area");

  const totalCompounds = await compoundModel.countDocuments({ area: areaId });

  const totalPages = Math.ceil(totalCompounds / pageSize);

  return res.success({
    data: {
      area,
      totalCompounds,
      pagination: { totalPages, compounds, currentPage: pageNumber, pageSize },
    },
  });
});
exports.topAreas = asyncHandler(async (req, res) => {
  const top4Areas = await areaModel.aggregate([
    {
      $lookup: {
        from: "compounds",
        localField: "_id",
        foreignField: "area",
        as: "compounds",
      },
    },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "area",
        as: "properties",
      },
    },
    {
      $lookup: {
        from: "areas",
        localField: "_id",
        foreignField: "_id",
        as: "areaDetails",
      },
    },
    {
      $unwind: {
        path: "$areaDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        title: "$areaDetails.title",
        images: "$areaDetails.images",
        numberOfCompounds: { $size: "$compounds" },
        numberOfProperties: { $size: "$properties" },
      },
    },
    {
      $match: {
        numberOfProperties: { $gt: 0 }, numberOfCompounds:{$gt:0}
      },
    },
    {
      $sort: { numberOfCompounds: -1, numberOfProperties: -1 },
    },
    {
      $limit: 8,
    },
  ]);

  return res.success({ data: top4Areas });
});

exports.deleteArea = asyncHandler(async (req, res) => {
  const area = await dbService.findOne(areaModel, { _id: req.params.areaId });
  if (!area) {
    return res.recordNotFound({ message: "this area not found..." });
  }

  await deleteImages(area);
  const deletedArea = await dbService.deleteOne(areaModel, {
    _id: req.params.areaId,
  });
  return res.success({ data: deletedArea });
});
