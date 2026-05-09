import express from 'express'
import {
    addNitti,getNitisByTemple,getAllNitis,updateNiti,deleteNiti
} from './../controllers/nitti.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

const router = express.Router()

router.post("/", authMiddleware, upload.single('nitiImage'), addNitti)
router.get("/", getAllNitis)
router.get("/temple/:templeId", getNitisByTemple)
router.put("/:id", authMiddleware, upload.single('nitiImage'), updateNiti)
router.delete("/:id", authMiddleware, deleteNiti)

export default router