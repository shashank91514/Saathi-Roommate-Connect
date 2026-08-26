const mongoose = require("mongoose");

const Connection = require("../models/Connection");
const User = require("../models/User");
const Notification = require("../models/Notification");


// ======================================
// SEND CONNECTION REQUEST
// POST /api/connections/:userId
// ======================================

const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.userId;


    // ======================================
    // VALIDATE RECEIVER ID
    // ======================================

    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }


    // ======================================
    // VALIDATE SENDER ID
    // ======================================

    if (!mongoose.isValidObjectId(senderId)) {
      return res.status(400).json({
        message: "Invalid authenticated user ID",
      });
    }


    // ======================================
    // PREVENT SELF CONNECTION
    // ======================================

    if (
      senderId.toString() ===
      receiverId.toString()
    ) {
      return res.status(400).json({
        message: "You cannot connect with yourself",
      });
    }


    // ======================================
    // CHECK RECEIVER
    // ======================================

    const receiver = await User.findById(
      receiverId
    );

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // ======================================
    // CHECK EXISTING CONNECTION
    // ======================================

    const existingConnection =
      await Connection.findOne({
        $or: [
          {
            sender: senderId,
            receiver: receiverId,
          },
          {
            sender: receiverId,
            receiver: senderId,
          },
        ],
      });


    if (existingConnection) {

      // Pending
      if (
        existingConnection.status ===
        "pending"
      ) {
        return res.status(400).json({
          message:
            "Connection request already pending",
        });
      }


      // Accepted
      if (
        existingConnection.status ===
        "accepted"
      ) {
        return res.status(400).json({
          message:
            "You are already connected",
        });
      }


      // Previously rejected
      if (
        existingConnection.status ===
        "rejected"
      ) {
        await Connection.deleteOne({
          _id: existingConnection._id,
        });
      }
    }


    // ======================================
    // CREATE CONNECTION
    // ======================================

    const connection =
      await Connection.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });


    // ======================================
    // GET SENDER NAME
    // ======================================

    const sender = await User.findById(
      senderId
    ).select("name");


    // ======================================
    // CREATE NOTIFICATION
    // ======================================

    if (sender) {
      await Notification.create({
        recipient: receiverId,
        sender: senderId,
        type: "connection_request",
        message:
          `${sender.name} sent you a connection request.`,
      });
    }


    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      message:
        "Connection request sent successfully",
      connection,
    });

  } catch (error) {

    console.error(
      "Send Connection Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ======================================
// GET MY CONNECTIONS / REQUESTS
// GET /api/connections
// ======================================

const getConnections = async (req, res) => {
  try {
    const userId = req.user.userId;


    // ======================================
    // VALIDATE USER ID
    // ======================================

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }


    // ======================================
    // GET CONNECTIONS
    // ======================================

    const connections =
      await Connection.find({
        $or: [
          {
            sender: userId,
          },
          {
            receiver: userId,
          },
        ],
      })
        .populate(
          "sender",
          "name email college course year city profileImage"
        )
        .populate(
          "receiver",
          "name email college course year city profileImage"
        )
        .sort({
          createdAt: -1,
        });


    res.status(200).json({
      message:
        "Connections fetched successfully",
      connections,
    });

  } catch (error) {

    console.error(
      "Get Connections Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ======================================
// ACCEPT REQUEST
// PUT /api/connections/:connectionId/accept
// ======================================

const acceptConnection = async (req, res) => {
  try {
    const userId = req.user.userId;
    const connectionId =
      req.params.connectionId;


    // ======================================
    // VALIDATE CONNECTION ID
    // ======================================

    if (
      !mongoose.isValidObjectId(
        connectionId
      )
    ) {
      return res.status(400).json({
        message: "Invalid connection ID",
      });
    }


    // ======================================
    // FIND CONNECTION
    // ======================================

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {
      return res.status(404).json({
        message:
          "Connection request not found",
      });
    }


    // ======================================
    // ONLY RECEIVER CAN ACCEPT
    // ======================================

    if (
      connection.receiver.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot accept this request",
      });
    }


    // ======================================
    // CHECK STATUS
    // ======================================

    if (
      connection.status !==
      "pending"
    ) {
      return res.status(400).json({
        message:
          "This request is no longer pending",
      });
    }


    // ======================================
    // ACCEPT
    // ======================================

    connection.status = "accepted";

    await connection.save();


    // ======================================
    // NOTIFY SENDER
    // ======================================

    await Notification.create({
      recipient: connection.sender,
      sender: userId,
      type: "connection_accepted",
      message:
        "accepted your connection request.",
    });


    res.status(200).json({
      message:
        "Connection request accepted",
      connection,
    });

  } catch (error) {

    console.error(
      "Accept Connection Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ======================================
// REJECT REQUEST
// PUT /api/connections/:connectionId/reject
// ======================================

const rejectConnection = async (req, res) => {
  try {
    const userId = req.user.userId;
    const connectionId =
      req.params.connectionId;


    // ======================================
    // VALIDATE CONNECTION ID
    // ======================================

    if (
      !mongoose.isValidObjectId(
        connectionId
      )
    ) {
      return res.status(400).json({
        message: "Invalid connection ID",
      });
    }


    // ======================================
    // FIND CONNECTION
    // ======================================

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {
      return res.status(404).json({
        message:
          "Connection request not found",
      });
    }


    // ======================================
    // ONLY RECEIVER CAN REJECT
    // ======================================

    if (
      connection.receiver.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot reject this request",
      });
    }


    // ======================================
    // CHECK STATUS
    // ======================================

    if (
      connection.status !==
      "pending"
    ) {
      return res.status(400).json({
        message:
          "This request is no longer pending",
      });
    }


    // ======================================
    // REJECT
    // ======================================

    connection.status = "rejected";

    await connection.save();


    // ======================================
    // NOTIFY SENDER
    // ======================================

    await Notification.create({
      recipient: connection.sender,
      sender: userId,
      type: "connection_rejected",
      message:
        "rejected your connection request.",
    });


    res.status(200).json({
      message:
        "Connection request rejected",
      connection,
    });

  } catch (error) {

    console.error(
      "Reject Connection Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ======================================
// EXPORT
// ======================================

module.exports = {
  sendConnectionRequest,
  getConnections,
  acceptConnection,
  rejectConnection,
};