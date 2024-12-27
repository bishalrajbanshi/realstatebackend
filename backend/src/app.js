import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import expressSanitizer from "express-sanitizer";
import { size } from "./constant.js";
import session from "express-session"; 

const app = express();

//CORS CONFIGURATION
const origin = process.env.CORS_ORIGIN;
app.use(cors({
    origin: origin || '*',
    credentials: true
}));

//USE HELMET
app.use(helmet());

//LIMIT JSON
app.use(express.json({
    limit:size,
}));

//USE EXPRESS SENITIZER
app.use(expressSanitizer());

//STATIC FILES
app.use(express.static("public"));

//COOKIEPARSER
app.use(cookieParser());

// SET SESSON MANAGEMENT
app.use(session({
    secret: process.env.SESSION_SECRET , 
// Don't save session if not modified
    resave: false, 
     // Don't create session until something is stored
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
         // Ensure cookie is only accessible by the server
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

//RETE LIMITINE MIDDLEWARE
const limiter = rateLimit({
    //limit 15 minuits
    windowMs: 15 * 60 * 1000,
    // limit each IP 
    max: 100, 
    message: "Too many requests from this IP, please try again later"
})
app.use(limiter);


//api DECLERATIONS
import adminRouter from "./routes/admin.route.js";
import managerRouter from "./routes/manager.route.js";
import userRouter from "./routes/user.route.js";

app.use("/api/admin",adminRouter);
app.use("/api/manager",managerRouter);
app.use("/api/v1/user",userRouter);



//ERROR HANDALING MIDDLEWARES
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