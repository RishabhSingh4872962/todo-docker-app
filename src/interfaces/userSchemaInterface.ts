import mongoose from "mongoose";


export interface IUser{
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    password: string;
    resetToken?: string;
    resetTokenExpired?: string;
    userChats?: Array<mongoose.Schema.Types.ObjectId>;
    comparePassword?:(password:string)=>Boolean
}