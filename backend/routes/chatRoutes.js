const express = require("express");
const router = express.Router();

const {
  chatWithPDF
} = require("../controllers/chatController");

// POST /api/chat/pdf
router.post("/pdf", chatWithPDF);

module.exports = router;