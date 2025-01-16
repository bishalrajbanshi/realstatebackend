import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/common/apiError.js";

const logoutServices = async (userId) => {
  if (userId.role === "Admin") {
    return await logoutUser(Admin, userId._id);
  } else if (userId.role === "Manager") {
    return await logoutUser (Manager, userId, userId._id);
  } else {
      return await logoutUser(User,userId._id);
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
