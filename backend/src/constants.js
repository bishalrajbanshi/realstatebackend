import bcryptjs from "bcryptjs";

//for salt
export const generateSalt = async () => {
    return await bcryptjs.genSalt(10);
  };
  
//for json size
export const size = "50kb";