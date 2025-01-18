import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/common/apiError.js";

const logoutServices = async (userId) => {
  try {
    
    if (!userId) {
      throw new apiError({
        statusCode: 400,
        message: "Role or user ID is missing",
      });
    }
    

    if (userId.role === "Admin") {
      return await logoutUser(Admin, userId);
    } else if (userId.role === "Manager") {
      return await logoutUser(Manager, userId);
    } else {
      return await logoutUser(User, userId);
    }
  } catch (error) {
    throw error;
  }
};

export { logoutServices };

//admin and manager logout function
async function logoutUser(userModel, userId) {
  try {
    //validate user id
    if (!userId) {
      throw new apiError({
        statusCode: 401,
        message: `${userModel.modelName} not authorized`,
      });
    }

    //clear the token from database
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: "" },
        $set: { isLoggedIn: false },
      },
      { new: true }
    );

    //validate
    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "User not found",
      });
    }
    return user;
  } catch (error) {
    throw error;
  }
}
