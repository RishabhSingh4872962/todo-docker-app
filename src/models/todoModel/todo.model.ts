
import mongoose from "mongoose";


const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "todoName can't be empty"],
      minlength: [3, "todoName can't be less than 3"],
      maxlength: [30, "todoName can't be less than 15"],
    },
    complete: {
      type: Boolean,
      default:false
    },
    description: {
      type: String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,select:false},
  },
  {
    timestamps: true,
  }
)


export const Todo = mongoose.model("Todo", todoSchema);
