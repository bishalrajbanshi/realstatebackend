import mongoose, { Schema } from "mongoose";

const managerPostSchema = new Schema({

    postBy: {
        type: Schema.Types.ObjectId,
        ref: "Manager",
        required: [true, "post by required"]
    },
    managerFullName: {
        type: String
    },
    managerAddress: {
        type: String,
        required: true
    },
    avatar: [
        {
            type: String, //from cloudinary
            required: true
        }
    ],
    //seller from
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "Enqueryform",
        required:  [true, "seller is required"]
    },
    sellerFullName: {
        type: String,
    },
    sellerNumber: {
        type: String,
    },
    sellerLandType: {
        type: String,
    },
    sellerLandCatagory: {
        type: String,
    },
    sellerFacilities: [
        {
            type:String,
            //take the multiple facilities for the individual user
            required: [true,"Facilities are required"] ,
            trim: true
        }
    ]

    
}, { timestamps: true});

export const Managerpost = mongoose.model("Managerpost", managerPostSchema);