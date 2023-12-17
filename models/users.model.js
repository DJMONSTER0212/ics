import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
    },
    dob: {
        type: Date,
        required: false,
    },
    anniversary: {
        type: Date,
        required: false,
    },
    image: {
        type: String,
        default: '/panel/images/newUser.webp',
        required: false,
    },
    block: {
        type: Boolean,
        default: false,
        required: false,
    },
    verified: {
        type: Boolean,
        default: false,
        required: false,
    },
    otp: {
        type: String,
        required: false,
    },
    verificationCode: {
        type: String,
        required: false,
    },
    expirationTime: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: [
            'tnit',
            'admin',
            'support_admin',
            'vendor',
            'support_vendor',
            'manager_vendor',
            'user',
        ],
        required: true,
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return ['support_vendor', 'manager_vendor'].includes(this.role);
        },
    }
}, { timestamps: true });


userSchema.index({ name: 1 });

module.exports = mongoose.models.users || mongoose.model('users', userSchema);
