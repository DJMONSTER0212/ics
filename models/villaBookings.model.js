import mongoose from "mongoose";
import { Schema } from "mongoose";

const villaBookingsSchema = new Schema({
    src: {
        type: String,
        enum: ['website', 'panel', 'other'],
        default: 'panel',
    },
    srcDesc: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    villaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'villas',
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    checkedIn: {
        type: Date,
        required: false,
    },
    checkedOut: {
        type: Date,
        required: false,
    },
    mainGuestInfo: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    guests: {
        adults: {
            type: Number,
        },
        childs: {
            type: Number,
        },
        pets: {
            type: Number,
        },
    },
    appliedPricing: {
        basePrice: {
            type: Number
        },
        discountedPrice: {
            type: Number
        },
        extraGuestPrice: {
            type: Number
        },
        childPrice: {
            type: Number
        }
    },
    invoicePricing: {
        totalNights: {
            type: Number
        },
        perNightPrice: {
            type: Number,
        },
        discount: {
            totalPriceDiscount: {
                type: Number,
            },
            couponDiscount: {
                couponCode: {
                    type: String,
                },
                price: {
                    type: String,
                }
            },
        },
        taxes: {
            appliedTaxes: [{
                name: {
                    type: String
                },
                price: {
                    type: Number
                },
                appliedPrice: {
                    type: Number
                },
            }],
            totalTaxPrice: { // Tax is applied on discounted price
                type: Number,
            },
        },
        addons: {
            appliedAddons: [{
                addonId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'addons',
                },
                name: {
                    type: String
                },
                price: {
                    type: Number
                }
            }],
            totalAddonPrice: {
                type: Number,
            },
        },
        directDiscount: {
            type: Number,
        },
        appliedMinimumPrice: {
            minimumPriceToBook: {
                type: Number
            },
            setBy: {
                type: String
            }
        },
        priceToBePaid: {
            minimum: {
                type: Number,
            },
            full: {
                type: Number,
            },
        },
    },
    updateNote: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
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
            }]
        },
    },
    trash: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.models.villabookings || mongoose.model('villabookings', villaBookingsSchema);