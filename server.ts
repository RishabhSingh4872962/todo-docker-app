import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";




function runServer(){
    const port=config.port;
    app.listen(port,async()=>{
        console.log(`Server is running on port ${port}`);
     await connectDB()
      
      
    })
}

runServer();

