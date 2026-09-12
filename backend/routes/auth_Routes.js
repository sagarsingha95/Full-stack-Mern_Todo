import express from "express";
import { loginUser, refreshToken, registerUser,logoutUser } from "../controllers/auth_controller.js";
import {validateRegister,validateLogin} from "../middlewares/authValidationMiddleware.js";
import { loginLimiter,loginIpLimiter,refreshLimiter,registerLimiter } from "../middlewares/rateLimitMiddleware.js";


const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sagar Singha
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sagar@example.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Invalid registration data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/register",registerLimiter,validateRegister,registerUser);
/**
 * @openapi
 * /auth/loginUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and returns an access token. A refresh token is also stored in an HttpOnly cookie.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sagar@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/loginUser",loginIpLimiter,loginLimiter,validateLogin,loginUser);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Uses the HttpOnly refresh-token cookie to rotate the refresh token and issue a new access token.
 *
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token
 *
 *       401:
 *         description: Refresh token missing, invalid, expired, or revoked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/refresh",refreshLimiter,refreshToken);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Revokes the current refresh session and clears the refresh-token cookie.
 *
 *     responses:
 *       200:
 *         description: Logged out successfully
 *
 *       401:
 *         description: Refresh token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/logout", logoutUser);

export default router;