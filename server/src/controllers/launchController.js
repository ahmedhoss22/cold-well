const developerModel = require("../models/developerModel");
const launchModel = require("../models/launchModel");
const asyncHandler = require("../utils/asyncHandler");
const dbService = require("../utils/dbService");
const { uploadImages, updateAndSet, deleteImages } = require("../utils/upload");

exports.createLaunch = asyncHandler(async (req, res) => {
  await uploadImages("video", req);
  await uploadImages("thumbnail", req);
  const developer = await dbService.findOne(developerModel, {
    _id: req.body.developer,
  });
  if (!developer) {
    return res.recordNotFound({ message: "developer not found..." });
  }
  const newLaunch = await dbService.create(launchModel, req.body);
  const updateDeveloper = { $push: { launches: newLaunch._id } };
  await dbService.updateOne(
    developerModel,
    { _id: developer._id },
    updateDeveloper
  );
  return res.success({ data: newLaunch });
});

exports.latestLaunches = asyncHandler(async (req, res) => {
  const filter = {};
  const options = {};
  const limit = 6;
  const latestLaunches = await dbService.findMany(
    launchModel,
    filter,
    options,
    limit
  );
  return res.success({ data: latestLaunches });
});
exports.getLaunch = asyncHandler(async (req, res) => {
  const launch = await dbService.findOne(launchModel, {
    _id: req.params.launchId,
  });
  if (!launch) {
    return res.recordNotFound({ message: "launch not found.." });
  }
  return res.success({ data: launch });
});

exports.getDeveloperLaunches = asyncHandler(async (req, res) => {
  const developer = await dbService.findOne(developerModel, {
    _id: req.params.developerId,
  });
  if (!developer) {
    return res.recordNotFound({ message: "developer not found..." });
  }
  const launch = await dbService.findMany(launchModel, {
    developer: developer._id,
  });
  return res.success({ data: launch });
});
exports.getAllLaunches = asyncHandler(async (req, res) => {
  const launches = await dbService.findMany(launchModel);
  return res.success({ data: launches });
});

exports.updateLaunch = asyncHandler(async (req, res) => {
  const launch = await dbService.findOne(launchModel, {
    _id: req.params.launchId,
  });
  if (!launch) {
    return res.recordNotFound({ message: "launch not found..." });
  }

  if (req.files?.video?.length > 0) {
    await updateAndSet(launch, "video", req);
  }
  if (req.files?.thumbnail?.length > 0) {
    await updateAndSet(launch, "thumbnail", req);
  }

  const updatedLaunch = await dbService.updateOne(
    launchModel,
    { _id: req.params.launchId },
    req.body
  );
  if (!updatedLaunch) {
    return res.recordNotFound({ message: "Launch not found..." });
  }
  return res.success({ data: updatedLaunch });
});
exports.deleteLaunch = asyncHandler(async (req, res) => {
  const deletedLaunch = await dbService.deleteOne(launchModel, {
    _id: req.params.launchId,
  });
  if (!deletedLaunch) {
    return res.recordNotFound({ message: "Launch not found..." });
  }
  await deleteImages(deletedLaunch);

  return res.success({
    data: deletedLaunch._id,
    message: "Launch deleted successfully",
  });
});
