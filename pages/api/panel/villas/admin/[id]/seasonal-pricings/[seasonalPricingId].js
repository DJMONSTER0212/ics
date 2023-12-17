import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
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
            // Unauthorized access
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            if (req.method == 'POST') {
                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    name: fields.name,
                    basePrice: fields.basePrice,
                    discountedPrice: fields.discountedPrice || '',
                    extraGuestPrice: fields.extraGuestPrice || '',
                    childPrice: fields.childPrice || '',
                    rangeType: fields.rangeType,
                    date: {
                        startDate: fields.startDate,
                        endDate: fields.endDate
                    },
                    day: fields.day,
                    villaId: req.query.id,
                }
                // Check villa id >>>>>>>>>>>>>>
                if (!req.query.id || (req.query.id == '123456789012' || req.query.id == '313233343536373839303132') || !mongoose.isValidObjectId(req.query.id)) {
                    return res.status(500).json({ error: `Please provide a valid villa id` });
                }
                // Update fields based on range type >>>>>>>>>>>>>>
                if (fields.rangeType == 'date') {
                    if (new Date(fields.endDate) >= new Date(fields.startDate)) {
                        // Existing seasonal pricing check for these dates
                        const currentSeasonalPricings = await seasonalPricingsModel.find({ _id: { $ne: req.query.seasonalPricingId }, villaId: req.query.id, rangeType: 'date' });
                        function checkDateRangeOverlap(seasonalPricings, startDate, endDate) {
                            for (let seasonalPricing of seasonalPricings) {
                                if (
                                    (new Date(seasonalPricing.date.startDate) >= new Date(startDate) && new Date(seasonalPricing.date.startDate) <= new Date(endDate)) ||  // Start date of object is within the provided range
                                    (new Date(seasonalPricing.date.endDate) >= new Date(startDate) && new Date(seasonalPricing.date.endDate) <= new Date(endDate)) ||      // End date of object is within the provided range
                                    (new Date(seasonalPricing.date.startDate) <= new Date(startDate) && new Date(seasonalPricing.date.endDate) >= new Date(endDate))       // Object's range fully encompasses the provided range
                                ) {
                                    // Dates partially or fully overlap
                                    return true;
                                }
                            }
                            // No overlap found
                            return false;
                        }
                        if (checkDateRangeOverlap(currentSeasonalPricings, fields.startDate, fields.endDate)) {
                            return res.status(500).json({ error: `Provided dates partially or fully overlap with existing seasonal pricings` });
                        }
                        // delete day field
                        delete updateFields.day;
                    } else {
                        return res.status(500).json({ error: `End date should be greater or equal to start date` });
                    }
                } else if (fields.rangeType == 'day') {
                    // Existing seasonal pricing check for same day
                    const currentSeasonalPricings = await seasonalPricingsModel.find({ _id: { $ne: req.query.seasonalPricingId }, villaId: req.query.id, rangeType: 'day', day: fields.day });
                    if (currentSeasonalPricings.length > 0) {
                        return res.status(500).json({ error: `Pricing for this day is already added` });
                    }
                    // delete date field
                    delete updateFields.date;
                }

                // Delete empty fields >>>>>>>>>>>>>>
                var unsetFields = {}
                function deleteEmptyFields(obj, fields, unsetFields) {
                    for (let key of fields) {
                        if (obj.hasOwnProperty(key) && (obj[key] === '' || obj[key] == 'null' || obj[key] == 'undefined')) {
                            unsetFields[key] = 1;
                            delete obj[key];
                        }
                    }
                }
                deleteEmptyFields(updateFields, ['discountedPrice', 'extraGuestPrice', 'childPrice', 'petPrice'], unsetFields);
                // Updating data >>>>>>>>>>>>>>
                try {
                    await seasonalPricingsModel.updateOne({ _id: req.query.seasonalPricingId }, { $set: updateFields, $unset: unsetFields })
                    return res.status(200).json({ success: 'Seasonal pricing has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating seasonal pricing failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { seasonalPricingId } = req.query;
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(seasonalPricingId) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await seasonalPricingsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Seasonal pricing not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching seasonal pricing failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
