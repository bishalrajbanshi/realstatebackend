import { app } from "./app.js";
import mongoDbConnection from "./db/dbConnection.js";
import { logger } from "./db/logger.js";
import { config } from "./constant.js";
const{ PORT }=config;

mongoDbConnection()
.then(()=>{
    const port = PORT || 6000;
    app.listen(port, ()=>{
        logger.info(`CONNECTED APPLICATION IS RUNNING AT PORT ${port}`);
    })
})
.catch((error) => {
    logger.error("MONGODB CONNECTION ERROR !! ",error);
    process.exit(1)
})
.finally(()=> {
    logger.info("Attempt to connect to MongoDB completed."); 
})