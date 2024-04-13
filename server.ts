import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";




async function runServer(){
    const port=config.port;
    await connectDB()
      
    app.listen(port,async()=>{
        console.log(`Server is running on port ${port}`);
    
      
    })
}

runServer();

