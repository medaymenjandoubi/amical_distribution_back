const { Schema, default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const AWS = require("aws-sdk"); // ✅ Use require() for AWS SDK v2

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};
const S3 = new AWS.S3({
  awsConfig,
});
const generateUniqueKey = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const created = new Product(req.body);
    await created.save();
    res.status(201).json(created);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error adding product, please trying again later" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    // 🔹 Brand
    if (req.query.brand) {
      // Si plusieurs brands envoyées, req.query.brand peut être un array ou string
      filter.brand = { $in: Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand] };
    }

    // 🔹 Category
    if (req.query.category) {
      filter.category = { $in: Array.isArray(req.query.category) ? req.query.category : [req.query.category] };
    }

    // 🔹 User / isDeleted
    if (req.query.user) {
      filter.isDeleted = false;
    }

    // 🔹 Prix min / max
    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    }

    // 🔹 Filtre liquide
    if (req.query.isLiquid !== undefined) {
      // req.query.isLiquid = "true" ou "false"
      filter.isLiquid = req.query.isLiquid === "true";
    }
    if (req.query.isExclusive !== undefined) {
      // req.query.isLiquid = "true" ou "false"
      filter.isExclusive = req.query.isExclusive === "true";
    }

    // 🔹 Sort
    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "asc" ? 1 : -1;
    }

    // 🔹 Pagination
    if (req.query.page && req.query.limit) {
      const pageSize = Number(req.query.limit);
      const page = Number(req.query.page);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }
    // 🔹 Search query
    if (req.query.search) {
      // recherche insensible à la casse
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    // 🔹 Total documents pour pagination
    const totalDocs = await Product.countDocuments(filter);

    // 🔹 Résultats paginés
    const results = await Product.find(filter)
      .sort(sort)
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products, please try again later" });
  }
};


exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id)
      .populate("brand")
      .populate("category");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting product details, please try again later",
    });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating product, please try again later" });
  }
};

exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const unDeleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    ).populate("brand");
    res.status(200).json(unDeleted);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error restoring product, please try again later" });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).populate("brand");
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting product, please try again later" });
  }
};
exports.uploadImage = async (req, res) => {
  console.log(req.body);

  try {
    //
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    //preapare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    //image params
    const params = {
      Bucket: "edemynourbucket",
      Key: `${generateUniqueKey()}.${type}`, // Generate unique key
      Body: base64Data,
      //   ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };
    //upload to s3
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};
exports.uploadThumbnail = async (req, res) => {
  console.log(req.body);

  try {
    const { thumbnail } = req.body;
    if (!thumbnail) return res.status(400).send("No thumbnail");

    // Prepare the image
    const base64Data = Buffer.from(
      thumbnail.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = thumbnail.split(";")[0].split("/")[1];

    // Thumbnail params
    const params = {
      Bucket: "edemynourbucket",
      Key: `${generateUniqueKey()}.${type}`, // Generate unique key
      Body: base64Data,
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // Upload to S3
    S3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.removeThumbnail = async (req, res) => {
  try {
    const { thumbnail } = req.body;
    console.log(thumbnail);
    const params = {
      Bucket: thumbnail.Bucket,
      Key: thumbnail.Key,
    };

    //send remove request to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};
exports.removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    console.log("Removing image:", image);

    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    // Send delete request to S3
    S3.deleteObject(params, async (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }

      // Optionally, remove the image from the database (if needed)
      await Product.updateOne(
        { images: { $elemMatch: { Key: image.Key } } },
        { $pull: { images: { Key: image.Key } } }
      );

      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
