const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    markAsRead: { type: Boolean, default: false },
    academy: { type: Boolean, default: false },
    contact: { type: Boolean, default: false },
    property: { type: Boolean, default: false },
    sellProperty: { type: Boolean, default: false },
    propertyDetails: [
      {
        area: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },
        compound: { type: mongoose.Schema.Types.ObjectId, ref: "Compound" },
        type: { type: mongoose.Schema.Types.ObjectId, ref: "Type" },
      },
    ],
  },
  {
    timestamps: true,
  }
);
requestSchema.pre(/^find/, function (next) {
  this.populate({ path: "propertyDetails.area", select :"title" })
    .populate({path:"propertyDetails.compound",select:"name"})
    .populate({path :"propertyDetails.type", select :"name"});
  next();
});

const requestsModel = mongoose.model("Requests", requestSchema);

module.exports = requestsModel;
