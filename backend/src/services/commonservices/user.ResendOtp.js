import { middlewares } from "../../middlewares/index.js";
const { sendEmail } = middlewares;
import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/common/apiError.js";
import { emailHtmlContent } from "../../utils/common/emailTemplate.js";
import { generateCode, hashOtp } from "../../utils/helper/otpGenarator.js";

const getUserModel = (userId) => {
  const role = userId.role;
  console.log(role);
  
  if (!role) role = "User";

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
    if (!userId) {
      return await userResendCode(userData);
    }
    else{
      return await resentCodeGlobal(userData,userId);
    }
  } catch (error) {
    throw error
  }
};

export { userResend };

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

async function resentCodeGlobal(userData, userId) {
  try {
    // //validate user
    const { email } = userData;
    if (!email) {
      throw new apiError({
        statusCode: 400,
        message: "Email required",
      });
    }

    //get usermodel
    const userModel = getUserModel(userId);
    console.log(userModel);
    

    //find user
    const user = await userModel.findOne({ email: email.toLowerCase() });

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
    throw error
  }
}
