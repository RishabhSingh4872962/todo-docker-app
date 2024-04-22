import { NextFunction, Request, Response } from "express";
import { Todo } from "../../models/todoModel/todo.model";
import { I_CustomRequest } from "../../middlewares/isUserAuthenticated";

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    complete = false,
    description,
  }: { name: string; complete: boolean; description: string } = req.body;

  let user_id = (req as I_CustomRequest).user;
  const todo = new Todo({
    name,
    complete,
    description,
    userId: user_id.id,
  });

  await todo.save();
  return res
    .status(201)
    .send({ success: true, msg: "todo created successfully", todo });
};

const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let user_id = (req as I_CustomRequest).user;
  const todo = await Todo.findOne({
    $and: [{ _id: id }, { userId: user_id.id }],
  });

  if (!todo) {
    return res
      .status(200)
      .send({ success: false, msg: "todo not found with this id" });
  }

  return res.status(200).send({ success: true, todo });
};
const getAllTodo = async (req: Request, res: Response, next: NextFunction) => {
  let user_id = (req as I_CustomRequest).user;
  const todos = await Todo.find({ userId: user_id.id });

  if (!todos) {
    return res.status(200).send({ success: false, msg: "not found any todo" });
  }

  return res.status(200).send({ success: true, length: todos.length, todos });
};
const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    complete,
    description,
  }: { name: string; complete: boolean; description: string } = req.body;
  const { id } = req.params;

  let user_id = (req as I_CustomRequest).user;

  const todo = await Todo.findOneAndUpdate(
    { $and: [{ _id: id }, { userId: user_id.id }] },
    {
      name,
      complete,
      description,
    },
    { runValidators: true }
  );

  if (!todo) {
    return res
      .send(200)
      .send({ success: false, msg: "todo not found with this id" });
  }

  return res.status(200).send({ success: true, todo });
};
const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let user_id = (req as I_CustomRequest).user;

  const todo = await Todo.findOne({
    $and: [{ _id: id }, { userId: user_id.id }],
  });
  if (!todo) {
    return res
      .send(200)
      .send({ success: false, msg: "todo not found with this id" });
  }

  await todo.remove();
  return res
    .status(200)
    .send({ success: true, msg: "todo delete succesfully" });
};

export { createTodo, getAllTodo, getTodo, updateTodo, deleteTodo };
