import express from "express"
import { addTodos, deleteTodo, getTodos, updateTodos } from "../controllers/todo_controller.js";
import authMiddleware from "../middlewares/authMiddleWare.js";
import validate from "../middlewares/TodoValidationMiddleware.js";
import validateTodoQuery from "../middlewares/todoQueryValidator.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.get('/',authMiddleware,validateTodoQuery,getTodos);
router.post('/',authMiddleware,validate,addTodos);
router.put('/:id',authMiddleware,validateObjectId,validate,updateTodos);
router.delete('/:id',authMiddleware,validateObjectId,deleteTodo);

export default router;