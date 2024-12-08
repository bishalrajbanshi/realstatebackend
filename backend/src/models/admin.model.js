import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the admin schema
const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password if modified
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Custom method to check password
adminSchema.methods.isPasswordCorrect = async function (password) {
  return bcryptjs.compare(password, this.password);
};

// Method to generate access token
adminSchema.methods.generateAccessToken = function () {
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

// Method to generate refresh token
adminSchema.statics.seedAdmin = async function () {
    const Admin = mongoose.model("Admin", adminSchema); 
  
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" }); 
  
    if (!existingAdmin) {
      // Admin does not exist, create a new one
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash("bishal", salt); 
      const admin = new Admin({
        fullName: "Admin User",
        email: "admin@example.com",
        mobileNumber: "1234567890",
        password: hashedPassword,  
        isAdmin: true,
      });
  
      await admin.save();
      console.log("Predefined admin data inserted successfully");
    } else {
      let updated = false;
  
      if (existingAdmin.email !== "admin@example.com") {
        existingAdmin.email = "admin@example.com";
        updated = true;
      }
      if (existingAdmin.password !== "adminpassword") {
        const salt = await bcryptjs.genSalt(10);
        existingAdmin.password = await bcryptjs.hash("adminpassword", salt);  
        updated = true;
      }
      if (existingAdmin.mobileNumber !== "1234567890") {
        existingAdmin.mobileNumber = "1234567890";
        updated = true;
      }
  
      // Only save if fields have changed
      if (updated) {
        await existingAdmin.save();
        console.log("Admin data updated successfully");
      } else {
        console.log("Admin data already exists and no changes were needed");
      }
    }
  };
  

// Call seedAdmin when the model is loaded, but only once
adminSchema.statics.seedAdmin(); 

const Admin = mongoose.model("Admin", adminSchema);

export { Admin };
