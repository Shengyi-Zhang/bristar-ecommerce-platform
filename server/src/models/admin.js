const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["super", "editor"],
      default: "editor",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Admin", AdminSchema, "admins");
