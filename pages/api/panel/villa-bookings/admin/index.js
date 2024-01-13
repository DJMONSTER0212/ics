import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villaBookingsModel from "@/models/villaBookings.model";
import couponsModel from "@/models/coupons.model";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import addonsModel from "@/models/addons.model";
import taxesModel from "@/models/taxes.model";
import settingsModel from "@/models/settings.model";
import icsGen from "@/util/icsGen"
import villasModel from "@/models/villas.model";
import paymentModel from "@/models/payments.model"
import userModel from "@/models/users.model"
import icalendar from 'ical-generator';
import eventCheck from '@/util/EventChecker';
import mongoose from 'mongoose';
// dsad/
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
            // Unauthorized access >>>>>>>>>>>>>>>
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({
                    error: "You must be signed in as admin to view the protected content on this page.",
                })
            }
            // Logics >>>>>>>>>>>>>>>
            if (req.method == 'POST') {
                let { range, advancePayed, villaId, src, srcDesc, userId, status, checkIn, checkOut, adults, childs, pets, name, email, phone, coupon, priceMode, basePrice, discountedPrice, childPrice, extraGuestPrice } = fields;
                let directDiscount = fields.directDiscount;
                let addons = await JSON.parse(fields.addons);
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
                // Check price mode >>>>>>>>>>>>>>>
                if (priceMode == 'manual') {
                    // Give error if no custom base price found
                    if (!basePrice) {
                        return res.status(500).json({ error: 'Base price is required.' });
                    }
                    // Set custom prices
                    villa[0].basePrice = Number(basePrice);
                    villa[0].discountedPrice = Number(discountedPrice);
                    villa[0].extraGuestPrice = Number(extraGuestPrice);
                    villa[0].childPrice = Number(childPrice);
                } else {
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
                const totalChildPrice = getChildPrice(Number(villa[0].childPrice), Number(childs));
                // Per night price and per night discount >>>>>>>>>>>>>>>>>
                let perNightPrice = adultPrice.adultBasePrice + totalChildPrice;
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
                    var couponMessage = { type: '', message: '' }
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
                            couponMessage = { type: 'error', message: 'Coupon code is not valid' }
                            return { couponMessage, couponDiscount };
                        }
                        // Check if coupon type is user only
                        if (coupon[0].type == 'userOnly' && coupon[0].userId != userId) {
                            couponMessage = { type: 'error', message: 'Coupon code is not valid' }
                            return { couponMessage, couponDiscount };
                        }
                        // Check if coupon only applicable on villas
                        if (coupon[0].validOn == 'villa' && coupon[0].villaId != villaId) {
                            couponMessage = { type: 'error', message: 'Coupon code is not valid' }
                            return { couponMessage, couponDiscount };
                        }
                        // Check if coupon only applicable on hotels
                        if (coupon[0].validOn == 'hotel') {
                            couponMessage = { type: 'error', message: 'Coupon code is not valid' }
                            return { couponMessage, couponDiscount };
                        }
                        // Check if multi use not allowes
                        if (!coupon[0].allowMultipleUses) {
                            const usedByUser = coupon[0].usedByUsers.filter((user) => user == userId);
                            if (usedByUser.length > 0) {
                                couponMessage = { type: 'error', message: 'Coupon is already used by the user.' }
                                return { couponMessage, couponDiscount };
                            }
                        }
                        // Check coupon price type
                        if (coupon[0].priceType == 'flat') {
                            switch (coupon[0].priceIn) {
                                case 'percentage':
                                    couponDiscount = Math.min(totalPriceWithDiscount, totalPriceWithDiscount * Number(coupon[0].price) / 100);
                                    couponMessage = { type: 'success', message: 'Coupon code applied successfully' }
                                    return { couponMessage, couponDiscount: Math.round(couponDiscount) };
                                case 'price':
                                    couponDiscount = Math.min(totalPriceWithDiscount, Number(coupon[0].price));
                                    couponMessage = { type: 'success', message: 'Coupon code applied successfully' }
                                    return { couponMessage, couponDiscount: Math.round(couponDiscount) };
                                default:
                                    return { couponMessage, couponDiscount: Math.round(couponDiscount) };
                            }
                        } else {
                            if ((totalPriceWithDiscount * Number(coupon[0].price) / 100) <= coupon[0].maxPrice) {
                                couponDiscount = totalPriceWithDiscount * Number(coupon[0].price) / 100;
                                couponMessage = { type: 'success', message: 'Coupon code applied successfully' }
                                return { couponMessage, couponDiscount: Math.round(couponDiscount) };
                            } else {
                                couponDiscount = coupon[0].maxPrice;
                                couponMessage = { type: 'success', message: 'Coupon code applied successfully' }
                                return { couponMessage, couponDiscount: Math.round(couponDiscount) };
                            }
                        }
                    }
                    return { couponMessage, couponDiscount: Math.round(couponDiscount) };
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
                let totalPriceWithAddons = addonsPricing.totalAddonPrice + totalPriceWithTax;
                // Apply direct discount
                const applyDirectDiscount = async (discount, totalPriceWithAddons) => {
                    var directDiscountMessage = { type: '', message: '' }
                    directDiscount = 0
                    if (discount && discount != '') {
                        // Check discount value is between 0 and total price with addons
                        if (discount < 0 || discount > totalPriceWithAddons) {
                            directDiscountMessage = { type: 'error', message: 'Direct discount price should be between 0 and total price' + totalPriceWithAddons }
                            return directDiscountMessage;
                        }
                        // Set updated price
                        directDiscount = discount;
                    }
                    return directDiscountMessage;
                }
                const directDiscountMessage = await applyDirectDiscount(directDiscount, totalPriceWithAddons);
                totalPriceWithAddons = totalPriceWithAddons - directDiscount;
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
                // console.log(minimumPrice);
                let priceToBePaid = {
                    minimum: Math.round(minimumPrice.minimumPriceToBook),
                    full: totalPriceWithAddons
                }
                // console.log(priceToBePaid);
                // Update coupon usage if status is confirmed >>>>>>>>>>>>>>>>
                if (status == 'confirmed' && coupon && coupon != '') {
                    try {
                        await couponsModel.updateOne({ couponCode: coupon }, { $push: { usedByUsers: userId } })
                    } catch (error) {
                        return res.status(500).json({ error: `Updating coupon usage failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                }
                // Adding villa booking >>>>>>>>>>>>>>>>>

                const currVilla = villa[0];
                // console.log(currVilla)
                let events = currVilla.events || []
                // console.log(await eventCheck(events, checkIn, checkOut).then(function (result) { return result }));
                if (await eventCheck(events, checkIn, checkOut).then(function (result) { return result })) {
                    // adding the new events

                    let event = {
                        start: checkIn,
                        end: checkOut,
                        summary: "booked",
                        description: `Reserved `,
                        url: "https://testUrl.com"
                    }
                    // console.log(event)
                    events.push(event);

                    // console.log(events)
                    const final = await events.filter((event) => {
                        return (new Date(event.end) > new Date())
                    })
                    // console.log(final);
                    try {
                        let newIcsContent = "";
                        try {
                            const calendar = await icalendar({
                                prodId: '//superman-industries.com//ical-generator//EN',
                                events: final,
                            })
                            newIcsContent = calendar.toString();
                        } catch (error) {
                            console.log(error)
                        }
                        // const newIcsContent = await icsGen(events);
                        // console.log(newIcsContent);
                        const data = await villasModel.findByIdAndUpdate({ _id: villaId }, {
                            events: final,
                            icsContent: newIcsContent
                        })


                    } catch (error) {
                        console.log(error);
                    }

                    var newBooking;
                    try {
                        // Set applied pricing
                        let appliedPricing;
                        if (priceMode == 'automatic') {
                            appliedPricing = {
                                basePrice: villa[0].basePrice,
                                discountedPrice: villa[0].discountedPrice || null,
                                extraGuestPrice: villa[0].extraGuestPrice,
                                childPrice: villa[0].childPrice,
                            }
                        } else {
                            appliedPricing = {
                                basePrice,
                                discountedPrice,
                                extraGuestPrice,
                                childPrice,
                            }
                        }
                        // Create booking
                        newBooking = new villaBookingsModel({
                            src,
                            srcDesc,
                            userId,
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
                            appliedPricing: appliedPricing,
                            invoicePricing: {
                                totalNights,
                                perNightPrice,
                                discount: {
                                    totalPriceDiscount,
                                    couponDiscount: {
                                        couponCode: couponDiscount.couponMessage.type == 'success' ? coupon : '',
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
                                directDiscount: directDiscount,
                                appliedMinimumPrice: minimumPrice.appliedMinimumPrice,
                                priceToBePaid
                            },
                            status: status,
                            cancellation: villa[0].cancellation,
                        })
                        // console.log(priceToBePaid)
                        // console.log(newBooking)
                        // console.log("==============================================================================================")
                        const result = await newBooking.save();
                        // console.log(result._id)
                        const { _id } = result._id;
                        // console.log(_id)
                        const date = new Date();
                        console.log(date)
                        // console.log(advancePayed)
                        if(range=="full"){
                            advancePayed = priceToBePaid.minimum
                        }
                        try {
                            const newPayment = new paymentModel({
                                type: "normal",
                                src,
                                srcDesc,
                                userId,
                                paidFor: "villa",
                                villaId,
                                villaBookingId: _id,
                                range,
                                paymentDate: date,
                                status: range === "full" ? "successful" : "pending",
                                price: priceToBePaid.minimum,
                                advancePaid : advancePayed
                            })
                            await newPayment.save()
                            console.log(newPayment)
                            // console.log("hi")
                            return res.status(200).json({ success: 'Booking has been added successfully' })
                        } catch (error) {
                            console.log(error)
                        }

                    } catch (error) {
                        return res.status(500).json({ error: `Adding booking failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                }
                else {
                    // console.log("It's working");
                    return res.status(500).send({ error: `Villa is Already Booked for these dates` });
                }
            } else if (req.method == 'GET') {
                try {
                    const { pageIndex, maxResult, search, searchOption, villaBookingType } = req.query;
                    // To set search query [For search, searchOption] >>>>>>>>>>>>>>>
                    let searchQuery = {};
                    const queryRegx = new RegExp(`.*${search}.*`, "i");
                    switch (searchOption) {
                        case 'mainGuestInfo':
                            searchQuery = {
                                $or: [
                                    { 'mainGuestInfo.name': { $regex: queryRegx } },
                                    { 'mainGuestInfo.email': { $regex: queryRegx } },
                                    { 'mainGuestInfo.phone': { $regex: queryRegx } }
                                ]
                            }
                            break;
                        case 'bookingId':
                            searchQuery = {
                                _id: mongoose.Types.ObjectId(search)
                            }
                            break;
                        default:
                            searchQuery = {
                                $or: [
                                    { 'mainGuestInfo.name': { $regex: queryRegx } },
                                    { 'mainGuestInfo.email': { $regex: queryRegx } },
                                    { 'mainGuestInfo.phone': { $regex: queryRegx } },
                                    { _id: mongoose.Types.ObjectId(search) }
                                ]
                            }
                            break;
                    }
                    // To set match query [For bookingType] >>>>>>>>>>>>>>>
                    let matchQuery = {};
                    switch (villaBookingType) {
                        case 'all':
                            matchQuery = {
                                trash: { $ne: true }
                            }
                            break;
                        case 'confirmed':
                            matchQuery = {
                                'status': 'confirmed',
                                trash: { $ne: true }
                            }
                            break;
                        case 'pending':
                            matchQuery = {
                                'status': 'pending',
                                trash: { $ne: true }
                            }
                            break;
                        case 'cancelled':
                            matchQuery = {
                                'status': 'cancelled',
                                trash: { $ne: true }
                            }
                            break;
                        default:
                            matchQuery = {
                                trash: { $ne: true }
                            }
                            break;
                    }
                    // To sort results >>>>>>>>>>>>>>>
                    const sortQuery = { updatedAt: 1 };
                    const data = await villaBookingsModel.aggregate([
                        { $match: search ? searchQuery : {} },
                        { $match: matchQuery ? matchQuery : {} },
                        { $sort: sortQuery },
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'user'
                            }
                        },
                        { $unwind: '$user' },
                        {
                            $lookup: {
                                from: 'villas',
                                localField: 'villaId',
                                foreignField: '_id',
                                as: 'villa'
                            }
                        },
                        { $unwind: '$villa' },
                        {
                            $lookup: {
                                from: 'locations',
                                localField: 'villa.locationId',
                                foreignField: '_id',
                                as: 'villa.location'
                            }
                        },
                        { $unwind: '$villa.location' },
                    ]);
                    // To count results >>>>>>>>>>>>>>>
                    const totalRow = await villaBookingsModel.countDocuments({
                        $and: [
                            search ? searchQuery : {},
                            matchQuery ? matchQuery : {}
                        ]
                    });
                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching villa bookings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
