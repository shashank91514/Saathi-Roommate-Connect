const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ========================================
// REGISTER USER
// ========================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      course,
      year,

      // Location & Budget
      city,
      budget,

      // Lifestyle Preferences
      food,
      smoking,
      drinking,
      sleepSchedule,
      cleanliness,
      studyHabit,
    } = req.body;


    // ========================================
    // REQUIRED FIELDS
    // ========================================

    if (
      !name ||
      !email ||
      !password ||
      !college ||
      !course ||
      !year
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }


    // ========================================
    // NAME VALIDATION
    // ========================================

    if (name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters",
      });
    }


    // ========================================
    // EMAIL VALIDATION
    // ========================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }


    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long",
      });
    }


    // ========================================
    // COLLEGE VALIDATION
    // ========================================

    if (college.trim().length < 2) {
      return res.status(400).json({
        message: "Please provide a valid college name",
      });
    }


    // ========================================
    // COURSE VALIDATION
    // ========================================

    if (course.trim().length < 2) {
      return res.status(400).json({
        message: "Please provide a valid course",
      });
    }


    // ========================================
    // YEAR VALIDATION
    // ========================================

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


    // ========================================
    // BUDGET VALIDATION
    // ========================================

    let numericBudget = 0;

    if (
      budget !== undefined &&
      budget !== null &&
      budget !== ""
    ) {
      numericBudget = Number(budget);

      if (
        !Number.isFinite(numericBudget) ||
        numericBudget < 0
      ) {
        return res.status(400).json({
          message: "Budget must be a valid positive number",
        });
      }
    }


    // ========================================
    // FOOD VALIDATION
    // ========================================

    const allowedFood = [
      "Vegetarian",
      "Non-Vegetarian",
      "Both",
    ];

    const selectedFood = food || "Both";

    if (!allowedFood.includes(selectedFood)) {
      return res.status(400).json({
        message: "Invalid food preference",
      });
    }


    // ========================================
    // SMOKING VALIDATION
    // ========================================

    if (
      smoking !== undefined &&
      typeof smoking !== "boolean"
    ) {
      return res.status(400).json({
        message: "Smoking must be true or false",
      });
    }


    // ========================================
    // DRINKING VALIDATION
    // ========================================

    if (
      drinking !== undefined &&
      typeof drinking !== "boolean"
    ) {
      return res.status(400).json({
        message: "Drinking must be true or false",
      });
    }


    // ========================================
    // SLEEP SCHEDULE VALIDATION
    // ========================================

    const allowedSleepSchedules = [
      "Early",
      "Normal",
      "Late",
    ];

    const selectedSleepSchedule =
      sleepSchedule || "Normal";

    if (
      !allowedSleepSchedules.includes(
        selectedSleepSchedule
      )
    ) {
      return res.status(400).json({
        message: "Invalid sleep schedule",
      });
    }


    // ========================================
    // CLEANLINESS VALIDATION
    // ========================================

    const allowedCleanliness = [
      "Low",
      "Medium",
      "High",
    ];

    const selectedCleanliness =
      cleanliness || "Medium";

    if (
      !allowedCleanliness.includes(
        selectedCleanliness
      )
    ) {
      return res.status(400).json({
        message: "Invalid cleanliness preference",
      });
    }


    // ========================================
    // STUDY HABIT VALIDATION
    // ========================================

    const allowedStudyHabits = [
      "Quiet",
      "Moderate",
      "Group",
    ];

    const selectedStudyHabit =
      studyHabit || "Moderate";

    if (
      !allowedStudyHabits.includes(
        selectedStudyHabit
      )
    ) {
      return res.status(400).json({
        message: "Invalid study habit",
      });
    }


    // ========================================
    // CHECK EXISTING USER
    // ========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // ========================================
    // CREATE USER
    // ========================================

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      college: college.trim(),
      course: course.trim(),
      year: numericYear,

      // Location & Budget
      city: city ? city.trim() : "",
      budget: numericBudget,

      // Lifestyle Preferences
      food: selectedFood,

      smoking:
        smoking !== undefined
          ? smoking
          : false,

      drinking:
        drinking !== undefined
          ? drinking
          : false,

      sleepSchedule:
        selectedSleepSchedule,

      cleanliness:
        selectedCleanliness,

      studyHabit:
        selectedStudyHabit,
    });


    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({
      message: "Registration successful",
      userId: user._id,
    });

  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ========================================
// LOGIN USER
// ========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;


    // ========================================
    // REQUIRED FIELDS
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }


    // ========================================
    // EMAIL VALIDATION
    // ========================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message:
          "Please provide a valid email address",
      });
    }


    // ========================================
    // FIND USER
    // ========================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }


    // ========================================
    // CHECK PASSWORD
    // ========================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }


    // ========================================
    // JWT SECRET CHECK
    // ========================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing"
      );

      return res.status(500).json({
        message:
          "Server configuration error",
      });
    }


    // ========================================
    // GENERATE JWT
    // ========================================

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      message: "Login successful",

      token,

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
      "Login Error:",
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
  register,
  login,
};