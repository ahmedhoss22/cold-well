const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const multiLanguage = {
  en: {
    type: String,
  },
  ar: {
    type: String,
  },
};
const OfferSchema = new Schema(
  {
    offerNumber: Number,
    offerNote: multiLanguage,
    offerName: multiLanguage,
    developer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Developer",
      },
    ],

    downPayment: {
      type: String,
      required: true,
    },
    whatsapp: { type: String, required: true },
    installmentYears: {
      type: String,
    },
    oldOffer: {
      downPayment: {
        type: String,
      },

      installmentYears: {
        type: String,
      },
    },
    referenceNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
OfferSchema.pre(/^find/, function (next) {
  this.populate({
    path: "developer",
    select: "name images _id",
  });
  next();
});
OfferSchema.pre("validate", async function (next) {
  if (this.isNew) {
    let unique = false;
    while (!unique) {
      const randomNumber = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      const existingOffer = await mongoose.models.Offer.findOne({
        referenceNumber: randomNumber,
      });
      if (!existingOffer) {
        this.referenceNumber = randomNumber;
        unique = true;
      }
    }
  }
  next();
});

const offerModel = mongoose.model("Offer", OfferSchema);

module.exports = offerModel;
