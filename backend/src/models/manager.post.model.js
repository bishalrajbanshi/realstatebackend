import mongoose, { Schema } from "mongoose";
import { type } from "os";

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
    avatar: [
      {
        type: String, //cloudinary
        required: true,
      },
    ],
    images: [
      {
        type: String,
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
    landLocation: {
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
    landCity: {
      type: String,
      required: [true, "city is required"],
      trim: true,
    },
    landAddress: {
      type: String,
      required: [true, "land address is required"],
    },
    landType: {
      type: String,
      enum: ["Commercial", "Residential"],
      required: [true, " land type is required"],
      trim: true,
    },
    landCatagory: {
      type: String,
      enum: ["Land", "House", "Apartment", "Property", "Villa"],
      // required: [true, "Category is required"],
    },
    area: {
      type: String,
      required: [true, "Area is required"],
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: String,
      required: [true, "Price is reqiuired"],
    },
    isNegotiable: {
      type: Boolean,
      required: [true, "negotiable is required"],
    },
    state: {
      type: String,
      enum: ["pending", "approved", "reject"],
      default: "pending",
      required: [true, "State is required"],
    },
    purpose: {
      type: String,
      enum: ["rent", "sell", "officeSpace"],
      required: [true, "Property type is required"],
    },
    featured: {
      type: String,
      enum: ["featured", "unpaid"],
      default: "unpaid",
    },
    videoLink: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description required"],
    },
  },
  { timestamps: true }
);

managerPostSchema.index({sellerId:1})
managerPostSchema.index({ createdAt: -1 });
managerPostSchema.index({ landType: 1 });
managerPostSchema.index({ landCatagory: 1 });
managerPostSchema.index({ landLocation: 1 });
managerPostSchema.index({ area: 1 });

export const Post = mongoose.model("Post", managerPostSchema);
