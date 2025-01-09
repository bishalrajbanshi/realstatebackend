//FRO SIZE eg json etc
export const size = "50kb";

//FOR SALT
import bcryptjs from "bcryptjs";
export const salt = await bcryptjs.genSalt(10);

