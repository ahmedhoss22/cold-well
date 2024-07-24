const mongoose = require("mongoose");
const generateUniqueSlug = require("../utils/slugify");
const multiLanguage = {
  en: {
    type: String,
  },
  ar: {
    type: String,
  },
};
const developerSchema = new mongoose.Schema(
  {
    slug: {
  en: { type: String, unique: true, required: true },
  ar: { type: String, unique: true, required: true },
},
    name: multiLanguage,
    description: multiLanguage,
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    callUsNumber: String,
    compounds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Compound",
      },
    ],
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    compounds_count: {
      type: Number,
      default: 0,
    },
    area: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],
    launches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Launch",
      },
    ],
  },
  { timestamps: true }
);

developerSchema.pre('validate', async function (next) {
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
const developerModel = mongoose.model("Developer", developerSchema);

module.exports = developerModel;
