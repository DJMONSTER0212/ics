import mongoose from "mongoose";
import { Schema } from "mongoose";

const addonsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortDesc: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    villaId: {
        type: Schema.Types.ObjectId,
        ref: 'villas',
        required: true
    },
}, { timestamps: true });

addonsSchema.index({ name: 1 });

module.exports = mongoose.models.addons || mongoose.model('addons', addonsSchema);
