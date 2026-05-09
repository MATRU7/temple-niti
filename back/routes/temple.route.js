import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateTemple } from '../middleware/validate.middleware.js';
import { addTemple, allTemple, getTempleById, updateTemple, deleteTemple } from './../controllers/temple.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Multer config with file type + size validation ────────────────────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB for temple images

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `temple-${uniqueSuffix}${ext}`);
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

router.post("/", authMiddleware, upload.single('templeImage'), addTemple);
router.get("/", allTemple);
router.get("/:id", getTempleById);
router.put("/:id", authMiddleware, upload.single('templeImage'), updateTemple);
router.delete("/:id", authMiddleware, deleteTemple);

export default router;