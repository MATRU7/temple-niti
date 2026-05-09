import Temple from "../models/temple.model.js";
import Niti from "../models/nitti.model.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

function buildImageUrl(filename) {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return `${BASE_URL}/uploads/${filename}`;
}

// ── Add Temple ────────────────────────────────────────────────────────────────
async function addTemple(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Temple image is required." });
        }

        const templeData = {
            ...req.body,
            templeImage: req.file.filename,
            user: req.user._id
        };

        const newTemple = await Temple.create(templeData);
        const result = newTemple.toObject();
        result.templeImage = buildImageUrl(result.templeImage);

        res.status(201).json({ success: true, message: "Temple added successfully.", temple: result });
    } catch (error) {
        next(error);
    }
}

// ── Get All Temples ───────────────────────────────────────────────────────────
async function allTemple(req, res, next) {
    try {
        const { state, city, status, search } = req.query;
        let query = { isActive: true };

        if (state) query.state = new RegExp(state, 'i');
        if (city) query.city = new RegExp(city, 'i');
        if (status) query.status = status;
        if (search) query.$text = { $search: search };

        const temples = await Temple.find(query)
            .populate("user", "-password -refreshToken")
            .sort({ createdAt: -1 });

        const result = temples.map(t => {
            const obj = t.toObject();
            obj.templeImage = buildImageUrl(obj.templeImage);
            return obj;
        });

        res.json({ success: true, count: result.length, temples: result });
    } catch (error) {
        next(error);
    }
}

// ── Get Single Temple ─────────────────────────────────────────────────────────
async function getTempleById(req, res, next) {
    try {
        const { id } = req.params;
        const temple = await Temple.findOne({ _id: id, isActive: true })
            .populate("user", "-password -refreshToken");

        if (!temple) {
            return res.status(404).json({ success: false, message: "Temple not found." });
        }

        const result = temple.toObject();
        result.templeImage = buildImageUrl(result.templeImage);
        res.json({ success: true, temple: result });
    } catch (error) {
        next(error);
    }
}

// ── Update Temple ─────────────────────────────────────────────────────────────
async function updateTemple(req, res, next) {
    try {
        const { id } = req.params;

        const temple = await Temple.findOne({ _id: id, isActive: true });
        if (!temple) {
            return res.status(404).json({ success: false, message: "Temple not found." });
        }
        if (temple.user?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this temple." });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.templeImage = req.file.filename;
        } else {
            delete updateData.templeImage;
        }

        const updated = await Temple.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).populate("user", "-password -refreshToken");

        const result = updated.toObject();
        result.templeImage = buildImageUrl(result.templeImage);

        res.json({ success: true, message: "Temple updated successfully.", temple: result });
    } catch (error) {
        next(error);
    }
}

// ── Delete Temple (Soft Delete) ───────────────────────────────────────────────
async function deleteTemple(req, res, next) {
    try {
        const { id } = req.params;

        const temple = await Temple.findOne({ _id: id, isActive: true });
        if (!temple) {
            return res.status(404).json({ success: false, message: "Temple not found." });
        }
        if (temple.user?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this temple." });
        }

        // Soft-delete temple and all its nitis
        await Promise.all([
            Temple.findByIdAndUpdate(id, { isActive: false }),
            Niti.updateMany({ mandir: id }, { isActive: false })
        ]);

        res.json({ success: true, message: "Temple and all associated Nitis deleted successfully." });
    } catch (error) {
        next(error);
    }
}

export { addTemple, allTemple, getTempleById, updateTemple, deleteTemple };