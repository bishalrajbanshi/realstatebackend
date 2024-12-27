import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js";

const userLogout = async (userID) => {
  try {
    // Ensure the user ID is valid
    if (!userID) {
      throw new apiError({
        statusCode: 401,
        message: "User not authorized",
      });
    }

    //remove tokens
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $unset: { accessToken: "", refreshToken: "" },  
        $set: { isLoggedIn: false },  
      },
      { new: true }
    );

    // If no user was found, throw an error
    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "User not found",
      });
    }

    console.log("User logged out successfully:", user);
    return user;  
  } catch (error) {
    console.error("Error during logout service:", error);
    throw error;
  }
};

export { userLogout };
