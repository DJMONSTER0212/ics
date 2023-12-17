import mongoose from "mongoose";
import { Schema } from "mongoose";


const settingSchema = new Schema({
    website: {
        name: {
            type: String,
            default: 'TNIT Hotel Management System',
        },
        companyName: {
            type: String,
            default: 'TNIT',
        },
        lightLogo: {
            type: String,
            default: '/panel/images/logoLight.png',
        },
        emailLogo: {
            type: String,
            default: '/panel/images/logoLight.png',
        },
        darkLogo: {
            type: String,
            default: '/panel/images/logoDark.png'
        },
        fevicon: {
            type: String,
            default: '/panel/images/favicon.png'
        },
        currencySymbol: {
            type: String,
            enum: ['₹', '$'],
            default: '₹'
        },
        info: {
            inquiryMail: {
                type: String,
                default: 'support@tnitservices.com',
                required: true
            },
            inquiryPhone: {
                type: String,
                default: '+918652290747',
                required: true
            },
            inquiryPhone2: {
                type: String,
                default: '+918652290747',
            },
            whatsappPhone: {
                type: String,
                default: '+918652290747',
            },
            address: {
                type: String,
                default: 'G-141, B Wing, Express Zone, Western Express Highway, Goregaon East, Mumbai - 400063',
            },
            footerPara: {
                type: String,
                default: 'A hotel/villa management system with advanced features like multiple vendors, cancellation, seasonal pricing, payment and more!',
            },
        },
        social: {
            facebook: {
                type: String,
            },
            instagram: {
                type: String,
            },
            x: {
                type: String,
            },
            peerlist: {
                type: String,
            },
            linkedin: {
                type: String,
            },
            youtube: {
                type: String,
            },
            google: {
                type: String,
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
            },
        },
    },
    policy: {
        refundPolicy: {
            type: String,
        },
        privacyPolicy: {
            type: String,
        },
        TermAndConditions: {
            type: String,
        },
    },
    login: {
        otpMailTemplate: {
            type: Number,
            default: 1,
        },
        linkMailTemplate: {
            type: Number,
            default: 1,
        },
        verificationMethod: {
            type: String,
            default: 'otp',
            enum: [
                'otp',
                'link',
            ],
            required: true,
        },
    },
    tnit: {
        limitMaxVillas: {
            type: Boolean,
            default: false,
            required: true,
        },
        maxVillas: {
            type: Number,
            default: 5,
            required: function () { return this.limitMaxVillas },
        },
        limitMaxHotels: {
            type: Boolean,
            default: false,
            required: true,
        },
        maxHotels: {
            type: Number,
            default: 5,
            required: function () { return this.limitMaxHotels },
        },
        multiVendorAllowed: {
            type: Boolean,
            default: false,
            required: true,
        },
        limitMaxVendors: {
            type: Boolean,
            default: false,
            required: true,
        },
        maxVendors: {
            type: Number,
            default: 5,
            required: function () { return this.limitMaxVendors },
        },
        activateWebsite: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    admin: {
        property: {
            autoVerifyVilla: {
                type: Boolean,
                default: true,
                required: true,
            },
            autoVerifyHotel: {
                type: Boolean,
                default: true,
                required: true,
            },
            letOwnerManageReviews: {
                type: Boolean,
                default: true,
                required: true,
            },
            reviewsAllowed: {
                type: Boolean,
                default: true,
                required: true,
            }
        },
        booking: {
            enableBookingsVilla: {
                type: Boolean,
                default: true,
                required: true,
            },
            enableBookingsHotel: {
                type: Boolean,
                default: true,
                required: true,
            },
            letOwnerManageMinimumPriceToBook: {
                type: Boolean,
                default: true,
                required: true,
            },
            minimumPriceToBook: {
                type: Number,
                default: 100,
                required: true,
            },
            checkInTime: {
                type: String,
                default: '02:00 PM',
                required: true,
            },
            checkOutTime: {
                type: String,
                default: '11:00 AM',
                required: true,
            },
        },
        payout: {
            enablePayout: {
                type: Boolean,
                default: true,
                required: true,
            },
            payoutDay: {
                type: String,
                default: 'monday',
                enum: [
                    'sunday',
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thrusday',
                    'friday',
                    'saturday',
                ],
                required: true,
            },
            applyTds: {
                type: Boolean,
                default: false,
                required: true,
            },
            tdsPrice: {
                type: String,
                default: '2.5',
                required: true,
            },
            applyCommission: {
                type: Boolean,
                default: true,
                required: true,
            },
            commissionPrice: {
                type: String,
                default: '2.5',
                required: true,
            }
        },
        cancellation: {
            letOwnerManageCancellation: {
                type: Boolean,
                default: true,
                required: true,
            },
            allowCancellation: {
                type: Boolean,
                default: false,
                required: true,
            },
            cancellationRules: {
                type: [{
                    daysBeforeCheckIn: {
                        type: Number,
                        required: true
                    },
                    refundablePrice: {
                        type: Number,
                        required: true
                    }
                }],
                default: [{
                    daysBeforeCheckIn: 3,
                    refundablePrice: 12
                }]
            },
        },
        gateway: {
            currencyCode: {
                type: String,
                enum: ['INR', 'EUR'],
                default: 'INR',
                required: true,
            },
            gatewayName: {
                type: String,
                enum: ['razorpay'],
                default: 'razorpay',
                required: true,
            },
            publicApiKey: {
                type: String,
                required: false,
            },
            privateApiKey: {
                type: String,
                required: false,
            },
        },
        tax: {
            GSTNo: {
                type: String,
                required: false,
            },
            GSTState: {
                type: String,
                required: false,
            },
        }
    }
}, { timestamps: true });

module.exports = mongoose.models.settings || mongoose.model('settings', settingSchema);
