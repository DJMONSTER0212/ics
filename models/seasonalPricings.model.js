import mongoose from "mongoose";
import { Schema } from "mongoose";

const seasonalPricingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: false
    },
    extraGuestPrice: {
        type: Number,
        required: false
    },
    childPrice: {
        type: Number,
        required: false,
    },
    rangeType: {
        type: String,
        enum: ['date', 'day'],
        required: false
    },
    date: {
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }
    },
    day: {
        type: String,
        default: 'sunday',
        enum: [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thrusday',
            'friday',
            'saturday',
        ],
        required: false,
    },
    villaId: {
        type: Schema.Types.ObjectId,
        ref: 'villas',
        required: true
    },
    trash: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });

seasonalPricingSchema.index({ name: 1 });

module.exports = mongoose.models.seasonalPricings || mongoose.model('seasonalPricings', seasonalPricingSchema);