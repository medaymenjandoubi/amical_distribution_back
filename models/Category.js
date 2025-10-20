const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Object, // Stocke l'info renvoyée par S3
  },
  description: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    }
});

module.exports = mongoose.model("Category", categorySchema);
