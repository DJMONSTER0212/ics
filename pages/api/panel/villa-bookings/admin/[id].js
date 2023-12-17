import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villaBookingsModel from "@/models/villaBookings.model";
import addonsModel from "@/models/addons.model";
import villasModel from "@/models/villas.model";
import paymentsModel from "@/models/payments.model";
import mongoose from 'mongoose';

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
                let id = req.query.id;
                let { src, srcDesc, status, checkIn, checkOut, checkedIn, checkedOut, adults, childs, pets, name, email, phone, updateNote } = fields;
                let newAddons = await JSON.parse(fields.newAddons);
                let removeAddons = await JSON.parse(fields.removeAddons);
                // Fetch booking >>>>>>>>>>>>>>>
                let booking;
                try {
                    booking = await villaBookingsModel.aggregate([
                        { $match: { _id: mongoose.Types.ObjectId(id) } },
                        {
                            $lookup: {
                                from: 'villas',
                                localField: 'villaId',
                                foreignField: '_id',
                                as: 'villa'
                            }
                        },
                        { $unwind: '$villa' },
                    ]);
                    if (booking.length == 0) {
                        return res.status(500).json({ error: `Booking not found.` });
                    }
                    booking = booking[0];
                } catch (error) {
                    return res.status(500).json({ error: `Fetching booking failed.` });
                }
                // Setting pipeline to fetch villa >>>>>>>>>>>>>>>>>
                const pipeline = [
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(booking.villaId),
                            'verification.verified': true,
                            block: false,
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
                        status: { $ne: 'cancelled' } // Exclude cancelled bookings
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
                if (!await checkBookingAvailability(checkIn, checkOut)) {
                    return res.status(500).json({ error: 'Villa is not available for selected dates.', status: 0 });
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
                const adultPrice = getAdultPrice(Number(booking.appliedPricing.basePrice), Number(booking.appliedPricing.discountedPrice), Number(villa[0].minGuest), Number(booking.appliedPricing.extraGuestPrice), Number(adults));
                // Get child price >>>>>>>>>>>>>>>>>
                const getChildPrice = (childPrice, childs) => {
                    return childs * childPrice;
                }
                const childPrice = getChildPrice(Number(booking.appliedPricing.childPrice), Number(childs));
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
                // Apply coupon discount to the price if it was applied before >>>>>>>>>>>>>>>>>>
                const totalPriceWithCoupon = Math.max(0, totalPriceWithDiscount - booking.invoicePricing.discount.couponDiscount.price);
                // Apply taxes >>>>>>>>>>>>>>>>>>
                const getTaxes = async (totalPriceWithCoupon) => {
                    const taxes = booking.invoicePricing.taxes.appliedTaxes;
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
                // Remove addons prices >>>>>>>>>>>>>>>>>>
                const removeAddonsPricing = async (removeAddons, addedAddons, oldTotalAddonPrice) => {
                    let appliedAddons = addedAddons;
                    let totalAddonPrice = oldTotalAddonPrice;
                    if (removeAddons.length > 0) {
                        await Promise.all(removeAddons.map(async (addonId) => {
                            const addon = addedAddons.filter((addon) => addon.addonId == addonId);
                            appliedAddons = appliedAddons.filter((addon) => addon.addonId != addonId);
                            totalAddonPrice = totalAddonPrice - addon[0].price;
                        }));
                    }
                    return { appliedAddons, totalAddonPrice }
                }
                let addonsPricing = await removeAddonsPricing(removeAddons, booking.invoicePricing.addons.appliedAddons, booking.invoicePricing.addons.totalAddonPrice);
                let totalPriceWithAddons = addonsPricing.totalAddonPrice;
                // Add addon prices >>>>>>>>>>>>>>>>>>
                const getAddonsPricing = async (newAddons, addedAddons, totalPriceWithAddons, villaId) => {
                    let appliedAddons = addedAddons;
                    let totalAddonPrice = totalPriceWithAddons;
                    await Promise.all(newAddons.map(async (addonId) => {
                        const addon = await addonsModel.findOne({ villaId, _id: addonId }).lean();
                        appliedAddons.push({ addonId: addon._id, name: addon.name, price: addon.price });
                        totalAddonPrice += addon.price;
                    }));
                    return { appliedAddons, totalAddonPrice }
                }
                addonsPricing = await getAddonsPricing(newAddons, addonsPricing.appliedAddons, totalPriceWithAddons, booking.villaId);
                totalPriceWithAddons = totalPriceWithTax + addonsPricing.totalAddonPrice;
                // Minimum price to book >>>>>>>>>>>>>>>>>>
                const getMinimumPrice = async (appliedMinimumPrice, totalPriceWithAddons) => {
                    let minimumPriceToBook; // To get minimum price to book this villa [Total price]
                    try {
                        minimumPriceToBook = totalPriceWithAddons * appliedMinimumPrice.minimumPriceToBook / 100;
                        return { appliedMinimumPrice, minimumPriceToBook }
                    } catch (error) {
                        return res.status(500).json({ error: `Failed to fetch minimum price to book. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                }
                const minimumPrice = await getMinimumPrice(booking.invoicePricing.appliedMinimumPrice, totalPriceWithAddons);
                // Set price to be paid
                let priceToBePaid = {
                    minimum: Math.round(minimumPrice.minimumPriceToBook),
                    full: totalPriceWithAddons
                }
                // Update booking
                try {
                    // Fields to be updated
                    const updateFields = {
                        src,
                        srcDesc,
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
                        invoicePricing: {
                            totalNights,
                            perNightPrice,
                            discount: {
                                totalPriceDiscount,
                                couponDiscount: {
                                    couponCode: booking.invoicePricing.discount.couponDiscount.couponCode,
                                    price: booking.invoicePricing.discount.couponDiscount.price
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
                            appliedMinimumPrice: booking.invoicePricing.appliedMinimumPrice,
                            priceToBePaid
                        },
                        status: status,
                    }
                    await villaBookingsModel.updateOne({ _id: id }, { $set: updateFields });
                    return res.status(200).json({ success: 'Booking has been updated successfully', updatedFields: updateFields })
                } catch (error) {
                    return res.status(500).json({ error: `Updating booking failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else if (req.method == 'GET') {
                try {
                    const { id } = req.query;
                    // To set match query [For bookingType] >>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // To sort results >>>>>>>>>>>>>>>
                    const data = await villaBookingsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
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
                    // Payments of booking
                    try {
                        const payments = await paymentsModel.find({ villaBookingId: mongoose.Types.ObjectId(id) });
                        // Total paid price
                        let totalPaidPrice = 0;
                        for (const payment of payments) {
                            if (payment.status === "successful" && payment.type == 'normal') {
                                totalPaidPrice += payment.price;
                            }
                        }
                        data[0].payments = payments
                        data[0].totalPaidPrice = totalPaidPrice
                    } catch (error) {
                        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
