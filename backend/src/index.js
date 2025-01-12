import { app } from "./app.js";
import mongoDbConnection from "./db/dbConnection.js";


mongoDbConnection()
.then(()=>{
    const port = process.env.PORT || 6000;
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