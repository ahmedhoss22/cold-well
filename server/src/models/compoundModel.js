const mongoose = require("mongoose");
const generateUniqueSlug = require("../utils/slugify");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
});
const multiLanguage = {
  en: {
    type: String,
  },
  ar: {
    type: String,
  },
};

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});
const compoundSchema = new mongoose.Schema(
  {
    contactUsNumber:Number,
    name: multiLanguage,
    description: multiLanguage,
    location: locationSchema,
    thumbnail: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    slug: {
      en: { type: String, unique: true, required: true },
      ar: { type: String, unique: true, required: true },
    },
    amenities: [amenitySchema],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    area: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],
    developer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Developer",
      },
    ],
  },
  { timestamps: true }
);
compoundSchema.pre(/^find/, function(next){
  this.populate('developer').populate('area')
  // .populate('properties')
  next()
})
compoundSchema.pre('validate', async function (next) {
  try {
    if (this.isModified('name.en')) {
      this.slug.en = await generateUniqueSlug(this, 'name', 'en');
    }

    if (this.isModified('name.ar')) {
      this.slug.ar = await generateUniqueSlug(this, 'name', 'ar');
    }

    next();
  } catch (err) {
    next(err);
  }
});
const compoundModel = mongoose.model("Compound", compoundSchema);

module.exports = compoundModel;
