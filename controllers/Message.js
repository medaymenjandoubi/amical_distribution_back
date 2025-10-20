const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  try {
const {
  companyName,
  phone,
  email,
  activity,
  subject,
  description,
  rgpdConsent,
} = req.body;

if (
  !companyName ||
  !phone ||
  !email ||
  !activity ||
  !subject ||
  !description ||
  rgpdConsent !== true
) {
  return res.status(400).json({ error: "Tous les champs sont requis" });
}

const newMessage = new Message({
  companyName,
  phone,
  email,
  activity,
  subject,
  description,
  rgpdConsent,
});


    await newMessage.save();

    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
