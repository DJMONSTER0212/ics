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
                    'verification.verified': fields.verified,
                    'verification.verificationFailReason': fields.verificationFailReason || '',
                }
                // Fetch settings >>>>>>>>>>>>>>>>
                let settings;
                try {
                    settings = await settingsModel.findOne().lean()
                } catch (error) {
                    return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
                // Multivendor logics >>>>>>>>>>>>>>>>
                if (!settings.tnit.multiVendorAllowed) {
                    return res.status(200).json({ error: 'Verification settings are not available for single vendor model. Please contact TNIT to enable multi vendor.' })
                }

                // If verification fail reason exists then reset submit for verification & documents
                if (fields.verified == 'false') {
                    updateFields['verification.submitForVerification'] = false;
                    updateFields['verification.verificationDocument'] = '';
                    updateFields['verification.verified'] = false;
                }
                // Updating data >>>>>>>>>>>>>>
                try {
                    await villasModel.updateOne({ _id: req.query.id }, { $set: updateFields });
                    return res.status(200).json({ success: 'Verification status has been updated successfully', updatedFields: updateFields })
                } catch (error) {
                    return res.status(500).json({ error: `Updating verification status failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
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
                        return res.status(200).json({ error: 'Verification settings are not available for single vendor model. Please contact TNIT to enable this feature.' })
                    }

                    // To set match query >>>>>>>>>>>>>>>>
                    const { id } = req.query;
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await villasModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                verification: 1,
                                name: 1
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
                    return res.status(500).json({ error: `Fetching villa verification status failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
