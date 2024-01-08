import mongoose from "mongoose";
import { Schema } from "mongoose";

const paymentsSchema = new Schema({
    type:{
        type: String,
        enum: ['normal', 'refund'],
    },
    src: {
        type: String,
        enum: ['razorpay', 'offline', 'upi', 'other','panel'],
    },
    srcDesc: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    paidFor: {
        type: String,
        enum: ['villa', 'hotel'],
    },
    villaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'villas',
    },
    villaBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'villabookings',
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels',
    },
    hotelBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotelbookings',
    },
    range: {
        type: String,
        enum: ['full', 'pre', 'post'],
    },
    price: {
        type: Number
    },
    advancePaid :{
        type : Number,
        default : 0
    },
    upi: {
        refNo: {
            type: String
        }
    },
    razorpay: {
        orderId: {
            type: String
        },
        paymentId: {
            type: String
        },
    },
    paymentDate: {
        type: Date
    },
    paymentNote: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending',
    },
    trash: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.models.payments || mongoose.model('payments', paymentsSchema);
