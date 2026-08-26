const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // College Information
    college: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    // Location & Budget
    city: {
      type: String,
      default: "",
      trim: true,
    },

    budget: {
      type: Number,
      default: 0,
    },

    // Lifestyle Preferences
    food: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Both"],
      default: "Both",
    },

    smoking: {
      type: Boolean,
      default: false,
    },

    drinking: {
      type: Boolean,
      default: false,
    },

    sleepSchedule: {
      type: String,
      enum: ["Early", "Normal", "Late"],
      default: "Normal",
    },

    cleanliness: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    studyHabit: {
      type: String,
      enum: ["Quiet", "Moderate", "Group"],
      default: "Moderate",
    },

    // About Student
    bio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;