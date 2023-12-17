import mongoose from "mongoose";
import { Schema } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    bookingId: {
        type: String,
    },
    message: {
        type: String,
    },
    replied: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


contactSchema.index({ name: 1 });

module.exports = mongoose.models.contacts || mongoose.model('contacts', contactSchema);
