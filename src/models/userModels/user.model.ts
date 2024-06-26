import { IUser } from '../../interfaces/userSchemaInterface';
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "firstName can't be empty"],
      minlength: [4, "firstName can't be less than 4"],
      maxlength: [15, "firstName can't be less than 15"],
    },
    lastName: {
      type: String,
      required: [true, "lastName can't be empty"],
      minlength: [3, "lastName can't be less than 3"],
      maxlength: [10, "lastName can't be less than 10"],
    },
    email: {
      type: String,
      required: [true, "email can't be empty"],
      unique: true,
    },
    phone: {
      type: Number,
      required: [true, "phone number should be required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password can't be empty"],
      minlength: [6, "password can't be less than 6"],
      maxlength: [16, "password can't be less than 16"],
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpired: {
      type: Number,
      select: false,
    },
    userChats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        select:false
      },
    ],
  },
  {
    timestamps: true,
  }
).pre("save",async function (next) {
    let self = this;
    if (self.isModified("password")) {
      self.password = await bcrypt.hash(self.password, 10);
    }
    next();
})



userSchema.methods.comparePassword=function <P>(password:string) {
  
  return bcrypt.compare(password,this.password);
}


export const User = mongoose.model<IUser>("Users", userSchema);
