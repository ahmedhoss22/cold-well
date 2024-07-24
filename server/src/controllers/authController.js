const UserModel = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const { createSendToken } = require("../utils/authToken");
const dbService = require("../utils/dbService");

exports.register = asyncHandler(async (req, res) => {
  const existUser = await dbService.findOne(UserModel, {
    email: req.body.email,
  });
  if (existUser) {
    return res.badRequest({ message: "this email already in use...." });
  }
  const newUser = await dbService.create(UserModel, { ...req.body });
  return res.success({ data: newUser });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await dbService.findOne(UserModel, { email });
  if (!user) {
    return res.badRequest({ message: "wrong email or password" });
  }
  const isPasswordMatched = await user.isPasswordMatch(password);
  if (!isPasswordMatched) {
    return res.badRequest({ message: "wrong email or password" });
  }
  await createSendToken(user, res);
});

exports.currentUser = asyncHandler(async (req, res) => {
  const user = await dbService.findOne(UserModel, { _id: req.user._id });
  if (!user) {
    return res.recordNotFound({ message: "Can't find this user" });
  }
  res.success({ data: user });
});
