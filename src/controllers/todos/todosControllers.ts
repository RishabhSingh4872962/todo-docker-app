import { NextFunction, Request, Response } from "express";
import { Todo } from "../../models/todoModel/todo.model";
import { I_CustomRequest } from "../../middlewares/isUserAuthenticated";

/**
 * @swagger
 * /todo/create:
 *   post:
 *     summary: create the todo
 *     description: It will create the todo
 *     tags:
 *       - Todo 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               complete:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 todos:
 *                   type: object
 *                   properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the todo.
 *                       name:
 *                         type: string
 *                         description: The name of the todo.
 *                       complete:
 *                         type: boolean
 *                         description: Indicates whether the todo is complete or not.
 *                       description:
 *                         type: string
 *                         description: The description of the todo.
 *       400:
 *         description: No todos found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 msg:
 *                   type: string
 *                   description: Error message indicating no todos found.
 */

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

/**
 * @swagger
 * /todo/todo/{id}:
 *   get:
 *     summary: Get Todo
 *     description: get the todo with the user id
 *     tags:
 *       - Todo 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enter the todo id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the todo belonging to the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 todos:
 *                   type: object
 *                   properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the todo.
 *                       name:
 *                         type: string
 *                         description: The name of the todo.
 *                       complete:
 *                         type: boolean
 *                         description: Indicates whether the todo is complete or not.
 *                       description:
 *                         type: string
 *                         description: The description of the todo.
 *       400:
 *         description: No todos found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 msg:
 *                   type: string
 *                   description: Error message indicating no todos found.
 */

const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let user_id = (req as I_CustomRequest).user;
  const todo = await Todo.findOne({
    $and: [{ _id: id }, { userId: user_id.id }],
  });

  if (!todo) {
    return res
      .status(400)
      .send({ success: false, msg: "todo not found with this id" });
  }

  return res.status(200).send({ success: true, todo });
};
/**
 * @swagger
 * /todo/todos:
 *   get:
 *     summary: Get all todos for a user
 *     description: Retrieve all todos belonging to the authenticated user.
 *     tags:
 *       - Todo 
 *     responses:
 *       200:
 *         description: Returns the list of todos belonging to the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 length:
 *                   type: integer
 *                   description: The number of todos returned.
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the todo.
 *                       name:
 *                         type: string
 *                         description: The name of the todo.
 *                       complete:
 *                         type: boolean
 *                         description: Indicates whether the todo is complete or not.
 *                       description:
 *                         type: string
 *                         description: The description of the todo.
 *       400:
 *         description: No todos found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 msg:
 *                   type: string
 *                   description: Error message indicating no todos found.
 */

const getAllTodo = async (req: Request, res: Response, next: NextFunction) => {
  let user_id = (req as I_CustomRequest).user;
  const todos = await Todo.find({ userId: user_id.id });

  if (!todos) {
    return res
      .status(400)
      .send({ success: false, msg: "not found any todo,Make new Todo" });
  }

  return res.status(200).send({ success: true, length: todos.length, todos });
};

/**
 * @swagger
 * /todo/edit/{id}:
 *   put:
 *     summary: Edit the Todo
 *     description: Edit the todo with the given todo id
 *     tags:
 *       - Todo 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enter the todo id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               complete:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Todo not found with this id
 */

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
      .send(400)
      .send({ success: false, msg: "todo not found with this id" });
  }

  return res.status(200).send({ success: true, todo });
};

/**
 * @swagger
 * /todo/delete/{id}:
 *   delete:
 *     summary: Delete the Todo
 *     description: Delete the todo with the given todo id
 *     tags:
 *       - Todo 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enter the todo id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo Delete successfully
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Todo not found with this id
 */

const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let user_id = (req as I_CustomRequest).user;

  const todo = await Todo.findOneAndDelete({
    $and: [{ _id: id }, { userId: user_id.id }],
  });
  if (!todo) {
    return res
      .status(400)
      .send({ success: false, msg: "todo not found with this id" });
  }


 
  return res
    .status(200)
    .send({ success: true, msg: "todo delete succesfully" });
};

export { createTodo, getAllTodo, getTodo, updateTodo, deleteTodo };
