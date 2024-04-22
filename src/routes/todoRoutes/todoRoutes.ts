import  express  from 'express';
import { asyncErrorHandler } from '../../Errors/aysncErrorHandler';
import { createTodo, getTodo,getAllTodo, updateTodo, deleteTodo } from '../../controllers/todos/todosControllers';
import { isUserAuthenticated } from '../../middlewares/isUserAuthenticated';

const todoRoute=express.Router();


todoRoute.post("/create",asyncErrorHandler(createTodo))
todoRoute.get("/todo/:id",asyncErrorHandler(getTodo))
todoRoute.get("/todos",asyncErrorHandler(getAllTodo))
todoRoute.put("/edit/:id",asyncErrorHandler(updateTodo))
todoRoute.delete("/delete/:id",asyncErrorHandler(deleteTodo))

export default todoRoute
