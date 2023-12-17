import formidable from 'formidable';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import couponsModel from "@/models/coupons.model";
import villaBookingsModel from "@/models/villaBookings.model";
import taxesModel from "@/models/taxes.model";
import settingsModel from "@/models/settings.model";
import paymentsModel from "@/models/payments.model";
import addonsModel from "@/models/addons.model";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]';

// Database 
connectDB()

// Disable next js body parser
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        // Checking for error in parsing
        if (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
        // API handling
        try {
            const session = await getServerSession(req, res, authOptions);
            // Logics
            if (req.method == 'POST') {
                try {
                    let { villaId, checkIn, checkOut, adults, childs, pets, coupon, paymentType, name, email, phone } = fields;
                    let addons = [];
                    if (fields.addons) {
                        addons = await JSON.parse(fields.addons);
                    }
                    if (!name || !email || !phone) {
                        return res.status(500).json({ error: 'Please enter communication details.' });
                    }
                    // Fetch settings >>>>>>>>>>>>>>
                    let settings;
                    try {
                        settings = await settingsModel.findOne({}).lean();
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                    // Setting pipeline to fetch villa >>>>>>>>>>>>>>>>>
                    const pipeline = [
                        {
                            $match: {
                                _id: mongoose.Types.ObjectId(villaId),
                                'verification.verified': true,
                                block: false,
                                bookingAllowed: true,
                                trash: { $ne: true }
                            }
                        },
                    ]
                    // Fetch villa and current pricing >>>>>>>>>>>>>>>>>
                    let villa;
                    try {
                        villa = await villasModel.aggregate(pipeline);
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching villas failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                    // Check villa exist or not >>>>>>>>>>>>>>>>>
                    if (villa.length == 0) {
                        return res.status(500).json({ error: 'Villa not found' });
                    }
                    // Check pet allowed or not >>>>>>>>>>>>>>>>>
                    if (Number(pets) > 0 && !villa[0].petAllowed) {
                        return res.status(500).json({ error: 'Pets are not allowed.' });
                    }
                    // Check max child >>>>>>>>>>>>>>>>>
                    if (Number(childs) > 0 && (Number(childs) > villa[0].maxChild)) {
                        return res.status(500).json({ error: `Max ${villa[0].maxChild} childs allowed.` });
                    }
                    // Check max guest >>>>>>>>>>>>>>>>>
                    if ((Number(adults) + Number(childs)) > villa[0].maxGuest) {
                        return res.status(500).json({ error: `Max ${villa[0].maxGuest} guests allowed.` });
                    }
                    // Check availability >>>>>>>>>>>>>>>>>
                    const checkBookingAvailability = async (startDate, endDate) => {
                        const overlappingBookings = await villaBookingsModel.find({
                            $or: [
                                { checkIn: { $gte: startDate, $lt: endDate } }, // Check-in date falls within the selected range
                                { checkOut: { $gt: startDate, $lte: endDate } }, // Check-out date falls within the selected range
                                { $and: [{ checkIn: { $lte: startDate } }, { checkOut: { $gt: endDate } }] } // Selected range is within an existing booking
                            ],
                            status: 'confirmed' // Exclude cancelled bookings
                        });
                        const bookedDates = new Set();
                        overlappingBookings.forEach(booking => {
                            const checkIn = new Date(booking.checkIn);
                            const checkOut = new Date(booking.checkOut);
                            const currentDate = new Date(checkIn);
                            while (currentDate <= checkOut) {
                                bookedDates.add(currentDate.toISOString().split('T')[0]);
                                currentDate.setDate(currentDate.getDate() + 1);
                            }
                        });
                        const currentDate = new Date(startDate);
                        while (currentDate <= endDate) {
                            if (bookedDates.has(currentDate.toISOString().split('T')[0]) && currentDate.getTime() !== endDate.getTime()) {
                                return false; // At least one day is booked (except the checkout day)
                            }
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                        return true; // All days are available
                    };
                    const bookingAvailability = await checkBookingAvailability(checkIn, checkOut);
                    if (!bookingAvailability) {
                        return res.status(500).json({ error: 'Villa is not available for selected dates.' });
                    }
                    // Seasonal pricing checker >>>>>>>>>>>>>>>>>
                    async function getCurrentSeasonalPricing(villaId) {
                        const currentDate = new Date();
                        const dateSeasonalPricing = await seasonalPricingsModel.findOne({
                            villaId: villaId,
                            rangeType: 'date',
                            'date.startDate': { $lte: currentDate },
                            'date.endDate': { $gte: currentDate }
                        });

                        if (dateSeasonalPricing) {
                            return dateSeasonalPricing;
                        }

                        const daySeasonalPricing = await seasonalPricingsModel.findOne({
                            villaId: villaId,
                            rangeType: 'day',
                            day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                        });

                        return daySeasonalPricing;
                    }
                    // Fetch seasonal pricing if available and add it to data
                    const seasonalPricing = await getCurrentSeasonalPricing(villaId);
                    if (seasonalPricing) {
                        villa[0].basePrice = seasonalPricing.basePrice;
                        // Check for other prices
                        if (seasonalPricing.discountedPrice) {
                            villa[0].discountedPrice = seasonalPricing.discountedPrice;
                        } else {
                            delete villa[0].discountedPrice;
                        }
                        if (seasonalPricing.extraGuestPrice) {
                            villa[0].extraGuestPrice = seasonalPricing.extraGuestPrice;
                        }
                        if (seasonalPricing.childPrice) {
                            villa[0].childPrice = seasonalPricing.childPrice;
                        }
                    }
                    // Get adult price >>>>>>>>>>>>>>>>>
                    const getAdultPrice = (basePrice, discountedPrice, minGuest, extraGuestPrice, adults) => {
                        let adultBasePrice = basePrice;
                        let adultDiscountedPrice = discountedPrice || 0;
                        if (adults > minGuest) {
                            if (discountedPrice) {
                                adultDiscountedPrice = discountedPrice + ((adults - minGuest) * extraGuestPrice)
                            }
                            adultBasePrice = basePrice + ((adults - minGuest) * extraGuestPrice)
                        }
                        return { adultBasePrice, adultDiscountedPrice }
                    }
                    const adultPrice = getAdultPrice(Number(villa[0].basePrice), Number(villa[0].discountedPrice), Number(villa[0].minGuest), Number(villa[0].extraGuestPrice), Number(adults));
                    // Get child price >>>>>>>>>>>>>>>>>
                    const getChildPrice = (childPrice, childs) => {
                        return childs * childPrice;
                    }
                    const childPrice = getChildPrice(Number(villa[0].childPrice), Number(childs));
                    // Per night price and per night discount >>>>>>>>>>>>>>>>>
                    let perNightPrice = adultPrice.adultBasePrice + childPrice;
                    let perNightDiscount;
                    if (villa[0].discountedPrice) {
                        perNightDiscount = adultPrice.adultBasePrice - adultPrice.adultDiscountedPrice;
                    } else {
                        perNightDiscount = 0;
                    }
                    // Calculate total stay nights >>>>>>>>>>>>>>>>>
                    const getTotalNights = (checkIn, checkOut) => {
                        // To calculate the time difference in milliseconds
                        var timeDiff = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
                        // To convert the time difference to days
                        return Math.ceil(timeDiff / (1000 * 3600 * 24));
                    }
                    const totalNights = getTotalNights(checkIn, checkOut);
                    // Complete stay price and discount >>>>>>>>>>>>>>>>>
                    const totalPrice = perNightPrice * totalNights; // Base price
                    const totalPriceDiscount = perNightDiscount * totalNights; // Total discount on base price
                    const totalPriceWithDiscount = totalPrice - totalPriceDiscount; // Total price with discount on base price
                    // Apply coupon discount to the price >>>>>>>>>>>>>>>>>>
                    const applyCoupon = async (couponCode, totalPriceWithDiscount) => {
                        var message = { type: '', message: '' }
                        var couponDiscount = 0;
                        if (couponCode && couponCode != '') {
                            const couponPipeline = [
                                {
                                    $match: {
                                        couponCode: couponCode,
                                        status: true,
                                        expirationDate: { $gte: new Date() },
                                        trash: { $ne: true },
                                        $expr: { $gt: ["$maxUses", { $size: "$usedByUsers" }] },
                                    }
                                },
                            ]
                            const coupon = await couponsModel.aggregate(couponPipeline);
                            if (coupon.length == 0) {
                                message = { type: 'error', message: 'Coupon code is not valid' }
                                return { message, couponDiscount };
                            }
                            // Check if coupon type is user only
                            if (coupon[0].type == 'userOnly' && coupon[0].userId != session?.user._id) {
                                message = { type: 'error', message: 'Coupon code is not valid' }
                                return { message, couponDiscount };
                            }
                            // Check if coupon only applicable on villas
                            if (coupon[0].validOn == 'villa' && coupon[0].villaId != villaId) {
                                message = { type: 'error', message: 'Coupon code is not valid' }
                                return { message, couponDiscount };
                            }
                            // Check if coupon only applicable on hotels
                            if (coupon[0].validOn == 'hotel') {
                                message = { type: 'error', message: 'Coupon code is not valid' }
                                return { message, couponDiscount };
                            }
                            // Check if multi use not allowes
                            if (!coupon[0].allowMultipleUses) {
                                const usedByUser = coupon[0].usedByUsers.filter((user) => user == session?.user._id);
                                if (usedByUser.length > 0) {
                                    message = { type: 'error', message: 'Coupon is already used by you before.' }
                                    return { message, couponDiscount };
                                }
                            }
                            // Check coupon price type
                            if (coupon[0].priceType == 'flat') {
                                switch (coupon[0].priceIn) {
                                    case 'percentage':
                                        couponDiscount = Math.min(totalPriceWithDiscount, totalPriceWithDiscount * Number(coupon[0].price) / 100);
                                        message = { type: 'success', message: 'Coupon code applied successfully' }
                                        return { message, couponDiscount: Math.round(couponDiscount) };
                                    case 'price':
                                        couponDiscount = Math.min(totalPriceWithDiscount, Number(coupon[0].price));
                                        message = { type: 'success', message: 'Coupon code applied successfully' }
                                        return { message, couponDiscount: Math.round(couponDiscount) };
                                    default:
                                        return { message, couponDiscount: Math.round(couponDiscount) };
                                }
                            } else {
                                if ((totalPriceWithDiscount * Number(coupon[0].price) / 100) <= coupon[0].maxPrice) {
                                    couponDiscount = totalPriceWithDiscount * Number(coupon[0].price) / 100;
                                    message = { type: 'success', message: 'Coupon code applied successfully' }
                                    return { message, couponDiscount: Math.round(couponDiscount) };
                                } else {
                                    couponDiscount = coupon[0].maxPrice;
                                    message = { type: 'success', message: 'Coupon code applied successfully' }
                                    return { message, couponDiscount: Math.round(couponDiscount) };
                                }
                            }
                        }
                        return { message, couponDiscount: Math.round(couponDiscount) };
                    }
                    const couponDiscount = await applyCoupon(coupon, totalPriceWithDiscount);
                    const totalPriceWithCoupon = Math.max(0, totalPriceWithDiscount - couponDiscount.couponDiscount);
                    // Apply taxes >>>>>>>>>>>>>>>>>>
                    const getTaxes = async (totalPriceWithCoupon) => {
                        const taxes = await taxesModel.find({ applyOnVillas: true }).lean();
                        // Get applied taxes
                        const appliedTaxes = [];
                        if (taxes.length > 0) {
                            taxes.map((tax) => {
                                appliedTaxes.push({ name: tax.name, price: tax.price, appliedPrice: Math.round(totalPriceWithCoupon * Number(tax.price) / 100) })
                            })
                        }
                        // Get total tax price
                        var totalTaxPrice = 0;
                        for (const appliedTax of appliedTaxes) {
                            totalTaxPrice += appliedTax.appliedPrice;
                        }
                        return { appliedTaxes, totalTaxPrice };
                    }
                    const taxes = await getTaxes(totalPriceWithCoupon);
                    const totalPriceWithTax = totalPriceWithCoupon + taxes.totalTaxPrice;
                    // Add addon prices >>>>>>>>>>>>>>>>>>
                    const getAddonsPricing = async (addons, villaId) => {
                        let appliedAddons = [];
                        let totalAddonPrice = 0;
                        await Promise.all(addons.map(async (addonId) => {
                            const addon = await addonsModel.findOne({ villaId, _id: addonId }).lean();
                            appliedAddons.push({ addonId: addon._id, name: addon.name, price: addon.price });
                            totalAddonPrice += addon.price;
                        }));
                        return { appliedAddons, totalAddonPrice }
                    }
                    const addonsPricing = await getAddonsPricing(addons, villaId);
                    const totalPriceWithAddons = addonsPricing.totalAddonPrice + totalPriceWithTax;
                    // Minimum price to book >>>>>>>>>>>>>>>>>>
                    const getMinimumPrice = async (totalPriceWithAddons, villa) => {
                        let appliedMinimumPrice = {}; // To set what % of advance payment was required during the booking and who set that
                        let minimumPriceToBook; // To get minimum price to book this villa [Total price]
                        try {
                            if (!settings.admin.booking.enableBookingsVilla) {
                                return res.status(500).json({ error: `Booking is currently disabled for this villa.` });
                            }
                            if (!settings.admin.booking.letOwnerManageMinimumPriceToBook) {
                                appliedMinimumPrice.minimumPriceToBook = settings.admin.booking.minimumPriceToBook;
                                appliedMinimumPrice.setBy = 'Admin'
                                minimumPriceToBook = totalPriceWithAddons * settings.admin.booking.minimumPriceToBook / 100;
                            } else {
                                appliedMinimumPrice.minimumPriceToBook = settings.admin.booking.minimumPriceToBook;
                                appliedMinimumPrice.setBy = 'Villa owner'
                                minimumPriceToBook = totalPriceWithAddons * villa[0].minimumPriceToBook / 100;
                            }
                            return { appliedMinimumPrice, minimumPriceToBook }
                        } catch (error) {
                            return res.status(500).json({ error: `Failed to fetch minimum price to book. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                    }
                    const minimumPrice = await getMinimumPrice(totalPriceWithAddons, villa);
                    // Set price to be paid
                    let priceToBePaid = {
                        minimum: Math.round(minimumPrice.minimumPriceToBook),
                        full: totalPriceWithAddons
                    }
                    // Set booking details >>>>>>>>>>>>>>>>>
                    var bookingDetails = {
                        src: 'website',
                        userId: session.user._id,
                        villaId,
                        checkIn,
                        checkOut,
                        mainGuestInfo: {
                            name,
                            email,
                            phone
                        },
                        guests: {
                            adults,
                            childs,
                            pets
                        },
                        appliedPricing: {
                            basePrice: villa[0].basePrice,
                            discountedPrice: villa[0].discountedPrice || null,
                            extraGuestPrice: villa[0].extraGuestPrice,
                            childPrice: villa[0].childPrice,
                        },
                        invoicePricing: {
                            totalNights,
                            perNightPrice,
                            discount: {
                                totalPriceDiscount,
                                couponDiscount: {
                                    couponCode: couponDiscount.message.type == 'success' ? coupon : '',
                                    price: couponDiscount.couponDiscount
                                },
                            },
                            taxes: {
                                appliedTaxes: taxes.appliedTaxes,
                                totalTaxPrice: taxes.totalTaxPrice
                            },
                            addons: {
                                appliedAddons: addonsPricing.appliedAddons,
                                totalAddonPrice: addonsPricing.totalAddonPrice
                            },
                            appliedMinimumPrice: minimumPrice.appliedMinimumPrice,
                            priceToBePaid
                        },
                        cancellation: villa[0].cancellation,
                    }
                    // Add direct booking for if full amount is 0 >>>>>>>>>>>>>>>>>
                    if (priceToBePaid.full == 0) {
                        // Set booking details
                        bookingDetails.status = 'confirmed';
                        // Add booking
                        var newBooking;
                        try {
                            newBooking = new villaBookingsModel(bookingDetails)
                            await newBooking.save();
                            // Update coupon usage >>>>>>>>>>>>>>>>
                            if (couponDiscount.message.type == 'success' && coupon != '') {
                                try {
                                    await couponsModel.updateOne({ couponCode: coupon }, { $push: { usedByUsers: session.user._id } })
                                } catch (error) {
                                    // Revert booking status
                                    await villaBookingsModel.findOneAndUpdate(
                                        { _id: newBooking._id },
                                        { $set: { status: 'pending' } }
                                    ).exec();
                                    return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in updating coupon usage entry : ${error}`}` });
                                }
                            }
                            // Redirect to invoice page
                            return res.status(200).json({ redirectUrl: `/user/bookings/${newBooking._id}/invoice` });
                        } catch (error) {
                            return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in creating booking entry : ${error}`}` });
                        }
                    }
                    // RazorPay logics >>>>>>>>>>>>>>>>>
                    if (settings.admin.gateway.gatewayName && settings.admin.gateway.gatewayName == 'razorpay' && settings.admin.gateway.privateApiKey && settings.admin.gateway.publicApiKey) {
                        var instance = new Razorpay({
                            key_id: settings.admin.gateway.publicApiKey,
                            key_secret: settings.admin.gateway.privateApiKey,
                        });
                        var options = {
                            amount: (paymentType == 'full' ? Number(priceToBePaid.full) : Number(priceToBePaid.minimum)) * 100,
                            currency: settings.admin.gateway.currencyCode,
                        };
                        const order = await instance.orders.create(options);
                        if (order.status != 'created') {
                            return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in creating order from razorpay`}` });
                        }
                        // Add booking entry with pending status to db >>>>>>>>>>>>>>>>>
                        var newBooking;
                        try {
                            // Set booking details
                            bookingDetails.status = 'pending';
                            // Add booking
                            newBooking = new villaBookingsModel(bookingDetails)
                            await newBooking.save();
                        } catch (error) {
                            return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in creating booking entry : ${error}`}` });
                        }
                        // Add payment entry with pending status to db >>>>>>>>>>>>>>>>>
                        try {
                            const newPayment = new paymentsModel({
                                type: 'normal',
                                src: 'razorpay',
                                razorpay: {
                                    orderId: order.id,
                                },
                                userId: session.user._id,
                                paidFor: 'villa',
                                villaId,
                                villaBookingId: newBooking._id,
                                range: paymentType == 'full' ? 'full' : 'pre',
                                price: paymentType == 'full' ? priceToBePaid.full : priceToBePaid.minimum,
                                status: 'pending',
                            })
                            await newPayment.save();
                        } catch (error) {
                            return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in creating payment entry : ${error}`}` });
                        }
                        return res.status(200).json(order);
                    } else {
                        return res.status(500).json({ error: `Payment gateway in not set.` });
                    }

                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
