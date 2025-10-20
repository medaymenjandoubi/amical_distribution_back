const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  customerType: {
    type: String,
    enum: ["particulier", "entreprise"],
    required: true,
  },
  reason: {
    type: String,
    // required: function () {
    //   return this.customerType === "entreprise"; // Obligatoire uniquement pour les entreprises
    // },
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Address", addressSchema);
