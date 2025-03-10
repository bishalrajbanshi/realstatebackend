import { middlewares } from "../../middlewares/index.js";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";
const { sendEmail } = middlewares;
import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/common/apiError.js";
import { emailHtmlContent } from "../../utils/common/emailTemplate.js";
import { generateCode, hashOtp } from "../../utils/helper/otpGenarator.js";

const getUserModel = (userId) => {
  let role = userId.role;
  if (!role) role = "User";
  console.log(role);
  

  if (!["User", "Manager", "Admin"].includes(role)) {
    throw new apiError({
      statusCode: 400,
      message: "Invalid role specified",
    });
  }
  switch (role) {
    case "Admin":
      return Admin;
      break;
    case "Manager":
      return Manager;
      break;
    default:
      return User;
      break;
  }
};

const userResend = async (userData, userId) => {
  try {
    
    if (userId) {
      return await resentCodeGlobal(userData,userId);
    }
    else{
      return await userResendCode(userData);
    }
  } catch (error) {
    throw error
  }
};

export { userResend };

async function resentCodeGlobal(userData, userId) {
  try {
    // Validate user email
    
    const { email } = userData;
    if (!email) {
      throw new apiError({
        statusCode: 400,
        message: "Email required",
      });
    }

    // Get user model based on userId (Manager, Admin, or User)
    const userModel = getUserModel(userId);

    // Find user in the database by email
    const user = await userModel.findOne({ email: email.toLowerCase() });

    // Check if the user exists
    if (!user) {
      throw new apiError({
        statusCode: 400,
        message: "User not found",
      });
    }

    // Validate if the user is already verified
    if (user.isverified === true) {
      throw new apiError({
        statusCode: 400,
        message: "User is already verified. Please login.",
      });
    }

    // If a verification code already exists, clear it before generating a new one
    if (user.verificationCode && user.verificationCodeExpire) {
      user.verificationCode = undefined;
      user.verificationCodeExpire = undefined;
    }

    // Generate a new verification code
    const verificationCode = generateCode();
    console.log("verificationCode",verificationCode);
    
    const hashedOtp = await hashOtp(verificationCode);
    console.log(hashedOtp);
    

    // Set expiration time for the verification code (3 minutes from now)
    const verificationCodeExpire = new Date(Date.now() + 3 * 60 * 1000);

    // Assign the new verification code and expiration time to the user
    user.verificationCode = hashedOtp;
    user.verificationCodeExpire = verificationCodeExpire;

    // Save the updated user data to the database
    await user.save();

    // Prepare the email content (HTML) with the verification code
    const emailHtml = emailHtmlContent({
      fullName: user.fullName,
      verificationCode: verificationCode,
    });

    // Send the verification email to the user
    sendEmail({
      to: user.email,
      subject: "Resend verification code",
      html: emailHtml,
    });

  } catch (error) {
    throw error; // Propagate the error
  }
}



async function userResendCode(userData) {
  try {
    const { email } = userData;

    //validated field
    if (!email) {
      throw new apiError({
        statusCode: 400,
        message: "Email required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    //validate user
    if (!user) {
      throw new apiError({
        statusCode: 400,
        message: "User not found",
      });
    }

    //validate verification
    if (user.isverified === true) {
      throw new apiError({
        statusCode: 400,
        message: "User is already verified. Please login.",
      });
    }

    //if code exist make undefined befor generate new code and save to db
    if (user.verificationCode && user.verificationCodeExpire) {
      user.verificationCode = undefined;
      user.verificationCodeExpire = undefined;
    }

    //code generation
    const verificationCode = generateCode();
    const hashedOtp = await hashOtp(verificationCode);
    const verificationCodeExpire = new Date(Date.now() + 3 * 60 * 1000);
    user.verificationCode = hashedOtp;
    user.verificationCodeExpire = verificationCodeExpire;
    await user.save();

    const emailHtml = emailHtmlContent({
      fullName: user.fullName,
      verificationCode: verificationCode,
    });
    //send email
    sendEmail({
      to: user.email,
      subject: "Resend verification code",
      html: emailHtml,
    });
  } catch (error) {
    throw error;
  }
}

