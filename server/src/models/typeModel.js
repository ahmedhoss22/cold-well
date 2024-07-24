const mongoose = require("mongoose");
const generateUniqueSlug = require("../utils/slugify");

const multiLanguage = {
  en: {
    type: String,
    trim: true,
  },
  ar: {
    type: String,
    trim: true,
  },
};

const typeSchema = new mongoose.Schema(
  {
    name: multiLanguage,
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  slug: {
    en: { type: String, unique: true, required: true },
    ar: { type: String, unique: true, required: true },
  },
  },
  { timestamps: true }
);
typeSchema.pre(/^find/, function (next) {
    this.populate({ path: "properties"})
    next();
  });

  typeSchema.pre('validate', async function (next) {
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
const typeModel = mongoose.model("Type", typeSchema);

module.exports = typeModel;
