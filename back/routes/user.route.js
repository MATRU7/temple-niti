import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { loginLimiter, signupLimiter } from "../middleware/rateLimiter.middleware.js";
import { validateRegister, validateLogin } from "../middleware/validate.middleware.js";

import {
    addUser,
    allUsers,
    deleteUser,
    getUserById,
    updateUser,
    loginUser,
    logout,
    getCurrentUser
} from "./../controllers/user.controller.js";

let router = express.Router();

// Auth routes
router.post("/", signupLimiter, validateRegister, addUser);
router.post("/login", loginLimiter, validateLogin, loginUser);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getCurrentUser);

// User management (require auth for all)
router.get("/", authMiddleware, allUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;