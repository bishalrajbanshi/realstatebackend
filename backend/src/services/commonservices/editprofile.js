import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import { utils } from "../../utils/index.js";
const { apiError } = utils;

const getUserByRole = async (role, userId) => {
  switch (role) {
    case "Admin":
      return await Admin.findById(userId);
    case "Manager":
      return await Manager.findById(userId);
    case "User":
      return await User.findById(userId);
    default:
      throw new apiError({
        statusCode: 400,
        message: "Invalid role access",
      });
  }
};

const editProfile = async ( userData,updateData) => {
  try {
    const{ userId,role}= userData;
    const user = await getUserByRole(role, userId);
    // Validate if user exists
    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: `${role} not found`,
      });
    }
  
    //udate data
    Object.keys(updateData).forEach((key) => {
      if (user[key] != undefined && key !== "password") {
        user[key] = updateData[key];
      }
    });
    await user.save();
  } catch (error) {
    throw error;
  }
};

export { editProfile };
