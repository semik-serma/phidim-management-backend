import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    full_name: {
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
      required: function () {
        return this.provider === "local";
      },
    },

    googleId: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      lowercase: true,
      trim: true,
    },

    picture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const registerModel =
  mongoose.models.registerModel ||
  mongoose.model("registerModel", registerSchema);