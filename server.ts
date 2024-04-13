import app from "./src/app";
import { config } from "./src/config/config";




function runServer(){
    const port=config.port;
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
        
    })
}

runServer();

