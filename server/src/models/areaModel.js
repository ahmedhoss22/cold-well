const mongoose = require("mongoose");
const slugify = require('slugify');
const generateUniqueSlug = require("../utils/slugify");
const areaSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    slug: {
      en: { type: String, unique: true, required: true },
      ar: { type: String, unique: true, required: true },
    },
    propertiesAvailable: { type: Number, default: 0 },
    description: {
      en: { type: String, required: false },
      ar: { type: String, required: false },
    },
    callUsNumber: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
      },
    ],
    launches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Launch" }],
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }],
    compounds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Compound" }],
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  {
    timestamps: true,
  }
);

areaSchema.pre('validate', async function (next) {
  try {
    if (this.isModified('title.en')) {
      this.slug.en = await generateUniqueSlug(this, 'title', 'en');
    }

    if (this.isModified('title.ar')) {
      this.slug.ar = await generateUniqueSlug(this, 'title', 'ar');
    }

    next();
  } catch (err) {
    next(err);
  }
});
const areaModel = mongoose.model("Area", areaSchema);

module.exports = areaModel;

