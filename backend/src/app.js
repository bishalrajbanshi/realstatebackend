import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { size } from "./constants.js";
import helmet from "helmet";
import expressSanitizer from "express-sanitizer";
import { apiError } from "./utils/apiError.js";

const app = express();

//cors configuration
const origin = process.env.CORS_ORIGIN;
app.use(cors({
    origin: origin || '*',
    Credential: true,
}));

//helmet config
app.use(helmet());


//json limit
app.use(express.json({
    limit: size,
}))

//express senitizer
app.use(expressSanitizer());


//static file
app.use(express.static("public"));

//cookieparser
app.use(cookieparser());




//import Routes
import userRouter from "./routes/userroute/user.route.js";
import managerRouter from "./routes/managerroute/manager.route.js";
//declare routes
app.use("/api/v1/user",userRouter);

//for manager
app.use("/api/v3/admin",managerRouter);

//for admin
// app.use("/api/v2",adminlogin);



app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "An unexpected error occurred",
        });
    }
   
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "An unexpected error occurred",
        stack: err.stack, 
    });
});




export { app }