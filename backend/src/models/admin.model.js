import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv"; 
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

// Load environment variables from .env file
dotenv.config();

// Define Admin Schema
const adminSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String
    }
}, { timestamps: true });



// Hash password before saving (middleware)
adminSchema.pre("save", async function (next) {
    try {
        // Only hash the password if it is modified (or new)
        if (this.isModified("password")) {
            console.log("Hashing password..."); 
            const salt = await bcryptjs.genSalt(10);
            this.password = await bcryptjs.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Password validation method
adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
};



adminSchema.methods.generateAccessToken = function() {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h';
    if (!accessTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    return jwt.sign({
        _id: this._id,
        email: this.email,
    }, accessTokenSecret, { expiresIn: accessTokenExpiry });
}


adminSchema.methods.generateRefreshToken = function (){
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

    if (!refreshTokenSecret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    this.refreshToken = jwt.sign({_id: this._id},
        refreshTokenSecret, {
            expiresIn:refreshTokenExpiry
        }
    )
    return this.refreshToken;
}


// Create Admin Model using the schema
export const Admin = mongoose.model("Admin", adminSchema);

// Predefined admin data from environment variables
const predefinedData = {
    fullName: process.env.ADMIN_FULL_NAME,
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
};

if (!predefinedData.fullName || !predefinedData.username || !predefinedData.email || !predefinedData.password) {
    console.error("Error: Missing environment variables for predefined admin.");
    process.exit(1);
}

// Function to create predefined admin (if not exists)
const createPredefinedAdmin = asyncHandler(async () => {
    try {
        // Check if admin already exists based on email or username
        const existAdmin = await Admin.findOne({
            $or: [
                { email: predefinedData.email },
                { username: predefinedData.username }
            ]
        });

        if (!existAdmin) {
            const admin = new Admin({
                ...predefinedData
            });
            await admin.save();
            console.log('Predefined admin created successfully.');
        } else {
            // Admin already exists
            console.log("Admin already exists with this email or username.");
        }
    } catch (error) {
        console.error('Error creating predefined admin:', error);
    }
});
console.log(predefinedData);


if (predefinedData.fullName && predefinedData.username && predefinedData.email && predefinedData.password) {
    createPredefinedAdmin();
} else {
    console.error("Environment variables are missing. Admin will not be created.");
}
