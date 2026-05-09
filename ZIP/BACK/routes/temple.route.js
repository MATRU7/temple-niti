import express from 'express'

import {
    addTemple,allTemple,updateTemple,deleteTemple
} from "./../controllers/temple.controller.js"
import upload from '../middleware/fileUpload.middleware.js'

import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/", authMiddleware, upload.single("templeImage"), addTemple)
router.get("/", allTemple)
router.put("/:id", authMiddleware, upload.single("templeImage"), updateTemple)
router.delete("/:id", authMiddleware, deleteTemple)

export default router