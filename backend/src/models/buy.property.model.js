import mongoose, { Schema } from "mongoose";

const buyProperty = new Schema(
  {
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sent by is requirest"],
    },
    fullName: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: [true, "Current number is required"],
    },
    message: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: [true, "post id required"],
    },
    managerId: {
      type: String,
      required: [true, "manager id is required"],
    },
    state: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
      required: [true, "State is required"],
    },
  },
  { timestamps: true }
);

buyProperty.index({ createdAt: -1 });
buyProperty.index({ sendBy: 1, postId: 1 });

export const Buyproperty = mongoose.model("Buyproperty", buyProperty);
