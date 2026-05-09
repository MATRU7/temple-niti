import mongoose from "mongoose";
import Niti from "../models/nitti.model.js";
import Temple from "../models/temple.model.js";

async function verifyTempleAdmin(templeId, userId) {
    if (!mongoose.Types.ObjectId.isValid(templeId)) {
        throw new Error("Invalid Temple ID");
    }
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new Error("Temple not found");
    }
    if (temple.user.toString() !== userId.toString()) {
        throw new Error("Not authorized for this temple");
    }
    return true;
}

async function addNitti(req, res) {
    try {
        console.log("Add Niti Request Body:", req.body);
        console.log("Add Niti File:", req.file);
        
        let newNitti = req.body;
        
        // Verify Temple exists
        const temple = await Temple.findById(newNitti.mandir);
        if (!temple) {
            console.log("Temple not found for ID:", newNitti.mandir);
            return res.status(404).send({ message: "Temple not found" });
        }

        newNitti.updatedBy = req.user._id;
        if (req.file) {
            newNitti.nitiImage = req.file.filename;
        }
        newNitti = await Niti.create(newNitti);
        console.log("Niti created successfully");
        
        if (newNitti.nitiImage) {
            newNitti = newNitti.toObject();
            newNitti.nitiImage = "http://localhost:5000/uploads/" + newNitti.nitiImage;
        }
        res.status(201).send(newNitti);
    } catch (error) {
        console.error("Add Niti Error:", error);
        res.status(403).send({ "message": "Could not add Niti", "error": error.message });
    }
}

async function getNitisByTemple(req, res) {
    try {
        const { templeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(templeId)) {
            return res.status(400).send({ message: "Invalid Temple ID" });
        }

        let nitis = await Niti.find({ mandir: templeId }).sort({ startTime: 1 });
        nitis = nitis.map(n => {
            const obj = n.toObject();
            if (obj.nitiImage) obj.nitiImage = "http://localhost:5000/uploads/" + obj.nitiImage;
            return obj;
        });
        res.send(nitis);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Nitis not fetched",
            error: error.message
        });
    }
}

async function getAllNitis(req, res) {
    try {
        const nitis = await Niti.find().sort({ startTime: 1 });
        res.send(nitis);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "All Nitis not fetched",
            error: error.message
        });
    }
}

async function updateNiti(req, res) {
    try {
        let { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Niti ID" });
        }
        
        let existingNiti = await Niti.findById(id);
        if(!existingNiti) return res.status(404).send({ message: "Niti not found" });
        
        const temple = await Temple.findById(existingNiti.mandir);
        
        // Authorization: 
        // 1. Temple Owner (always authorized)
        // 2. Niti Uploader (authorized if they are the one who created it)
        const isTempleOwner = temple && temple.user && temple.user.toString() === req.user._id.toString();
        const isUploader = existingNiti.updatedBy && existingNiti.updatedBy.toString() === req.user._id.toString();

        if (!isTempleOwner && !isUploader) {
            console.log("Authorization Failed: User", req.user._id, "is neither Temple Owner", temple?.user, "nor Niti Uploader", existingNiti.updatedBy);
            return res.status(403).send({ message: "Not authorized to update this Niti" });
        }

        let updatedNiti = req.body;
        // Update 'updatedBy' to the person who is making these changes
        updatedNiti.updatedBy = req.user._id;
        
        // Keep old image if no new one uploaded
        if (req.file) {
            updatedNiti.nitiImage = req.file.filename;
        } else {
            updatedNiti.nitiImage = existingNiti.nitiImage;
        }
        
        updatedNiti = await Niti.findOneAndUpdate({ _id: id }, updatedNiti, { returnDocument: "after", new: true });

        if (!updatedNiti) {
            return res.status(404).send({ message: "Niti not UPDATED" });
        }
        
        const result = updatedNiti.toObject();
        if (result.nitiImage) result.nitiImage = "http://localhost:5000/uploads/" + result.nitiImage;

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(403).send({
            message: "Niti not updated",
            error: error.message
        });
    }
}

async function deleteNiti(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Niti ID" });
        }

        let existingNiti = await Niti.findById(id);
        if(!existingNiti) return res.status(404).send({ message: "Niti not found" });
        
        const temple = await Temple.findById(existingNiti.mandir);
        
        // Authorization: Temple Owner OR Niti Uploader
        const isTempleOwner = temple && temple.user && temple.user.toString() === req.user._id.toString();
        const isUploader = existingNiti.updatedBy && existingNiti.updatedBy.toString() === req.user._id.toString();

        if (!isTempleOwner && !isUploader) {
            console.log("Authorization Failed (Delete): User", req.user._id, "is neither Temple Owner nor Niti Uploader");
            return res.status(403).send({ message: "Not authorized to delete this Niti" });
        }

        await Niti.findByIdAndDelete(id);

        res.send({ message: "Niti deleted" });
    } catch (error) {
        console.log(error);
        res.status(403).send({
            message: "Niti not deleted",
            error: error.message
        });
    }
}

export {
    addNitti,
    getNitisByTemple, 
    getAllNitis,
    updateNiti, 
    deleteNiti
}