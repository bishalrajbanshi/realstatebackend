// import jwt from "jsonwebtoken";

// function generateAccessToken(user) {
//     const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
//     const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h';

//     if (!accessTokenSecret) {
//         throw new Error("ACCESS_TOKEN_SECRET is not defined");
//     }

//     return jwt.sign({
//         _id: user._id,
//         email: user.email,
//         role:user.role
//     }, accessTokenSecret, { expiresIn: accessTokenExpiry });
// }

// function generateRefreshToken(user) {
//     const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
//     const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

//     if (!refreshTokenSecret) {
//         throw new Error("REFRESH_TOKEN_SECRET is not defined");
//     }

//     const refreshToken = jwt.sign({ 
//         _id: user._id,
//      }, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
//     console.log("Generated Refresh Token:", refreshToken);
//     return refreshToken;
// }


// export{ generateAccessToken, generateRefreshToken };


import jwt from "jsonwebtoken";

function generateAccessToken(user) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "1h";

    if (!accessTokenSecret) {
        console.error("ACCESS_TOKEN_SECRET is not defined");
        throw new Error("Internal server error: Configuration issue");
    }

    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        accessTokenSecret,
        {
            expiresIn: accessTokenExpiry,
            algorithm: "HS256",
        }
    );
}

function generateRefreshToken(user) {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";

    if (!refreshTokenSecret) {
        console.error("REFRESH_TOKEN_SECRET is not defined");
        throw new Error("Internal server error: Configuration issue");
    }

    return jwt.sign(
        {
            _id: user._id,
            tokenVersion: user.tokenVersion || 0, // Helps in invalidating old tokens
        },
        refreshTokenSecret,
        {
            expiresIn: refreshTokenExpiry,
            algorithm: "HS256", // Explicitly specify algorithm
        }
    );
}

export { generateAccessToken, generateRefreshToken };

