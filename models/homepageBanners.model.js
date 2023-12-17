import mongoose from "mongoose";
import { Schema } from "mongoose";

const homepageBannerSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    ctaUrl: {
        type: String,
        required: false
    },
    ctaName: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.models.homepageBanners || mongoose.model('homepageBanners', homepageBannerSchema);
