
import { sendEmail } from "../../middlewares/general/sendemail.js";
import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import { utils } from "../../utils/index.js";
const{ apiError,generateCode,hashOtp,emailHtmlContent }=utils;


const changeEmail = async (data, userId) => {
    try {
      const { email, role } = data;
  
      // Validate input data
      if (!email) {
        throw new apiError({
          statusCode: 400,
          message: "Email is required.",
        });
      }
  
      if (!userId) {
        throw new apiError({
          statusCode: 400,
          message: "Invalid user ID.",
        });
      }
  
      // Call the model (Manager or User)
      if (role === "Manager") {
        return await updateEmail(email, Manager, userId);
      } else {
        return await updateEmail(email, User, userId);
      }
    } catch (error) {
      throw error;
    }
  };
  export { changeEmail }
  
  async function updateEmail(email, newModel, userId) {
    // Validate the model
    if (!newModel) {
      throw new apiError({
        statusCode: 400,
        message: "Model Not found.",
      });
    }
  
    // Find the user by ID
    const user = await newModel.findById(userId);
    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "User not found.",
      });
    }
  
    // Ensure the new email is different from the current one
    if (user.email === email) {
      throw new apiError({
        statusCode: 400,
        message: "The entered email matches your current email.",
      });
    }
  
    // Check if the email already exists in the database
    const emailExists = await newModel.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      throw new apiError({
        statusCode: 400,
        message: "Email already in use by another user.",
      });
    }
  
    // Set isEmailUpdating flag to true, as the email is being updated
    user.isEmailUpdating = true;
    user.isverified = false;
    user.email = email;
  
    // Generate the verification code
    const verificationCode = generateCode();
    const hashedOtp = await hashOtp(verificationCode);
    const verificationCodeExpire = new Date(Date.now() + 3 * 60 * 1000);
  
    user.verificationCode = hashedOtp;
    user.verificationCodeExpire = verificationCodeExpire;
  
    // Save the updated user
    await user.save();
  
    // Send verification email
    const emailHtml = emailHtmlContent({
      fullName: user.fullName,
      verificationCode: verificationCode,
    });
    sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: emailHtml,
    });
  
    return {
      message: "Verification email sent successfully.",
    };
  }
  