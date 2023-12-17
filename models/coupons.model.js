import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const couponsSchema = new Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    shortDesc: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: [
            'regular',
            'userOnly',
        ],
        required: true,
    },
    validOn: {
        type: String,
        enum: [
            'all',
            'villa',
            'hotel',
        ],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false,
    },
    villaId: {
        type: Schema.Types.ObjectId,
        ref: 'villas',
        required: false,
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: 'hotels',
        required: false,
    },
    priceType: {
        type: String,
        enum: [
            'flat',
            'upto',
        ],
        required: true,
    },
    priceIn: {
        type: String,
        enum: [
            'percentage',
            'price',
        ],
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number,
        required: false
    },
    maxUses: {
        type: Number,
        required: true,
        default: 1
    },
    allowMultipleUses: {
        type: Boolean,
        default: false,
        required: true
    },
    usedByUsers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    expirationDate: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    makePublic: {
        type: Boolean,
        default: false
    },
    trash: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.models.coupons || mongoose.model('coupons', couponsSchema);
