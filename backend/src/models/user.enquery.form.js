import mongoose, { Schema, Types } from "mongoose";

const enqueryForm = new Schema(
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
    address: { 
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
    message: { type: String },
  },
  { timestamps: true }
);

enqueryForm.index({ sendBy: 1 });
enqueryForm.index({ address: 1});
enqueryForm.index({ propertyType: 1});
enqueryForm.index({ purpose: 1});
enqueryForm.index({ createdAt: 1});

export const Enqueryform = mongoose.model("Enqueryform", enqueryForm);
