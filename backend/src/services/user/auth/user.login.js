import { generateAccessToken, generateRefreshToken } from "../../../utils/helper/generateTokens.js";
import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js";

const userLogin = async (userData) => {
  try {
    const { email, mobileNumber, password } = userData;

    // Check for empty fields
    if (!email && !mobileNumber) {
      throw new apiError({
        statusCode: 400,
        message: "Email or Mobile Number is required",
      });
    }

    // Find the user by email or mobile number
    const user = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    // Validate user existence
    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "User Not Found",
      });
    }

    //unverified user
    if (!user.isverified) {
      throw new apiError({
        statusCode: 400,
        message: "verify email before login"
      })
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new apiError({
        statusCode: 401,
        message: "Invalid Credentials",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save tokens to user
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    
    // Remove sensitive data
    const loggedInUser = await User.findById(user._id).select(
        "-password "
    );
    
    //set the field true
    user.isLoggedIn = true;
    await user.save();

    return loggedInUser;
  } catch (error) {
    throw error;
  }
};

export { userLogin };
