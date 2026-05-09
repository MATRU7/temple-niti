import mongoose from 'mongoose';

const nitiSchema = new mongoose.Schema({
    mandir:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Temple',
        required:true
    },
    currentNiti:{
        type:String,
        required:true
    },
    nextNiti:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Open','Closed','Darshan Available','Special Ritual'],
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    nitiImage:{
        type:String,
        default: null
    }
},{
    timestamps:true
})

const Niti = mongoose.model("Niti", nitiSchema);
export default Niti;