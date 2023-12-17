import mongoose from "mongoose";
import { Schema } from "mongoose";

const locationsSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    seoInfo: {
        title: {
            type: String,
            required: false,
        },
        metaDesc: {
            type: String,
            required: false,
        }
    },
}, { timestamps: true });

locationsSchema.index({ name: 1 });

module.exports = mongoose.models.locations || mongoose.model('locations', locationsSchema);
