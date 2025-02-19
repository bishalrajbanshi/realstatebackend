import mongoose, { Schema, Types } from "mongoose";

const enquertProperty = new Schema(
  {
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },     
    fullName: {
      type: String,
    },
    email: {
        type: String,
    },
    currentAddress: {
      type: String,
      required: [true,"Current address is required"]
    },
    province: { 
      type: String,
      enum:["Province1","Province2","Province3","Province4","Province5","Province6","Province7"],
      required : [true, "Address is required"]
  },
    propertyType: {
      type: String,
      required: true,
      enum: ["Residential", "Commercial"],
    },
    purpose: {
      type: String,
      enum: ["Buy", "Rent"],
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum:["pending", "approved", "reject"],
      default:"pending",
      required: [true, "State is required"],
  },
    message: { type: String },
  },
  { timestamps: true }
);

enquertProperty.index({ sendBy: 1 });
enquertProperty.index({ address: 1});
enquertProperty.index({ propertyType: 1});
enquertProperty.index({ purpose: 1});
enquertProperty.index({ createdAt: -1});

export const Enquertproperty = mongoose.model("Enquertproperty", enquertProperty);
