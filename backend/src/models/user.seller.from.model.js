import mongoose, { Schema } from "mongoose";

const sellerForm = new Schema(
  {
    sendBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
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
      enum: ["Commercial", "Resendential"],
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
            //take the multiple facilities for the individual user
            required: [true,"Facilities are required"] ,
            trim: true
        }
    ],
    state: {
      type: String,
      enum: ["pending","completed"],
      default: "pending"
    },
    discription: {
        type: String,
        trim: true,
    }

  },
  { timestamps: true }
);

sellerForm.index({ landType: 1});
export const Sellerfrom = mongoose.model("Sellerform", sellerForm);
