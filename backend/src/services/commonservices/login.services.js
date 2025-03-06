import { apiError } from "../../utils/common/apiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/helper/generateTokens.js";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";

const loginServices = async (userData) => {
  try {
    const { email, role, password } = userData;

    //check for role
    if (role === "Admin") {
      const result = await loginUser(Admin, email, password);
      return result;
    } else if (role === "Manager") {
      const result = await loginUser(Manager, email, password);
      return result;
    } else {
      return await loginUser(User, email, password);
    }
  } catch (error) {
    throw error;
  }
};
export { loginServices };

//check email password
async function validation(userModel, email, password) {
  const user = await userModel.findOne({
    email: email.toLowerCase(),
  });

  //validate
  if (!user) {
    throw new apiError({
      statusCode: 400,
      message: `${userModel.modelName} not found`,
    });
  }

  //check the valid password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError({
      statusCode: 400,
      message: "Invalid Credentials",
    });
  }

  // token generate
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  user.refreshToken = refreshToken;

  const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken");

  user.isLoggedIn = true;
  await user.save();

  return { accessToken,refreshToken };
}

//function for both admin manager user login
async function loginUser(userModel, email, password, res, next) {
  try {
    //model is User
    if (userModel.role === "User") {
      //verify false
      if (!userModel.isVerified) {
        //isupdating true
        if (userModel.isEmailUpdating) {
         return await validation(userModel, email, password);
        }else{
          throw new apiError({
            statusCode: 400,
            message: `unable to login ${userModel}`
          })
        }
      } else {
        return await validation(userModel, email, password);
      }
    } else {
      return await validation(userModel, email, password);
    }
  } catch (error) {
    throw error;
  }
}
