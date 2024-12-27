import { Enqueryform } from "../../../models/user.enquery.form.js";
import { User } from "../../../models/user.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const userEnqueryForm = async (userEnqueryData, userId) => {
  try {
    //destructure
    const { address, propertyType, purpose, mobileNumber, message } =
      userEnqueryData;

    if (!address || !propertyType || !purpose || !mobileNumber) {
      throw new apiError({
        statusCode: 400,
        message: "All Fields are required",
      });
    }

    // Fetch user details
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const newEnqueryForm = new Enqueryform({
      fullName: user.fullName,
      email: user.email,
      currentAddress: user.currentAddress,
      address,
      propertyType,
      purpose,
      mobileNumber,
      message,
      sendBy:user
    });
    await newEnqueryForm.save();
  } catch (error) {
    throw error;
  }
};

export { userEnqueryForm };
