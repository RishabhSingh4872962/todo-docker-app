import mongoose from "mongoose";
import { config } from "./config";


mongoose.set("strictQuery",false)

const connectDB=async()=>{
   try {

    mongoose.connection.on("connected",()=>{
        console.log("Db Connected");
       })
    
    
       mongoose.connection.on("error",function(){
        console.log("Db connection Error");
        
       })
   await mongoose.connect(config.mongo_url as string)

  
   } catch (error) {
    console.error("Database not connected",error)
    process.exit(1)
   }
}

export default connectDB;