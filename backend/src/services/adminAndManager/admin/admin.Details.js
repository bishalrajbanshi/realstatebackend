import { Admin } from "../../../models/admin.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const adminDetails = async (adminid) => {
  try {
    //validate user id
    if (!adminid) {
      throw new apiError({
        statusCode: 401,
        message: "Invalid admin Id",
      });
    }
    const admin = await Admin.findById(adminid).select(
      "fullName userName email  mobileNumber"
    );

    //validate admin
    if (!admin) {
      throw new apiError({
        statusCode: 401,
        message: "Admin not fround",
      });
    }
    return admin;
  } catch (error) {
    throw error;
  }
};

export { adminDetails };
