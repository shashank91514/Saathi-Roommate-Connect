const express = require("express");

const {
  sendConnectionRequest,
  getConnections,
  acceptConnection,
  rejectConnection,
} = require("../controllers/connectionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all my connections and requests
router.get(
  "/",
  authMiddleware,
  getConnections
);


// Send connection request
router.post(
  "/:userId",
  authMiddleware,
  sendConnectionRequest
);


// Accept request
router.put(
  "/:connectionId/accept",
  authMiddleware,
  acceptConnection
);


// Reject request
router.put(
  "/:connectionId/reject",
  authMiddleware,
  rejectConnection
);


module.exports = router;