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
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js"
import managerRouter from "./routes/manager.route.js"
app.use("/api/v1/user",userRouter);
app.use("/api/v2/admin",adminRouter)
app.use("/api/v3/manager",managerRouter)






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