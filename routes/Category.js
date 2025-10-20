const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/Category");

router.get("/", categoryController.getAll);
router.post("/", categoryController.create);
router.get("/:id", categoryController.getById); // ← nouvelle route
router.post("/upload-thumbnail", categoryController.uploadThumbnail);

module.exports = router;
