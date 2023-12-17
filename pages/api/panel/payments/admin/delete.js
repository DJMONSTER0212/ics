import connectDB from "@/conf/database/dbConfig";
import paymentsModel from "@/models/payments.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions)
        // Unauthorized access
        if (!session || session.user.role != 'admin') {
            return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
        }
        // Logics
        if (req.method == 'POST') {
            // Deleting Student work
            try {
                await paymentsModel.deleteOne({ _id: req.body._id })
                return res.status(200).json({ success: 'Payment has been deleted successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Deleting payment failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `404 Not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
    }
}
