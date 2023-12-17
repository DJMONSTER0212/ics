import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import mongoose from "mongoose";

// Database
connectDB()

export default async function handler(req, res) {
    const ical = require('ical');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = ical.parseICS('/listing-39378614.ics');
    console.log(data)
    try {
        // Logics
        if (req.method == 'GET') {
            try {
                // Setting pipeline >>>>>>>>>>>>>>>>>
                const pipeline = [
                    { $match: { 'verification.verified': true, block: false, bookingAllowed: true, trash: { $ne: true } } },
                ]
                // Set search
                if (req.query.searchByName) {
                    pipeline.push({ $match: { 'name': new RegExp(`.*${req.query.searchByName}.*`, "i") } })
                }
                // Set best rated only
                if (req.query.bestRated == 'true') {
                    pipeline.push({ $match: { 'promotion.bestRated': true } })
                }
                // Set pet allowed only
                if (req.query.petAllowed == 'true') {
                    pipeline.push({ $match: { 'petAllowed': true } })
                }
                // Set pet new only
                if (req.query.new == 'true') {
                    pipeline.push({ $match: { 'promotion.new': true } })
                }
                // Set location
                if (req.query.locationId) {
                    switch (req.query.locationId) {
                        case 'popular':
                            pipeline.push({ $match: {} })
                            break;

                        default:
                            pipeline.push({ $match: { locationId: mongoose.Types.ObjectId(req.query.locationId) } })
                            break;
                    }
                }
                // Sort by price
                if (req.query.sortByPrice == 'priceDes') {
                    pipeline.push({ $sort: { discountedPrice: -1, basePrice: -1 } })
                }
                if (req.query.sortByPrice == 'priceAsc') {
                    pipeline.push({ $sort: { discountedPrice: 1, basePrice: 1 } })
                }
                // Set limit
                if (req.query.limit) {
                    pipeline.push({ $limit: Number(req.query.limit) })
                }
                // set unwinds
                pipeline.push(
                    {
                        $lookup: {
                            from: 'locations',
                            localField: 'locationId',
                            foreignField: '_id',
                            as: 'location'
                        }
                    },
                    { $unwind: '$location' }
                )

                // Fetch villas >>>>>>>>>>>>>>>>>
                var villas;
                try {
                    villas = await villasModel.aggregate(pipeline);
                } catch (error) {
                    return res.status(500).json({ error: `Fetching villas failed ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
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

                // Fetch seasonal pricing if available and add it to data >>>>>>>>>>>>>>>>>
                await Promise.all(
                    villas.map(async (villa, index) => {
                        const seasonalPricing = await getCurrentSeasonalPricing(villa._id);
                        if (seasonalPricing) {
                            villas[index].basePrice = seasonalPricing.basePrice;
                            // Check for other prices
                            if (seasonalPricing.discountedPrice) {
                                villas[index].discountedPrice = seasonalPricing.discountedPrice;
                            } else {
                                delete villas[index].discountedPrice;
                            }
                            if (seasonalPricing.extraGuestPrice) {
                                villas[index].extraGuestPrice = seasonalPricing.extraGuestPrice;
                            }
                            if (seasonalPricing.childPrice) {
                                villas[index].childPrice = seasonalPricing.childPrice;
                            }
                        }
                    })
                );
                return res.status(200).json({ data: villas });
            } catch (error) {
                return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
