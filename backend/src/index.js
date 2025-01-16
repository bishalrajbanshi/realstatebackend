import { app } from "./app.js";
import mongoDbConnection from "./db/dbConnection.js";
import { config } from "./constant.js";
const{ PORT }=config;

mongoDbConnection()
.then(()=>{
    const port = PORT || 6000;
    app.listen(port, ()=>{
        console.log(`CONNECTED APPLICATION IS RUNNING AT PORT ${port}`);
    })
})
.catch((error) => {
    console.error("MONGODB CONNECTION ERROR !! ",error);
    process.exit(1)
})
.finally(()=> {
    console.log("Attempt to connect to MongoDB completed."); 
})