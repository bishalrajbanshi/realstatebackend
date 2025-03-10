import mongoose, { Schema } from "mongoose";
import {
  addPasswordhashingHook,
  addPasswordVerificationMethod,
} from "../utils/helper/passwordHashCompare.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { generateResetToken } from "../utils/helper/passwordResetToken.js";

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    fullName: {
      type: String,
      required: [true, "FULL NAME IS REQUIRED"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
      sparse: true, 
    },
    mobileNumber: {
      type: Number,
      unique: true,
      sparse: true,
     },
    currentAddress: {
      type: String,
      // required: [true, "enter your current address"],
    },
    password: {
      type: String,
      // required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["User"],
      default: "User",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    isEmailUpdating: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpire: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpire: {
      type: Date,
    },
    refreshToken: [String],
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add plugins and indexes
userSchema.plugin(mongooseAggregatePaginate);

// index for logged-in and verified users
userSchema.index({ isLoggedIn: 1, isVerified: 1 });

//prehooks
addPasswordhashingHook(userSchema);
addPasswordVerificationMethod(userSchema);

//generet reset token
generateResetToken(userSchema);

export const User = mongoose.model("User", userSchema);
