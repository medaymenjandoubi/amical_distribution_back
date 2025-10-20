const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  companyName: { type: String, required: true }, // Nom de la société
  phone: { type: String, required: true },
  email: { type: String, required: true },

  activity: {
    type: String,
    required: true,
    enum: [
      "Distribution agroalimentaire",
      "Logistique et Livraison",
      "Conseils & accompagnement",
      "Réclamation sur une commande passée",
    ],
  },

  subject: { type: String, required: true },
  description: { type: String, required: true },
  rgpdConsent: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
