import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
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
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page." })
            }
            // Logics
            if (req.method == 'POST') {
                try {
                    // Setting update fields >>>>>>>>>>>>>>
                    var updateFields = {
                        'daysBeforeCheckIn': fields.daysBeforeCheckIn,
                        'refundablePrice': fields.refundablePrice,
                    }
                    // Check for existing rule of same days
                    const existingRules = await villasModel.find({ _id: new mongoose.Types.ObjectId(req.query.id), 'cancellation.cancellationRules._id': { $ne: req.query.ruleId }, 'cancellation.cancellationRules.daysBeforeCheckIn': fields.daysBeforeCheckIn })
                    if (existingRules.length > 0) {
                        return res.status(500).json({ error: `A rule is already defined for these days.` })
                    }
                    // Update rule >>>>>>>>>>>>>>
                    await villasModel.updateOne(
                        { 'cancellation.cancellationRules._id': req.query.ruleId },
                        { $set: { 'cancellation.cancellationRules.$': updateFields } }
                    ); return res.status(200).json({ success: 'Cancellation rules has been updates successfully.' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating cancellation rules failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { ruleId } = req.query;
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: new mongoose.Types.ObjectId(req.query.id), 'cancellation.cancellationRules._id': new mongoose.Types.ObjectId(ruleId) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await villasModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                'cancellationRules': {
                                    $filter: {
                                        input: '$cancellation.cancellationRules',
                                        as: 'rule',
                                        cond: { $eq: ['$$rule._id', new mongoose.Types.ObjectId(ruleId)] }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: '$cancellationRules'
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Cancellation rule not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching cancellation rule failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
