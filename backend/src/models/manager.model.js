import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const managerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "FULL NAME REQUIRED"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "EMAIL REQUIRED"],
      lowercase: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      // match: [/^\d{10}$/, "INVALID MOBILE NUMBER"], // Validating for 10-digit numbers
    },
    avatar:{
      type: String
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
      type: String
    },
    accessToken:{
      type: String
    },
  },
  { timestamps: true }
);

// Password hashing
managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Password verification
managerSchema.methods.isPasswordCorrect = async function (password) {
  return bcryptjs.compare(password, this.password);
};

// Access token generation
managerSchema.methods.generateAccessToken = function () {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
  }

  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "1h";
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      mobileNumber: this.mobileNumber,
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiry,
    }
  );
};

// Refresh token generation
managerSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in the environment variables");
  }

  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiry,
    }
  );

  this.refreshToken = refreshToken;
  return refreshToken;
};

export const Manager = mongoose.model("Manager", managerSchema);
