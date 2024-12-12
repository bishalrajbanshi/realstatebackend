import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Seller } from "../../models/user.seller.model.js";

const userSellerForm = asyncHandler(async (req, res, next) => {
  try {
   

    const { fullName, mobileNumber } = req.body;
    const userId = req.user?._id;
    console.log("userID",userId);
    

    // Check valid user
    if (!userId) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid user request",
      });
    }

   

    // Create and save the new Seller document (using await)
    const newForm = await Seller.create({
      fullName,
      mobileNumber,
      sentBy: userId,
    });

    const populatedForm = await Seller.findById(newForm._id).populate('senderName', 'fullName');
    console.log(populatedForm);

    await newForm.save()
    

    return res.status(200).json({ message: "Successfully send data" });
  } catch (error) {
    next(error);
  }
});

export { userSellerForm };