import mongoose from 'mongoose';

const nitiSchema = new mongoose.Schema({
    mandir: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: [true, 'Temple reference is required'],
        index: true
    },
    currentNiti: {
        type: String,
        required: [true, 'Current Niti name is required'],
        trim: true,
        maxlength: [120, 'Name cannot exceed 120 characters']
    },
    nextNiti: {
        type: String,
        required: [true, 'Next Niti name is required'],
        trim: true,
        maxlength: [120, 'Name cannot exceed 120 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: null
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Darshan Available', 'Special Ritual'],
        required: [true, 'Status is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        default: null
    },
    nextNitiTime: {
        type: Date,
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    nitiImage: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Compound index for efficient querying by temple + time
nitiSchema.index({ mandir: 1, startTime: 1 });

const Niti = mongoose.model("Niti", nitiSchema);
export default Niti;