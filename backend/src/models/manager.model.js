import mongoose, { Schema } from "mongoose"
import bcryptjs from "bcryptjs";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const managerSchema = new Schema({

    fullName:{
        type:String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    },
    mobileNumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
    },
    avatar: {
        type: String // from cloudinary
    },
    role: {
        type: String,
        default: "Manager",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    accessToken: {
        type:String
    },
    refreshToken: {
        type: String
    }

},{ timestamps: true });

//PRE HOOK
managerSchema.pre("save", async function(next){
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password,salt);
        next();
    } catch (error) {
            next(error);
    }
});

//compare password
managerSchema.methods.isPasswordCorrect =  async function(password){
    return await bcryptjs.compare(password,this.password)
};

managerSchema.methods.generateAccessToken =  function(){
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h';

    if (!accessTokenSecret) {
        throw new apiError({
            message:"access token is not defined"
        });
    }

    return jwt.sign({
        _id:this._id,
        email:this.email
    }, accessTokenSecret, {
        expiresIn: accessTokenExpiry
    });
}

managerSchema.methods.generateRefreshToken = function () {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

    if (!refreshTokenSecret) {
        throw new apiError({
            message: "Refresh token secret is not defined"
        });
    }

    // Generate the refresh token
    const token = jwt.sign(
        { _id: this._id },
        refreshTokenSecret,
        { expiresIn: refreshTokenExpiry }
    );

    // Return the generated token
    return token;
};


export const Manager = mongoose.model("Manager",managerSchema);

