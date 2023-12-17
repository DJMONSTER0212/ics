import mongoose from "mongoose";
import { Schema } from "mongoose";

const amenitiesSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

amenitiesSchema.index({ name: 1 });

module.exports = mongoose.models.amenities || mongoose.model('amenities', amenitiesSchema);
