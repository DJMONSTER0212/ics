import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import addonsModel from "@/models/addons.model";
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
                    shortDesc: fields.shortDesc || '',
                    price: fields.price,
                    villaId: req.query.id,
                }
                // Check villa id >>>>>>>>>>>>>>
                if (!req.query.id || (req.query.id == '123456789012' || req.query.id == '313233343536373839303132') || !mongoose.isValidObjectId(req.query.id)) {
                    return res.status(500).json({ error: `Please provide a valid villa id` });
                }
                // Updating addon >>>>>>>>>>>>>>
                try {
                    await addonsModel.updateOne({ _id: req.query.addonId }, { $set: updateFields })
                    return res.status(200).json({ success: 'Addon has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating addon failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { addonId } = req.query;
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(addonId) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await addonsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Addon not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching addon failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
