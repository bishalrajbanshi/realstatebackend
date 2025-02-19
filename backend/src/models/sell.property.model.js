import mongoose, { Schema } from "mongoose";

const sellProperty = new Schema(
  {
    sendBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyTitle:{
      type: String
    },
    fullName:{
      type:String,
      required: [true,"fullname is required"],
      trim: true
    },
    mobileNumber: {
      type: String
    },
    // user input address city and area inland location
    province:{
      type:String,
      enum:["Province1","Province2","Province3","Province4","Province5","Province6","Province7"],
      required: [true, "Address is required"],
      trim: true
    },
    landCity: {
      type: String,
      required: [true, "city is required"],
      trim: true
    },
    landAddress: {
      type: String,
      required:[true,"land address is required"]
    },
    landType: {
      type: String,
      enum: ["Commercial", "Residential"],
      required: [true, " land type is required"],
      trim: true
    },
    landCategory: {
        type: String,
        enum: ["Land","House","Apartment","Property","Villa",],
        required: [true,"Category is required"],
    },
    facilities:[
        {
            type:String,
            required: [true,"Facilities are required"] ,
            trim: true
        }
    ],
    state: {
      type: String,
      enum:["pending", "approved", "reject"],
      default:"pending",
      required: [true, "State is required"],
  },
    discription: {
        type: String,
        trim: true,
    }

  },
  { timestamps: true }
);

sellProperty.index({ landType: 1});
export const Sellproperty = mongoose.model("Sellproperty", sellProperty);
