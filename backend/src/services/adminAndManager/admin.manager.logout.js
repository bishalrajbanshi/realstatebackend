import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { apiError } from "../../utils/common/apiError.js";

const adminManagerLogout = async (userData) => {
  if (userData.role === "Admin") {
    return await logoutUser(Admin, userData._id);
  } else if (userData.role === "Manager") {
    return await logoutUser (Manager, userData, userData._id);
  } else {
    throw new apiError({
      statusCode: 400,
      message: "Invalid role",
    });
  }
};

export { adminManagerLogout };

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
        $unset: { accessToken: "", refreshToken: "" },
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
