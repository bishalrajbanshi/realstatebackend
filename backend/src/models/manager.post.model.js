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
            type: String,//cloudinary
            required: true
        }
    ],
    images: [
        {
            type: String, 
            required: true
        }
    ],
    //seller from data
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Enqueryform",
        required:  [true, "seller is required"]
    },
    homeName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    sellerNumber: {
        type: String,
    },
    landLocation: [
        {
            address: {
              type: String,
              enum:["Province1","Province2","Province3","Province4","Province5","Province6","Province7"],
              required: [true, "Address is required"],
              trim: true
            },
            city: {
              type: String,
              required: [true, "city is required"],
              trim: true
            },
            area: {
              type: String,
              required: [true, "area is required"],
              trim: true
            },
          },
    ],
    landType: {
        type: String,
    },
    landCatagory: {
        type: String,
    },
    area: {
        type: String,
        required: [true,"Area is required"]
    },
    facilities: [
        {
            type:String,
            trim: true
        }
    ],
    price:{
        type: String,
        required: [true,"Price is reqiuired"]
    },
    isNegotiable:{
        type: Boolean,
        required: [true,"negotiable is required"]
    },
    state: {
        type: String,
        enum:["pending","approved","reject"],
        default:"pending",
        required: [true, "State is required"],
    },
    purpose: {
        type: String,
        enum: ["rent", "sell", "officeSpace"],
        required: [true, "Property type is required"],
    },
    description: {
        type: String,
        required: [true,"description required"]
    },

    
}, { timestamps: true});

managerPostSchema.index({ createdAt: -1})
managerPostSchema.index({ landType: 1})
managerPostSchema.index({ landCatagory: 1})
managerPostSchema.index({ landLocation: 1})
managerPostSchema.index({ area: 1})

export const Post = mongoose.model("Post", managerPostSchema);