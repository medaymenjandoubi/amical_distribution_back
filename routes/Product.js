const express = require("express");
const productController = require("../controllers/Product");
const router = express.Router();

router
  .post("/", productController.create)
  .get("/", productController.getAll)
  .get("/:id", productController.getById)
  .patch("/:id", productController.updateById)
  .patch("/undelete/:id", productController.undeleteById)
  .delete("/:id", productController.deleteById)
  .post("/upload-image", productController.uploadImage)
  .post("/remove-image", productController.removeImage)

  .post("/upload-thumbnail", productController.uploadThumbnail)
  .post("/remove-thumbnail", productController.removeThumbnail);
module.exports = router;
