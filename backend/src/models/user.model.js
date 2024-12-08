import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
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
    },
    mobileNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    isverified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    verificationCodeExpire: {
        type: Date,
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpire: {
        type: Date
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ mobileNumber: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt); 
        console.log('Hashed Password:', this.password);  
        next();
    } catch (error) {
        next(error); 
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    console.log('Comparing passwords...');
    console.log('Entered password:', password);
    console.log('Stored hashed password:', this.password);
    
    return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h';

    if (!accessTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    return jwt.sign({
         _id: this._id,
         email: this.email,
         }, accessTokenSecret, { expiresIn: accessTokenExpiry });
};

userSchema.methods.generateRefreshToken =  function () {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

    if (!refreshTokenSecret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    this.refreshToken = jwt.sign({ _id: this._id }, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
    return this.refreshToken;
};

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(8).toString("hex");

    this.passwordResetToken = bcryptjs.hashSync(resetToken, 12); 
    this.passwordResetTokenExpire = Date.now() + 15 * 60 * 1000;

    return resetToken; 
};

export const User = mongoose.model("User", userSchema);
