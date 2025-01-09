import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js";
import bcryptjs from "bcryptjs";
import { apiResponse } from "../../../utils/common/apiResponse.js";

const userverify = async (userData) => {
  try {
    const { code } = userData;

    // Validation
    if (!code) {
      throw new apiError({
        statusCode: 400,
        message: "Verification code is required",
      });
    }

    // Find user by email (use await to resolve the query properly)
    const user = await User.findOne({
      isverified: false,
      verificationCode: { $exists: true ,}
    })

    // Check the retrieved user object
    console.log("Retrieved User:", user);

    if (!user) {
      throw new apiError({
        statusCode: 400,
        message: "User not found",
      });
    }

    //already verified
    if (user.isverified === true) {
      throw new apiResponse({
        statusCode:201,
        message: "User already verified"
      })
    }


    // Ensure the verification code exists for the user
    if (!user.verificationCode) {
      console.log("No verification code found for this user:", user);
      throw new apiError({
        statusCode: 400,
        message: "Verification code is not found for this user",
      });
    }

    // Compare the hashed verification code with the user input
    const isValidCode = await bcryptjs.compare(code, user.verificationCode);

    if (!isValidCode) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid verification code",
      });
    }

      // Check if the verification code has expired
      if (new Date() > user.verificationCodeExpire) {
        // If expired, clear the verification code and expiration time
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        // Throw error indicating that the verification code has expired
        throw new apiError({
          statusCode: 400,
          message: "Verification code has expired",
        });
      }

    // Mark the user as verified and remove the verification code
    user.isverified = true;
    user.verificationCode = undefined; 
    user.verificationCodeExpire = undefined;
    await user.save();


  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export { userverify };
