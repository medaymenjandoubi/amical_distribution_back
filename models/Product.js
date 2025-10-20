const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    nbrParPaquet: {
      type: Number,
      default: 1,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String, // peut rester un String ou ObjectId si tu as une collection Brand
      required: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: Object,
    },
    images: [
      {
        type: Object,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isLiquid: {
      type: Boolean,
      default: false,
    },
    // Nouveaux champs pour le shop moderne
    isPopular: {
      type: Boolean,
      default: false,
    },
    isExclusive: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
