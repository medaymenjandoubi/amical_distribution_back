const express = require("express");
const router = express.Router();
const { createMessage } = require("../controllers/Message");

// Define the POST route
router.post("/send", createMessage);

module.exports = router;
