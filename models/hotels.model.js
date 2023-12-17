import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const hotelsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    images: [{
        type: String,
        required: false,
        default: [
            "/panel/images/newProperty.webp"
        ]
    }],
    address: {
        type: String,
        required: true,
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'locations',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    hostInfo: {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
    },
    bookingAllowed: {
        type: Boolean,
        required: true,
        default: false
    },
    block: {
        type: Boolean,
        default: false,
        required: false,
    },
    verification: {
        submitForVerification: {
            type: Boolean,
            required: false,
            default: false
        },
        verificationDocument: {
            type: String,
            required: false
        },
        verificationFailReason: {
            type: String,
            required: false
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        },
        verifiedDate: {
            type: Date,
            required: false,
        },
    }
}, { timestamps: true });

hotelsSchema.index({ name: 1, location: '2dsphere' });

module.exports = mongoose.models.hotels || mongoose.model('hotels', hotelsSchema);
