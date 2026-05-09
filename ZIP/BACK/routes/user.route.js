import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
    addUser,
    allUsers,
    deleteUser,
    getUserById,
    updateUser,
    loginUser,
    logout,
    getCurrentUser
} from "./../controllers/user.controller.js"

let router = express.Router();

router.post("/", addUser)
router.post("/login", loginUser)
router.post("/logout", logout)
router.get("/me", authMiddleware, getCurrentUser)

router.get("/", allUsers)
router.get("/:id", getUserById)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)


export default router