import connectDB from "@/conf/database/dbConfig";
import amenitiesModel from "@/models/amenities.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    // Unauthorized access
    const session = await getServerSession(req, res, authOptions)
    if (!session || session.user.role != 'admin') {
        return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
    }
    // Logics
    if (req.method == 'GET') {
        let matchQuery;
        if (req.query.search != '') {
            const queryRegx = new RegExp(`.*${req.query.search}.*`, "i");
            matchQuery = { name: { $regex: queryRegx } };
        }
        // Fetching amenities
        try {
            const amenities = await amenitiesModel.find(matchQuery ? matchQuery : {}).lean();
            return res.status(200).json({ data: amenities });
        } catch (error) {
            return res.status(500).json({ error: `Searching amenities failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
        }
    } else {
        return res.status(404).json({ error: `Page not found` });
    }
}
