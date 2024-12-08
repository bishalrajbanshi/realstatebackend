import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import  { logger }  from "../utils/logger.js";


//config dot env
configDotenv({
    path: './.env',
});


//db connection
const  databaseConnectin = async () => {

    try {

 

        const { DB_USERNAME, DB_PASSWORD, DB_CLUSTERURI, DB_NAME } = process.env;

        console.log(process.env.DB_USERNAME);  // Should print 'sulabghar'
        console.log(process.env.DB_PASSWORD);  // Should print 'sulab'
        console.log(process.env.DB_CLUSTERURI);  // Should print 'sulavgharghadari.x8rdq.mongodb.net'
        console.log(process.env.DB_NAME);  // Should print 'sulabghargadari'
        
        

         // Validate environment variables
         if (!DB_USERNAME || !DB_PASSWORD || !DB_CLUSTERURI || !DB_NAME) {
            throw new Error('Missing required environment variables');
        }
        

        const connectionString = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTERURI}/${DB_NAME}?retryWrites=true&w=majority`;
        console.log(connectionString);
        
        logger.info('Attempting to connect to MongoDB...');

        const connectionInstance = await mongoose.connect(connectionString,{
            dbName: DB_NAME,
            maxPoolSize: 30,
            minPoolSize: 1
        });
      

        
        logger.info(`Mongoose connected to database on host:${connectionInstance.connection.host}`);

       
    } catch (error) {

        logger.error(`Database connection failed: ${error.message}`);
        if (error.message.includes('Missing required environment variables')) {
            logger.error('Please check your .env file for missing values.');
        } else {
            logger.error('Error details:', error);
        }
        process.exit(1); 

        
    }

     //graceful sutdown
     const cleanup = async () => {
        await mongoose.connection.close();
        logger.info('Mongoose connection closed due to application termination');
        process.exit(0);
    };

    process.on('SIGINT', cleanup); 
    process.on('SIGTERM', cleanup); 
    

}

export default databaseConnectin;