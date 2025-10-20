const Category = require("../models/Category");
const AWS = require("aws-sdk");

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const generateUniqueKey = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating category" });
  }
};

exports.uploadThumbnail = async (req, res) => {
  try {
    const { thumbnail } = req.body;
    if (!thumbnail) return res.status(400).send("No thumbnail");

    const base64Data = Buffer.from(
      thumbnail.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = thumbnail.split(";")[0].split("/")[1];

    const params = {
      Bucket: "edemynourbucket",
      Key: `${Date.now()}-${Math.floor(Math.random() * 10000)}.${type}`,
      Body: base64Data,
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    S3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.sendStatus(400);
      }

      // ✅ RENVOYER les infos de l'image dans la réponse
      res.status(200).json({
        ETag: data.ETag,
        Key: data.Key,
        Location: data.Location,
        Bucket: data.Bucket,
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// GET /api/categories/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching category" });
  }
};
