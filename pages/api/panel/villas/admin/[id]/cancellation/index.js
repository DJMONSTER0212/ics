import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import settingsModel from "@/models/settings.model";
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
                        'cancellation.allowCancellation': fields.allowCancellation,
                    }
                    // Setting logics >>>>>>>>>>>>>>
                    const settings = await settingsModel.findOne().select().lean();
                    // Multivendor logics
                    if (!settings.tnit.multiVendorAllowed) {
                        return res.status(200).json({ error: 'Cancellation settings are not available for single vendor model. Please contact TNIT to enable this feature.' })
                    }
                    // Check if admin disabled this for property owner
                    if (!settings.admin.cancellation.letOwnerManageCancellation) {
                        return res.status(500).json({ error: 'Please enable let property owner manage cancellation in settings to manage this.' })
                    }
                    // Update cancellation settings >>>>>>>>>>>>>>
                    await villasModel.updateOne({ _id: new mongoose.Types.ObjectId(req.query.id) }, { $set: updateFields }).exec()
                    return res.status(200).json({ success: 'Cancellation settings has been updated successfully.' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating setting failed.${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    let settings;
                    try {
                        settings = await settingsModel.findOne().lean()
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching settings failed.${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                    }
                    // Multivendor logics >>>>>>>>>>>>>>
                    if (!settings.tnit.multiVendorAllowed) {
                        return res.status(200).json({ error: 'Cancellation settings are not available for single vendor model. Please contact TNIT to enable this feature.' })
                    }
                    // Check if admin disabled this for property owner >>>>>>>>>>>>>>
                    if (!settings.admin.cancellation.letOwnerManageCancellation) {
                        return res.status(500).json({ error: 'Please enable let property owner manage cancellation in settings to manage this.' })
                    }
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: new mongoose.Types.ObjectId(req.query.id) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await villasModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                'cancellation.allowCancellation': 1,
                                'name': 1
                            }
                        }
                    ]);

                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Cancellation settings not found.' });
                    }
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching cancellation settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
