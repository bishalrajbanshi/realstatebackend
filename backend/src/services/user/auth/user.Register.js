import { User } from "../../../models/user.model.js";
import { apiError } from "../../../utils/common/apiError.js";
import { hashOtp, generateCode } from "../../../utils/helper/otpgenarator.js";
import { sendEmail } from "../../../middlewares/general/sendemail.js";
import { emailHtmlContent } from "../../../utils/common/emailTemplate.js";

// CREATE USER
const userRegister = async (userData) => {
  try {
    const { fullName, email, mobileNumber, currentAddress, password } =
      userData;
    // Validate input fields
    if (
      [fullName, email, mobileNumber, currentAddress, password].some(
        (field) => !field?.trim()
      )
    ) {
      throw new apiError({
        statusCode: 400,
        message: "All fields are required",
      });
    }

    console.log("user data", userData);

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      throw new apiError({
        statusCode: 400,
        message: "User already exists. Please log in or verify your account.",
      });
    }

    // Generate verification code and hash it
    const verificationCode = generateCode();
    const hashedOtp = await hashOtp(verificationCode);
    const verificationCodeExpire = new Date(Date.now() + 3 * 60 * 1000);

    // Create and save the new user
    const newUser = new User({
      fullName,
      email,
      mobileNumber,
      currentAddress,
      password,
      verificationCode: hashedOtp,
      verificationCodeExpire,
    });

    await newUser.save();
    // Send verification email
    const emailHtml = emailHtmlContent({ fullName, verificationCode });
    sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

export { userRegister };

// Validate fro future use
//  const validEmail = await checkEmailValidity(email);
//  if (!validEmail) {
//    throw new apiError({
//      statusCode: 404,
//      message: "Please enter a valid email address",
//    });
//  }
