import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { User } from "../../models/user.model.js";

const userDetails = asyncHandler(async (req, res) => {
  try {
    const userID = req.user?._id;

    console.log("user details for:", userID);
    if (!userID) {
      throw new apiError({
        statusCode: 401,
        message: "Unauthorized. User ID not found.",
      });
    }

    const user = await User.findById(userID).select(
      "fullName email mobileNumber refreshToken accessToken"
    );

    res.status(200).json(
      new apiResponse({
        data: user,
        success: true,
      })
    );
  } catch (error) {
    throw new apiError({
      statusCode: 400,
      message:"user not found"
    });
  }
});

export { userDetails };
