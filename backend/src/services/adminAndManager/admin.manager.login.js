import { apiError } from "../../utils/common/apiError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/helper/generateTokens.js";
import { Admin } from "../../models/admin.model.js";
import { Manager } from "../../models/manager.model.js";

const adminManagerLogin = async(userData)=>{
    try {
        const { email, role, password } = userData;
        
        //check for role
        if (role === "Admin") {
        const result = await loginUser(Admin,email,password);   
        return result;
        } else if (role === "Manager") {
            const result = await loginUser(Manager,email,password); 
            return result;
        }else {
            throw new apiError({
                statusCode:404,
                message: "Invalid Role"
            })
        }
    
    } catch (error) {
        throw error
    }
}


export { adminManagerLogin }

//function for both admin and manager login
async function loginUser(userModel, email, password, res, next) {
    try {
        const user = await userModel.findOne({
            email: email.toLowerCase()
        });

        //validate 
        if (!user) {
            throw new apiError({
                statusCode: 400,
                message: `${userModel.modelName} not found`
            })
        };

        //check the valid password
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new apiError({
                statusCode: 400,
                message: "Invalid Credentials"
            })
        };

        // token generate
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        const loggedInUser = await userModel.findById(user._id).select("-password");

        user.isLoggedIn = true;
        await user.save();

        return { accessToken, refreshToken, user: loggedInUser };

    } catch (error) {
        throw error;
    }
}