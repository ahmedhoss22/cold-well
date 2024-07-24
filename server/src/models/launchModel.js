const mongoose = require("mongoose");
const generateUniqueSlug = require("../utils/slugify");
const multiLanguage = {
  en: {
    type: String,
  },
  ar: {
    type: String,
  },
}
const LaunchSchema = new mongoose.Schema({
  video: [
    {
      url: {
        type: String,
        required: true, 
      },
    },
  ],
  thumbnail: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
    required: true,
  },
  slug: {
  en: { type: String, unique: true, required: true },
  ar: { type: String, unique: true, required: true },
},
  launchDetails:multiLanguage,
  launchName:multiLanguage,
  location: {
    name:multiLanguage,
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  description: multiLanguage,
},{
  timestamps:true
});
LaunchSchema.pre(/^find/, function (next) {
  this.populate("developer");
  next();
});


LaunchSchema.pre('validate', async function (next) {
  try {
    if (this.isModified('launchName.en')) {
      this.slug.en = await generateUniqueSlug(this, 'launchName', 'en');
    }

    if (this.isModified('launchName.ar')) {
      this.slug.ar = await generateUniqueSlug(this, 'launchName', 'ar');
    }

    next();
  } catch (err) {
    next(err);
  }
});

const launchModel = mongoose.model("Launch", LaunchSchema);

module.exports = launchModel;
