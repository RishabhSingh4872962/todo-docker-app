import { NextFunction, Request ,Response} from 'express';

const userRegister=(req:Request,res:Response,next:NextFunction)=>{
    const {firstName,lastName,email,password,phone}=req.body;
    res.status(201).send({success:true,msg:"user created successfully",user:req.body})
}


export {
    userRegister
}