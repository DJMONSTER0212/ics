import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import settingsModel from "@/models/settings.model";
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
                // Setting update fields >>>>>>>>>>>>>>
                var updateFields = {
                    'daysBeforeCheckIn': fields.daysBeforeCheckIn,
                    'refundablePrice': fields.refundablePrice,
                }
                // Check for existing rule of same days
                const existingRules = await settingsModel.find({ 'admin.cancellation.cancellationRules.daysBeforeCheckIn': fields.daysBeforeCheckIn })
                if (existingRules.length > 0) {
                    return res.status(500).json({ error: `A rule is already defined for these days.` })
                }
                // Update setting >>>>>>>>>>>>>>
                try {
                    await settingsModel.updateOne({}, { $push: { 'admin.cancellation.cancellationRules': updateFields } }).exec()
                    return res.status(200).json({ success: 'Cancellation rules has been added successfully.' })
                } catch (error) {
                    return res.status(500).json({ error: `Adding cancellation rules failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = {};
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await settingsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                'admin.cancellation.cancellationRules': 1,
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Cancellation rules not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching cancellation rules failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
