import mongoose, { Schema } from "mongoose";
import { generatePropertyId } from "../utils/helper/generatePropertyId.js";



const managerPostSchema = new Schema(
  {
    postBy: {
      type: Schema.Types.ObjectId,
      ref: "Manager",
      required: [true, "post by required"],
    },
    managerFullName: {
      type: String,
    },
    managerAddress: {
      type: String,
      required: true,
    },
    propertyId : {
      type: Number,
      unique: true,
    },
    avatar: [
      {
        type: String, //cloudinary
        required: true,
      },
    ],
    images: [
      {
        type: String, //cloudinary
        required: true,
      },
    ],
    //seller from data
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Enqueryform",
      // required:  [true, "seller is required"]
    },
    propertyTitle: {
      type: String,
    },
    fullName: {
      type: String,
    },
    sellerNumber: {
      type: String,
    },
    province: {
      type: String,
      enum: [
        "Province1",
        "Province2",
        "Province3",
        "Province4",
        "Province5",
        "Province6",
        "Province7",
      ],
      required: [true, "Address is required"],
      trim: true,
    },
    landAddress: {
      type: String,
      required: [true, "land address is required"],
    },
    landType: {
      type: String,
      enum: ["commercial", "residential"],
      required: [true, " land type is required"],
      trim: true,
    },
    landCategory: {
      type: String,
      enum: ["land", "house", "apartment", "officeSpace", "flat"],
      required: [true, "Category is required"],
    },
    propertyAge: {
      type: Number, 
      default: null
    },
    area: {
      size: { type: Number, required: [true, "Area size is required"] },
      unit: {
        type: String,
        enum: ["sqft", "ana", "ropani", "bigha", "kattha", "dhur"],
        required: [true, "Area unit is required"],
      },
    },
    price: {
      amount: {
        type: Number,
        required: [true, "amount is required"],
      },
      sizePerAmount: {
        type: String,
        enum: ["sq ft", "ana", "ropani", "bigha", "kattha", "dhur"],
        required: [true, "Area unit is required"],
      },
    },
    facing: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'North-East', 'South-East', 'South-West', 'North-West', 'Other'],
      default: null, 
      trim: true,
    },
    facilities: {
      type: [String],
      trim: true,
    },

    isNegotiable: {
      type: Boolean,
      required: [true, "negotiable is required"],
    },
    state: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
      required: [true, "State is required"],
    },
    purpose: {
      type: String,
      enum: ["rent", "sell"],
      required: [true, "Property type is required"],
    },
    featured: {
      type: String,
      enum: ["featured", "unpaid"],
      default: "unpaid",
    },
    facebookVideoLink: {
      type: String,
      default : null
    },
    youtubeVideoLink: {
        type: String,
        default : null
    },
    propertyOverView: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "description required"],
    },
  },
  { timestamps: true }
);

//sending post schema to auto generate poroperty id
generatePropertyId(managerPostSchema);

managerPostSchema.index({ sellerId: 1 });
managerPostSchema.index({ createdAt: -1 });
managerPostSchema.index({ 'amount': 1, 'sizePerAmount': 1 });
managerPostSchema.index({ landType: 1 });
managerPostSchema.index({ landCatagory: 1 });
managerPostSchema.index({ province: 1 });
managerPostSchema.index({ area: 1 });

export const Post = mongoose.model("Post", managerPostSchema);
