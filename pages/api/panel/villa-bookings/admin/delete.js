import connectDB from "@/conf/database/dbConfig";
import villaBookingsModel from "@/models/villaBookings.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        // Unauthorized access
        const session = await getServerSession(req, res, authOptions)
        if (!session || session.user.role != 'admin') {
            return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
        }
        // Logics
        if (req.method == 'POST') {
            // Deleting villa booking
            try {
                await villaBookingsModel.deleteOne({ _id: req.body._id })
                return res.status(200).json({ success: 'Booking has been deleted successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Deleting booking failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `404 Not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
    }
}
