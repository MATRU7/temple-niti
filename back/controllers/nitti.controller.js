import mongoose from "mongoose";
import Niti from "../models/nitti.model.js";
import Temple from "../models/temple.model.js";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ── Helper: build full image URL ──────────────────────────────────────────────
function buildImageUrl(filename) {
    if (!filename) return null;
    // If already a full URL, return as-is
    if (filename.startsWith('http')) return filename;
    return `${BASE_URL}/uploads/${filename}`;
}

// ── Helper: serialize niti with full image URL ────────────────────────────────
function serializeNiti(niti) {
    const obj = niti.toObject ? niti.toObject() : { ...niti };
    if (obj.nitiImage) obj.nitiImage = buildImageUrl(obj.nitiImage);
    return obj;
}

// ── Add Niti ──────────────────────────────────────────────────────────────────
async function addNitti(req, res, next) {
    try {
        const body = req.body;

        if (!mongoose.Types.ObjectId.isValid(body.mandir)) {
            return res.status(400).json({ success: false, message: "Invalid Temple ID." });
        }

        const temple = await Temple.findOne({ _id: body.mandir, isActive: true });
        if (!temple) {
            return res.status(404).json({ success: false, message: "Temple not found." });
        }

        const nitiData = {
            mandir: body.mandir,
            currentNiti: body.currentNiti,
            nextNiti: body.nextNiti,
            status: body.status,
            startTime: body.startTime,
            endTime: body.endTime || null,
            nextNitiTime: body.nextNitiTime || null,
            description: body.description || null,
            updatedBy: req.user._id,
        };

        if (req.file) {
            nitiData.nitiImage = req.file.filename;
        }

        const newNiti = await Niti.create(nitiData);
        const populated = await Niti.findById(newNiti._id).populate('updatedBy', 'name email');

        res.status(201).json({ success: true, message: "Niti added successfully.", niti: serializeNiti(populated) });
    } catch (error) {
        next(error);
    }
}

// ── Get Nitis by Temple ───────────────────────────────────────────────────────
async function getNitisByTemple(req, res, next) {
    try {
        const { templeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(templeId)) {
            return res.status(400).json({ success: false, message: "Invalid Temple ID." });
        }

        const nitis = await Niti.find({ mandir: templeId, isActive: true })
            .sort({ startTime: 1 })
            .populate('updatedBy', 'name email');

        res.json({ success: true, count: nitis.length, nitis: nitis.map(serializeNiti) });
    } catch (error) {
        next(error);
    }
}

// ── Get All Nitis ─────────────────────────────────────────────────────────────
async function getAllNitis(req, res, next) {
    try {
        const nitis = await Niti.find({ isActive: true })
            .sort({ startTime: 1 })
            .populate('mandir', 'name city')
            .populate('updatedBy', 'name email');

        res.json({ success: true, count: nitis.length, nitis: nitis.map(serializeNiti) });
    } catch (error) {
        next(error);
    }
}

// ── Update Niti ───────────────────────────────────────────────────────────────
async function updateNiti(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Niti ID." });
        }

        const existingNiti = await Niti.findOne({ _id: id, isActive: true });
        if (!existingNiti) {
            return res.status(404).json({ success: false, message: "Niti not found." });
        }

        const temple = await Temple.findById(existingNiti.mandir);
        const isTempleOwner = temple?.user?.toString() === req.user._id.toString();
        const isUploader = existingNiti.updatedBy?.toString() === req.user._id.toString();

        if (!isTempleOwner && !isUploader) {
            return res.status(403).json({ success: false, message: "Not authorized to update this Niti." });
        }

        const updateData = {
            currentNiti: req.body.currentNiti,
            nextNiti: req.body.nextNiti,
            status: req.body.status,
            startTime: req.body.startTime,
            endTime: req.body.endTime || null,
            nextNitiTime: req.body.nextNitiTime || null,
            description: req.body.description || null,
            updatedBy: req.user._id,
            nitiImage: req.file ? req.file.filename : existingNiti.nitiImage
        };

        const updated = await Niti.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('updatedBy', 'name email');

        res.json({ success: true, message: "Niti updated successfully.", niti: serializeNiti(updated) });
    } catch (error) {
        next(error);
    }
}

// ── Delete Niti (Soft Delete) ─────────────────────────────────────────────────
async function deleteNiti(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Niti ID." });
        }

        const existingNiti = await Niti.findOne({ _id: id, isActive: true });
        if (!existingNiti) {
            return res.status(404).json({ success: false, message: "Niti not found." });
        }

        const temple = await Temple.findById(existingNiti.mandir);
        const isTempleOwner = temple?.user?.toString() === req.user._id.toString();
        const isUploader = existingNiti.updatedBy?.toString() === req.user._id.toString();

        if (!isTempleOwner && !isUploader) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this Niti." });
        }

        await Niti.findByIdAndUpdate(id, { isActive: false });

        res.json({ success: true, message: "Niti deleted successfully." });
    } catch (error) {
        next(error);
    }
}

export { addNitti, getNitisByTemple, getAllNitis, updateNiti, deleteNiti };