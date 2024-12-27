import otpGenerator from "otp-generator";
import bcryptjs from "bcryptjs";
import { salt } from "../../constant.js";

//generate code
const generateCode = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    specialChars: false,
  });
};

const hashOtp = async (otp) => {
  try {
    const hashedotp = await bcryptjs.hash(otp, salt);
    return hashedotp;
  } catch (error) {
    console.error("Error hashing OTP:", error);
    throw new Error("Error hashing Otp");
  }
};
export { generateCode , hashOtp };
