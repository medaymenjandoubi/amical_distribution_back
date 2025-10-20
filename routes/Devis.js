const express = require("express");
const router = express.Router();
const { createDevis } = require("../controllers/Devis");

// Define the POST route
router.post("/sendDevis", createDevis);

module.exports = router;
