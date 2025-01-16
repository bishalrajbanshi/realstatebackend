import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import { utils } from "../../utils/index.js";
const {apiError}=utils;

async function getUser(role,userId) {
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
}

const changeUserPassword = async (userIds, userData) => {
    try {
      const { role, userId } = userIds;
      const { newPassword, oldPassword } = userData;
  
      // Validate role
      if (!role || !userId) {
        throw new apiError({
          statusCode: 400,
          message: "Invalid access"
        });
      }
  
      // Validate passwords
      if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
        throw new apiError({
          statusCode: 400,
          message: "Both old and new passwords must be provided together"
        });
      }
  
      if (!oldPassword || !newPassword) {
        throw new apiError({
          statusCode: 400,
          message: "Both old and new passwords are required"
        });
      }
      const user = await getUser(role, userId); 
  
      // If user not found, throw error
      if (!user) {
        throw new apiError({
          statusCode: 404,
          message: "User not found"
        });
      }

      //check for valid password 
      const isPasswordValid = await user.isPasswordCorrect(oldPassword);
      console.log("Password Match Result:", isPasswordValid);
      

      if (!isPasswordValid) {
        throw new apiError({
          statusCode: 400,
          message: "Invalid Credentials",
        });
      }
      user.password = newPassword;
      user.isLoggedIn = false;
      await logOutUserByRole(role, userId);
      await user.save();

      return user;

    } catch (error) {
      throw error;
    }
  };
  
export { changeUserPassword }


async function logOutUserByRole(role, userId) {
    try {
      if (role === "Admin") {
        return await Admin.updateOne(
          { _id: userId },
          {
            $unset: { accessToken: "", refreshToken: "" },
            $set: { isLoggedIn: false },
          }
        );
      } else if (role === "Manager") {
        return await Manager.updateOne(
          { _id: userId },
          {
            $unset: { accessToken: "", refreshToken: "" },
            $set: { isLoggedIn: false },
          }
        );
      } else if (role === "User") {
        return await User.updateOne(
          { _id: userId },
          {
            $unset: { accessToken: "", refreshToken: "" },
            $set: { isLoggedIn: false },
          }
        );
      } else {
        throw new Error("Invalid role");
      }
    } catch (error) {
      throw new Error(`Error logging out user: ${error.message}`);
    }
  }





