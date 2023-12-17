import mongoose from "mongoose";
import { Schema } from "mongoose";

const taxesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        default: '2.5',
        required: true,
    },
    applyOnVillas: {
        type: Boolean,
        default: true,
        required: true,
    },
    applyOnHotels: {
        type: Boolean,
        default: true,
        required: true,
    },
}, { timestamps: true });

taxesSchema.index({ name: 1 });

module.exports = mongoose.models.taxes || mongoose.model('taxes', taxesSchema);
