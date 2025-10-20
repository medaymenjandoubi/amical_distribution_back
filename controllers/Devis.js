const Devis = require("../models/Devis"); // Import the model

// Create a new message
exports.createDevis = async (req, res) => {
  try {
    const { name, lastName, email, service, message } = req.body;

    // Validate fields
    if (!name || !lastName || !email || !message || !service) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newDevis = new Devis({ name, lastName, email, service, message });
    await newDevis.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
