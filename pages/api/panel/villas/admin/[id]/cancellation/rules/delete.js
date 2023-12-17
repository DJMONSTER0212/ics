import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
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
            // Checking for total available rules because at least one rule is required.
            try {
                const villa = await villasModel.findOne({ _id: req.query.id }).lean();
                if (villa.cancellation.cancellationRules.length == 1) {
                    return res.status(500).json({ error: `At least one cancellation rule is required.` })
                }
            } catch (error) {
                return res.status(500).json({ error: `Checking for total available rule failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
            // Deleting data >>>>>>>>>>>>>>
            try {
                await villasModel.updateOne(
                    { _id: req.query.id },
                    { $pull: { 'cancellation.cancellationRules': { _id: req.body._id } } }
                ); return res.status(200).json({ success: 'Cancellation rule has been deleted successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Deleting cancellation rule failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
