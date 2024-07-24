const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'User',],
    default: 'User',
  }
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  delete object.password;
  return object;
});
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;