import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import settingsModel from '@/models/settings.model'
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
                    'userId': fields.userId,
                }
                // Multivendor logics
                const settings = await settingsModel.findOne().lean()
                if (!settings.tnit.multiVendorAllowed) {
                    return res.status(200).json({ error: 'Ownership transfer is not available for single vendor model. Please contact TNIT to enable multi vendor.' })
                }
                // Updating villa owner >>>>>>>>>>>>>>
                try {
                    await villasModel.updateOne({ _id: fields._id }, { $set: updateFields });
                    return res.status(200).json({ success: 'Ownership transferred successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Ownership transfer failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    // Fetch settings >>>>>>>>>>>>>>>>
                    let settings;
                    try {
                        settings = await settingsModel.findOne().lean()
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                    }
                    // Multivendor logics >>>>>>>>>>>>>>>>
                    if (!settings.tnit.multiVendorAllowed) {
                        return res.status(200).json({ error: 'Ownership transfer is not available for single vendor model. Please contact TNIT to enable multi vendor.' })
                    }
                    // To set match query >>>>>>>>>>>>>>>>
                    const { id } = req.query;
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await villasModel.aggregate([
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
                            $project: {
                                userId: 1,
                                user: 1,
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Villa not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching ownership details failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
