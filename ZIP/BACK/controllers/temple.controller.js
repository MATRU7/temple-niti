import Temple from "../models/temple.model.js"

async function addTemple(req,res){
    try{
        let newTemple = req.body
        newTemple.templeImage = req.file.filename
        newTemple.user = req.user._id; // Set user to logged in admin
        newTemple = await Temple.create(newTemple)
        res.send(newTemple)
    } catch(error){
        console.log(error)
        res.status(400).send({"message": "Event not added", "error": error.message})
    }
}

async function allTemple(req, res){
    try {
        let temple = await Temple.find().populate("user", "-password")
        temple.forEach( e => e.templeImage = "http://localhost:5000/uploads/"+e.templeImage)
        res.send(temple)
    } catch (error) {
        console.log(error)
        res.status(400).send({"message": "Temple not found", "error": error.message})
    }
}

async function updateTemple(req,res){
    try{
        let {id} = req.params
        let updatedDetails = req.body
        
        let temple = await Temple.findById(id);
        if(!temple) return res.status(404).send({"message": "Temple not found"})
        if(temple.user && temple.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({"message": "Not authorized to modify this temple."})
        }

        if(req.file) {
            updatedDetails.templeImage = req.file.filename;
        } else {
            delete updatedDetails.templeImage;
        }

        updatedDetails = await Temple.findOneAndUpdate({_id:id},updatedDetails,{returnDocument:"after"})
        if(updatedDetails!==null){
            res.status(200).send(updatedDetails)
        }
        else{
            res.status(400).send({"message":"Temple details not updated"})
        }

    } catch(error){
        console.log(error)
        res.status(400).send({"message":"Temple details not updated","error": error.message})
    }
}

async function deleteTemple(req,res){
    try{
        let {id} = req.params

        let temple = await Temple.findById(id);
        if(!temple) return res.status(404).send({"message": "Temple not found"})
        if(temple.user && temple.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({"message": "Not authorized to delete this temple."})
        }

        await Temple.findOneAndDelete({_id: id})
        res.send({"message": "Temple Deleted"})
    }catch(error){
        console.log(error)
        res.status(400).send({"message": "Temple not Deleted", "error": error.message})
    }
}



export{
    addTemple,allTemple,updateTemple,deleteTemple
}