const User = require("../models/User");


// ========================================
// GET MY PROFILE
// ========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ========================================
// UPDATE MY PROFILE
// ========================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      course,
      year,
      city,
      budget,
      food,
      smoking,
      drinking,
      sleepSchedule,
      cleanliness,
      studyHabit,
      bio,
      profileImage,
    } = req.body;


    // ========================================
    // FIND LOGGED-IN USER
    // ========================================

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // ========================================
    // BASIC INFORMATION VALIDATION
    // ========================================

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2
      ) {
        return res.status(400).json({
          message:
            "Name must contain at least 2 characters",
        });
      }

      user.name = name.trim();
    }


    if (college !== undefined) {
      if (
        typeof college !== "string" ||
        college.trim().length < 2
      ) {
        return res.status(400).json({
          message:
            "Please provide a valid college name",
        });
      }

      user.college = college.trim();
    }


    if (course !== undefined) {
      if (
        typeof course !== "string" ||
        course.trim().length < 2
      ) {
        return res.status(400).json({
          message:
            "Please provide a valid course",
        });
      }

      user.course = course.trim();
    }


    // ========================================
    // YEAR VALIDATION
    // ========================================

    if (year !== undefined) {
      const numericYear = Number(year);

      if (
        !Number.isInteger(numericYear) ||
        numericYear < 1 ||
        numericYear > 4
      ) {
        return res.status(400).json({
          message: "Year must be between 1 and 4",
        });
      }

      user.year = numericYear;
    }


    // ========================================
    // CITY
    // ========================================

    if (city !== undefined) {
      if (typeof city !== "string") {
        return res.status(400).json({
          message: "City must be a valid text value",
        });
      }

      user.city = city.trim();
    }


    // ========================================
    // BUDGET VALIDATION
    // ========================================

    if (budget !== undefined) {
      const numericBudget = Number(budget);

      if (
        !Number.isFinite(numericBudget) ||
        numericBudget < 0
      ) {
        return res.status(400).json({
          message:
            "Budget must be a valid positive number",
        });
      }

      user.budget = numericBudget;
    }


    // ========================================
    // FOOD VALIDATION
    // ========================================

    if (food !== undefined) {
      const allowedFood = [
        "Vegetarian",
        "Non-Vegetarian",
        "Both",
      ];

      if (!allowedFood.includes(food)) {
        return res.status(400).json({
          message: "Invalid food preference",
        });
      }

      user.food = food;
    }


    // ========================================
    // SMOKING VALIDATION
    // ========================================

    if (smoking !== undefined) {
      if (typeof smoking !== "boolean") {
        return res.status(400).json({
          message: "Smoking must be true or false",
        });
      }

      user.smoking = smoking;
    }


    // ========================================
    // DRINKING VALIDATION
    // ========================================

    if (drinking !== undefined) {
      if (typeof drinking !== "boolean") {
        return res.status(400).json({
          message: "Drinking must be true or false",
        });
      }

      user.drinking = drinking;
    }


    // ========================================
    // SLEEP SCHEDULE VALIDATION
    // ========================================

    if (sleepSchedule !== undefined) {
      const allowedSleepSchedules = [
        "Early",
        "Normal",
        "Late",
      ];

      if (
        !allowedSleepSchedules.includes(
          sleepSchedule
        )
      ) {
        return res.status(400).json({
          message: "Invalid sleep schedule",
        });
      }

      user.sleepSchedule = sleepSchedule;
    }


    // ========================================
    // CLEANLINESS VALIDATION
    // ========================================

    if (cleanliness !== undefined) {
      const allowedCleanliness = [
        "Low",
        "Medium",
        "High",
      ];

      if (
        !allowedCleanliness.includes(cleanliness)
      ) {
        return res.status(400).json({
          message:
            "Invalid cleanliness preference",
        });
      }

      user.cleanliness = cleanliness;
    }


    // ========================================
    // STUDY HABIT VALIDATION
    // ========================================

    if (studyHabit !== undefined) {
      const allowedStudyHabits = [
        "Quiet",
        "Moderate",
        "Group",
      ];

      if (
        !allowedStudyHabits.includes(studyHabit)
      ) {
        return res.status(400).json({
          message: "Invalid study habit",
        });
      }

      user.studyHabit = studyHabit;
    }


    // ========================================
    // BIO
    // ========================================

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({
          message: "Bio must be text",
        });
      }

      if (bio.length > 500) {
        return res.status(400).json({
          message:
            "Bio cannot exceed 500 characters",
        });
      }

      user.bio = bio.trim();
    }


    // ========================================
    // PROFILE IMAGE
    // ========================================

    if (profileImage !== undefined) {
      if (typeof profileImage !== "string") {
        return res.status(400).json({
          message:
            "Profile image must be a valid string",
        });
      }

      user.profileImage = profileImage.trim();
    }


    // ========================================
    // SAVE USER
    // ========================================

    await user.save();


    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
        city: user.city,
        budget: user.budget,
        food: user.food,
        smoking: user.smoking,
        drinking: user.drinking,
        sleepSchedule: user.sleepSchedule,
        cleanliness: user.cleanliness,
        studyHabit: user.studyHabit,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  getProfile,
  updateProfile,
};