import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  addPasswordhashingHook,
  addPasswordVerificationMethod,
} from "../utils/helper/passwordHashCompare.js";

const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "FULL NAME IS REQUIRED"],
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Admin"], 
      default: "Admin",
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpire: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    isEmailUpdating:{
      type: Boolean,
      default: false
  },
  },
  { timestamps: true }
);

adminSchema.index({ createdAt: -1})

// Add plugin and indexes
adminSchema.plugin(mongooseAggregatePaginate);

// Hooks
addPasswordhashingHook(adminSchema);
addPasswordVerificationMethod(adminSchema);

// Define Admin model
export const Admin = mongoose.model("Admin", adminSchema);

