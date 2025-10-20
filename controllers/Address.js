const Address = require("../models/Address");

exports.create = async (req, res) => {
  try {
    const { customerType, reason } = req.body;

    // Vérification de la cohérence des données
    if (customerType === "entreprise" && !reason) {
      return res
        .status(400)
        .json({
          message: "La raison sociale est requise pour une entreprise.",
        });
    }

    const created = new Address(req.body);
    await created.save();
    res.status(201).json(created);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message:
          "Erreur lors de l'ajout de l'adresse, veuillez réessayer plus tard.",
      });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Address.find({ user: id });
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des adresses, veuillez réessayer plus tard.",
      });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerType, reason } = req.body;

    // Vérification lors de la mise à jour
    if (customerType === "entreprise" && !reason) {
      return res
        .status(400)
        .json({
          message: "La raison sociale est requise pour une entreprise.",
        });
    }

    const updated = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updated);
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la mise à jour de l'adresse, veuillez réessayer plus tard.",
      });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la suppression de l'adresse, veuillez réessayer plus tard.",
      });
  }
};
