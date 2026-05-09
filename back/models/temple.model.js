import mongoose from "mongoose";

let templeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Temple name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [120, 'Name cannot exceed 120 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        index: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'closed']
    },
    templeImage: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    website: {
        type: String,
        trim: true,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Indexes for location-based search
templeSchema.index({ state: 1, city: 1 });
templeSchema.index({ name: 'text', description: 'text' });

let Temple = mongoose.model("Temple", templeSchema);
export default Temple;