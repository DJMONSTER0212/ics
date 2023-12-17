import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import mongoose from 'mongoose';

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        // Unauthorized access
        const session = await getServerSession(req, res, authOptions)
        if (!session || session.user.role != 'admin') {
            return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
        }
        if (req.method == 'POST') {
            // Deleting seasonal pricing >>>>>>>>>>>>>>
            try {
                await seasonalPricingsModel.deleteOne({ _id: req.body._id })
                return res.status(200).json({ success: 'Seasonal pricing has been deleted successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Deleting seasonal pricing failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
