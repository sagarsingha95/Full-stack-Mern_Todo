import express from "express";

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from "../controllers/user_controller.js";

import authMiddleWare from "../middlewares/authMiddleWare.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get(
  "/profile",
  authMiddleWare,
  getProfile
);

router.post(
  "/profile/avatar",
  authMiddleWare,
  upload.single("avatar"),
  uploadProfilePicture
);

router.put(
  "/profile",
  authMiddleWare,
  updateProfile
);

export default router;