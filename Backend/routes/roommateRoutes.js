const express = require("express");

const {
  getRoommates,
  getRoommateById,
} = require("../controllers/roommateController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Find all roommates
router.get(
  "/",
  authMiddleware,
  getRoommates
);

// Get single roommate by ID
router.get(
  "/:id",
  authMiddleware,
  getRoommateById
);

module.exports = router;