import mongoose from "mongoose";


export interface IUser {
    _id?:mongoose.Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    password: string;
    resetToken?: string;
    resetTokenExpired?: Number;
    userChats?: Array<mongoose.Schema.Types.ObjectId>;
    comparePassword?:(password:string)=>Boolean;
}

export type userPayload={ id: mongoose.Schema.Types.ObjectId }
