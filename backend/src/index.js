import { app } from "./app.js";
import dbConnection from "./db/dbConnection.js";

dbConnection()
.then(()=>{
    const port = process.env.PORT || 6000;
    app.listen(port, ()=>{
        console.log(`CONNECTED APPLICATION IS RUNNING AT PORT ${port}`);
    })
})
.catch((error) => {
    console.error("MONGODB CONNECTION ERROR !! ",error);
})