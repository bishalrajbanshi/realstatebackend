import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet, { xssFilter } from "helmet";
import rateLimit from "express-rate-limit";
import expressSanitizer from "express-sanitizer";
import { size } from "./constant.js";
import { config } from "./constant.js";
const { CORS_ORIGIN, NODE_ENV } = config;
const isProduction = NODE_ENV === "production";

const app = express();

//CORS CONFIGURATION
const origin = CORS_ORIGIN;
app.use(
  cors({
    origin: origin || "*",
    credentials: true,
  })
);

//USE HELMET
app.use(helmet());
// Hide the "X-Powered-By" header to reduce information leakage about your stack
app.use(helmet.hidePoweredBy());
// clickjacking by setting the X-Frame-Options header to 'DENY'
app.use(helmet.frameguard({ action: "deny" }));
//for cross site scripting
app.use(xssFilter());

//ontent Security Policy (CSP) with strong directives for production
if (isProduction) {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"], 
        upgradeInsecureRequests: [], 
        baseUri: ["'self'"],
      },
    })
  );
}

//LIMIT JSON
app.use(
  express.json({
    limit: size,
  })
);

//USE EXPRESS SENITIZER
app.use(expressSanitizer());

//STATIC FILES
app.use(express.static("public"));

//COOKIEPARSER
app.use(cookieParser());

//RETE LIMITINE MIDDLEWARE
const limiter = rateLimit({
  //limit 15 minuits
  windowMs: 5 * 60 * 1000,
  // limit each IP
  max: 500,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

//api DECLERATIONS
import adminRouter from "./routes/admin.route.js";
import managerRouter from "./routes/manager.route.js";
import userRouter from "./routes/user.route.js";

app.use("/api/admin", adminRouter);
app.use("/api/manager", managerRouter);
app.use("/api/v1/user", userRouter);

//ERROR HANDALING MIDDLEWARES
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
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

export { app };
