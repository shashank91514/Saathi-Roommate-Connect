const User = require("../models/User");

// ======================================
// CALCULATE COMPATIBILITY
// ======================================

const calculateCompatibility = (currentUser, roommate) => {
  let score = 0;

  // Budget - 20%
  if (
    currentUser.budget > 0 &&
    roommate.budget > 0 &&
    Math.abs(
      currentUser.budget - roommate.budget
    ) <= 2000
  ) {
    score += 20;
  }

  // Food - 15%
  if (
    currentUser.food === roommate.food ||
    currentUser.food === "Both" ||
    roommate.food === "Both"
  ) {
    score += 15;
  }

  // Smoking - 15%
  if (
    currentUser.smoking === roommate.smoking
  ) {
    score += 15;
  }

  // Drinking - 10%
  if (
    currentUser.drinking === roommate.drinking
  ) {
    score += 10;
  }

  // Sleep Schedule - 15%
  if (
    currentUser.sleepSchedule ===
    roommate.sleepSchedule
  ) {
    score += 15;
  }

  // Cleanliness - 10%
  if (
    currentUser.cleanliness ===
    roommate.cleanliness
  ) {
    score += 10;
  }

  // Study Habit - 15%
  if (
    currentUser.studyHabit ===
    roommate.studyHabit
  ) {
    score += 15;
  }

  return score;
};


// ======================================
// FIND ROOMMATES
// ======================================

const getRoommates = async (req, res) => {
  try {
    const {
      college,
      city,
      budget,
    } = req.query;

    // ======================================
    // GET CURRENT USER
    // ======================================

    const currentUser = await User.findById(
      req.user.userId
    );

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    // ======================================
    // FILTER
    // ======================================

    const filter = {
      _id: {
        $ne: req.user.userId,
      },
    };

    if (college) {
      filter.college = college;
    }

    if (city) {
      filter.city = city;
    }

    if (budget) {
      filter.budget = {
        $lte: Number(budget),
      };
    }

    // ======================================
    // FIND ROOMMATES
    // ======================================

    const roommates = await User.find(filter)
      .select("-password")
      .limit(20);

    // ======================================
    // ADD COMPATIBILITY SCORE
    // ======================================

    const roommatesWithScore = roommates.map(
      (roommate) => {
        const score =
          calculateCompatibility(
            currentUser,
            roommate
          );

        return {
          ...roommate.toObject(),
          compatibility: score,
        };
      }
    );

    // ======================================
    // SORT BY COMPATIBILITY
    // ======================================

    roommatesWithScore.sort(
      (a, b) =>
        b.compatibility -
        a.compatibility
    );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      message:
        "Roommates fetched successfully",

      count: roommatesWithScore.length,

      roommates: roommatesWithScore,
    });

  } catch (error) {
    console.error(
      "Get Roommates Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ======================================
// GET SINGLE ROOMMATE
// ======================================

const getRoommateById = async (
  req,
  res
) => {
  try {
    const roommate =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!roommate) {
      return res.status(404).json({
        message:
          "Roommate not found",
      });
    }

    res.status(200).json({
      message:
        "Roommate fetched successfully",

      roommate,
    });

  } catch (error) {
    console.error(
      "Get Roommate Error:",
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
  getRoommates,
  getRoommateById,
};