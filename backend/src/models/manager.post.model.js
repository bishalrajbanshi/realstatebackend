import mongoose, { Schema } from "mongoose";

const managerPostSchema = new Schema({

    postBy: {
        type: Schema.Types.ObjectId,
        ref: "Manager",
        required: [true, "post by required"]
    },
    managerAddress: {
        type: String,
        required: true
    },
    managerFullName: {
        type: String
    },
  
    images: [
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
    sellerFullname: {
        type: String,
    },
    sellerEmail: {
        type: String,
    },
    sellerAddress: {
        type: String
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