import { Manager } from "../../models/manager.model.js";
import { User } from "../../models/user.model.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const loginManager =  asyncHandler ( async (req,res,next) => {

    try {

        //detials from frontend
        const { email, password } = req.body;

        if(!email || !password){
            throw new apiError({
                statusCode:400,
                success: false,
                message: "ALL FIELD ARE REQUIRES"
            })
        };

        //find fro existing user
        const manager = await Manager.findOne({ email });

        if (!manager) {
            throw new apiError({
                statusCode: 400,
                metadata: "user not found"
            })
        };

        //checking for password
        const isPasswordValid = await manager.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new apiError({
                statusCode: 401,
                message:"Invalid Credentials"
            })
        }

        //generate access and refreshtoken
        const accessToken = manager.generateAccessToken();
        const refreshToken = manager.generateRefreshToken();
        //assign model to save 
        manager.accessToken = accessToken;
        manager.refreshToken = refreshToken;
        await manager.save();

        //return response
        return new apiResponse({
            statusCode:200,
            success: true,
            message: "Manager Logged in Successful",
            data: {
                accessToken, refreshToken
            }
        }).send(res)


    } catch (error) {
        console.error("Loggin Error",error);
        return next(error);
        
    }

});

export { loginManager}

