import express,{Express} from "express"


const app:Express=express();



app.get("/",async (req,res,next)=>{
    res.status(200).send({sucess:true})
})


export default app;