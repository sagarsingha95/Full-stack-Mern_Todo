import express from "express";
import { loginUser, refreshToken, registerUser,logoutUser } from "../controllers/auth_controller.js";
import {validateRegister,validateLogin} from "../middlewares/authValidationMiddleware.js";
import { loginLimiter,refreshLimiter,registerLimiter } from "../middlewares/rateLimitMiddleware.js";


const router = express.Router();


router.post("/register",registerLimiter,validateRegister,registerUser);
router.post("/loginUser",loginLimiter,validateLogin,loginUser);
router.post("/refresh",refreshLimiter,refreshToken);
router.post("/logout", logoutUser);

export default router;