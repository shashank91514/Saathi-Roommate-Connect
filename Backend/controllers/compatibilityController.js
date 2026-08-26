const User = require("../models/User");

// ========================================
// CALCULATE ROOMMATE COMPATIBILITY
// ========================================
const getCompatibility = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const roommateId = req.params.id;

    // Find logged-in student
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    // Find selected roommate
    const roommate = await User.findById(roommateId);

    if (!roommate) {
      return res.status(404).json({
        message: "Roommate not found",
      });
    }

    // Calculate score
    let score = 0;

    // Budget - 20%
    if (
      currentUser.budget > 0 &&
      roommate.budget > 0 &&
      Math.abs(currentUser.budget - roommate.budget) <= 2000
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
    if (currentUser.smoking === roommate.smoking) {
      score += 15;
    }

    // Drinking - 10%
    if (currentUser.drinking === roommate.drinking) {
      score += 10;
    }

    // Sleep Schedule - 15%
    if (currentUser.sleepSchedule === roommate.sleepSchedule) {
      score += 15;
    }

    // Cleanliness - 10%
    if (currentUser.cleanliness === roommate.cleanliness) {
      score += 10;
    }

    // Study Habit - 15%
    if (currentUser.studyHabit === roommate.studyHabit) {
      score += 15;
    }

    res.status(200).json({
      message: "Compatibility calculated successfully",
      compatibility: `${score}%`,
      score,
      roommate: {
        id: roommate._id,
        name: roommate.name,
        college: roommate.college,
        course: roommate.course,
        year: roommate.year,
        city: roommate.city,
        budget: roommate.budget,
        food: roommate.food,
        smoking: roommate.smoking,
        drinking: roommate.drinking,
        sleepSchedule: roommate.sleepSchedule,
        cleanliness: roommate.cleanliness,
        studyHabit: roommate.studyHabit,
        bio: roommate.bio,
        profileImage: roommate.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getCompatibility,
};