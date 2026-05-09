import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateNiti } from '../middleware/validate.middleware.js';
import { addNitti, getNitisByTemple, getAllNitis, updateNiti, deleteNiti } from './../controllers/nitti.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Multer config with file type + size validation ────────────────────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `niti-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

const router = express.Router();

router.post("/", authMiddleware, upload.single('nitiImage'), validateNiti, addNitti);
router.get("/", getAllNitis);
router.get("/temple/:templeId", getNitisByTemple);
router.put("/:id", authMiddleware, upload.single('nitiImage'), validateNiti, updateNiti);
router.delete("/:id", authMiddleware, deleteNiti);

export default router;