import mongoose, { Schema } from "mongoose";

import { utils } from "../utils/index.js";
const { addPasswordhashingHook, addPasswordVerificationMethod } = utils;

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "os";

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
        // minlength: 6,
    },
    mobileNumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
    },
    address: {
        type: String,
        enum:["Province1","Province2","Province3","Province4","Province5","Province6","Province7"],
        required : true
    },
    avatar: {
        type: String // from cloudinary
    },
    role: {
        type: String,
        enum: ["Manager"], 
        default: "Manager",
    },
    isLoggedIn:{
        type:Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    verificationCodeExpire: {
        type: Date,
    },
    isEmailUpdating:{
        type: Boolean,
        default: false
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

managerSchema.plugin(mongooseAggregatePaginate)
managerSchema.index({ email: 1, mobileNumber: 1});
managerSchema.index({ isLoggedIn: 1});
managerSchema.index({ address: 1});
managerSchema.index({ createdAt: -1})

addPasswordhashingHook(managerSchema);
addPasswordVerificationMethod(managerSchema);


export const Manager = mongoose.model("Manager",managerSchema);

