const jwt = require("jsonwebtoken");

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const generateAuthToken = async (user) => {
  const secret = process.env.JWT_TOKEN_SECRET;
  const payload = { _id: user._id, role: user.role };
  const expiresIn = process.env.JWT_TOKEN_EXPIRES_IN;

  let token = generateToken(payload, secret, expiresIn);
  return { token };
};

const createSendToken = async (user, res) => {
  const { token } = await generateAuthToken(user);
  res.success({ data: token });
};
module.exports = {
  createSendToken,
  generateAuthToken,
};
