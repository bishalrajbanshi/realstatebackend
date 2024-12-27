import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { logger } from "./logger.js";

// CONFIGURATION
configDotenv({
  path: "./.env",
});

//CONNECTION
const mongoDbConnection = async () => {
  try {
    //BRING FROM DOT ENV
    const { DB_USERNAME, DB_PASSWORD, DB_CLUSTERURI, DB_NAME } = process.env;
    
    //VALIDATE USERNAME AAND PWD
    if (!DB_USERNAME || !DB_PASSWORD) {
      throw new Error("MISSING REQUIREMENTS ENVIRONMENT VARIABLES");
    }

    //CONNECTION STRING
    const connectionString = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTERURI}/${DB_NAME}?retryWrites=true&w=majority`;

    //CONNECTION INSTANCE
    const connectionInstance = await mongoose.connect(connectionString, {
      dbName: DB_NAME,
      maxPoolSize: 20,
      minPoolSize: 2,
    });
    console.log("MONGO DB CONNECTED");
    logger.info(
      `Mongoose connected to database on host:${connectionInstance.connection.host}`
    );
  } catch (error) {
    if (error.message.includes("MISSING REQUIREMENTS ENVIRONMENT VARIABLES")) {
      console.log("Please check your .env file for missing values");
    } else {
      console.log("Error details: ", error);
    }
    process.exit(1);
  }

  const cleanup = async () => {
    await mongoose.connection.close();
    logger.info("Mongoose connection closed due to application termination");
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
};

export default mongoDbConnection;
