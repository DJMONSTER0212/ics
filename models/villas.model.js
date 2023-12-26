import mongoose from "mongoose";
import { Schema } from "mongoose";

const villasSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: false,
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
    googleMapsLink: {
        type: String,
        required: false,
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: 'locations',
        required: true,
    },
    basePrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: false
    },
    minGuest: {
        type: Number,
        required: true
    },
    maxGuest: {
        type: Number,
        required: true
    },
    extraGuestPrice: {
        type: Number,
        required: false
    },
    maxChild: {
        type: Number,
        required: false,
    },
    childPrice: {
        type: Number,
        required: false,
    },
    petAllowed: {
        type: Boolean,
        required: true,
        default: false
    },
    villaDetails: [{ type: String, required: true, default: [] }], // 3 Rooms, 1 Bedroom, 1 Kitchen
    amenities: [{ type: Schema.Types.ObjectId, ref: 'amenities', required: true, default: [] }],
    icalLinks: [{ type: String, required: true, default: [] }],
    icsContents : [{type : String, required: true ,default: []}],
    hostInfo: {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
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
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    reviewsAllowed: {
        type: Boolean,
        default: true,
        required: true,
    },
    minimumPriceToBook: {
        type: Number,
        default: 100,
        required: true,
    },
    cancellation: {
        allowCancellation: {
            type: Boolean,
            default: false,
            required: true,
        },
        cancellationRules: {
            type: [{
                daysBeforeCheckIn: {
                    type: Number,
                },
                refundablePrice: {
                    type: Number,
                }
            }],
            default: [{
                daysBeforeCheckIn: 3,
                refundablePrice: 12
            }]
        },
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
        }
    },
    promotion: {
        bestRated: {
            type: Boolean,
            required: false,
        },
        new: {
            type: Boolean,
            required: false,
        }
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
    trash: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });

villasSchema.index({ name: 1 });

module.exports = mongoose.models.villas || mongoose.model('villas', villasSchema);
