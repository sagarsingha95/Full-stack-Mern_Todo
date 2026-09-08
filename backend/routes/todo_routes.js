import express from "express"
import { addTodos, deleteTodo, getTodos, updateTodos } from "../controllers/todo_controller.js";
import authMiddleware from "../middlewares/authMiddleWare.js";
import validate from "../middlewares/TodoValidationMiddleware.js";
import validateTodoQuery from "../middlewares/todoQueryValidator.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

/**
 * @openapi
 * /todos:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get todos for the authenticated user
 *     description: Returns user-owned todos with pagination, search, filtering, and sorting.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 6
 *         description: Number of todos per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search todos by title
 *
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - all
 *             - pending
 *             - completed
 *           default: all
 *         description: Filter todos by completion status
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *             - az
 *             - za
 *             - priority
 *           default: newest
 *         description: Sort order for todos
 *
 *     responses:
 *       200:
 *         description: Todos fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                     totalTodos:
 *                       type: integer
 *                       example: 20
 *                     limit:
 *                       type: integer
 *                       example: 6
 *
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/',authMiddleware,validateTodoQuery,getTodos);
/**
 * @openapi
 * /todos:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Create a new todo
 *     description: Creates a todo owned by the authenticated user.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish Swagger documentation
 *
 *               description:
 *                 type: string
 *                 example: Document all production API endpoints.
 *
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: high
 *
 *               completed:
 *                 type: boolean
 *                 example: false
 *
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todo created successfully.
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *
 *       400:
 *         description: Invalid todo data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/',authMiddleware,validate,addTodos);
/**
 * @openapi
 * /todos/{id}:
 *   put:
 *     tags:
 *       - Todos
 *     summary: Update a todo
 *     description: Updates a todo owned by the authenticated user.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB todo ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish Swagger documentation
 *
 *               description:
 *                 type: string
 *                 example: Complete and review the API docs.
 *
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *
 *               completed:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todo updated successfully.
 *                 todo:
 *                   $ref: '#/components/schemas/Todo'
 *
 *       400:
 *         description: Invalid todo ID or request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id',authMiddleware,validateObjectId,validate,updateTodos);
/**
 * @openapi
 * /todos/{id}:
 *   delete:
 *     tags:
 *       - Todos
 *     summary: Delete a todo
 *     description: Deletes a todo owned by the authenticated user.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB todo ID
 *
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todo deleted successfully.
 *
 *       400:
 *         description: Invalid todo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id',authMiddleware,validateObjectId,deleteTodo);

export default router;