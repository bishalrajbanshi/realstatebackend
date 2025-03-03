import mongoose,{Schema} from "mongoose";

const propertyView = new Schema(
    {
        postId:{
            type:Schema.Types.ObjectId,
            ref:"Post",
            required:true
        },
        userId:{
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true
        }

},{ timestamps: true})

propertyView.index({ propertyId:1, ipAddress:1});

export const View = mongoose.model("View",propertyView);