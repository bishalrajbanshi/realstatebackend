import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



const userSellerSchema = new Schema({

    fullName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: [true, "Contact Number is required"]
    },
    senderName: {
        type: String,
        get: function () {
            return this.sentBy.fullName;
        }

    },

    //land detials
    // landOwnershipDetails: {
    //     type: String,
    //     ownershipPaper: [true, "ownership paper is required"], // from cloudinary
    //     required: [true, "Ownership Detials are required"]
    // },
    // landTitleDeedNumber: {
    //     type: String,
    //     required: [true, "Deed Number is Required"]
    // },
    // landLocation: {
    //     type: String,
    //     required: [true, "Land location is required"]
    // },
    // landArea: { 
    //     type: String,
    //     required:[true,"Land area is required"]
    // },
    // landType: {
    //     enum:["commercial", "resedential"],
    //     required: [true, "Land type is required"]
    // },
    // previousLandTransection: {
    //     type: String, // from cloudinary
    // },
    // citizenShipDetails:[
    //    {
    //     citizenFront: {
    //         type:String,
    //         required: [true, "Citizen front image is required"]
    //     },
    //     citizenBack: {
    //         type: String,
    //         required: [true, "Citizen back image is required"]
    //     }
    //    }
    // ],
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender id is required"]
    }

}, { timestamps: true })


export const Seller = mongoose.model("Seller", userSellerSchema);