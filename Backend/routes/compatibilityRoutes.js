const express = require("express");

const {
  getCompatibility,
} = require("../controllers/compatibilityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Calculate compatibility with a roommate
router.get("/:id", authMiddleware, getCompatibility);

module.exports = router;