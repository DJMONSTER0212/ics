import connectDB from "@/conf/database/dbConfig";
import locationsModel from "@/models/locations.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

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
        if (req.method == 'GET') {
            try {
                let matchQuery;
                if (req.query.search != '') {
                    const queryRegx = new RegExp(`.*${req.query.search}.*`, "i");
                    matchQuery = { name: { $regex: queryRegx } };
                }
                // Fetching locations
                try {
                    const locations = await locationsModel.find(matchQuery ? matchQuery : {}).lean();
                    return res.status(200).json({ data: locations });
                } catch (error) {
                    return res.status(500).json({ error: `Searching locations failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } catch (error) {
                return res.status(500).json({ error: `Searching locations failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}