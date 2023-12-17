import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions)
        // Unauthorized access
        if (!session || session.user.role != 'tnit') {
            return res.status(401).json({ error: "You must be signed in as tnit to view the protected content on this page.", })
        }
        // Logics
        if (req.method == 'GET') {
            try {
                const queryRegx = new RegExp(`.*${req.query.search}.*`, "i");
                // Search by name >>>>>>>>>>>>>>
                let matchQuery = { name: { $regex: queryRegx } };
                // Search by search options [Ex: Role] >>>>>>>>>>>>>>
                if (req.query.searchOption) {
                    matchQuery.role = req.query.searchOption;
                }
                // To search admin and vendors both >>>>>>>>>>>>>>
                if (req.query.adminVendor) {
                    matchQuery.role = { $in: ['admin', 'vendor'] };
                }
                // Search only active accounts >>>>>>>>>>>>>>
                if (req.query.activeAccounts) {
                    matchQuery.verified = true;
                    matchQuery.block = false;
                }
                // Fetching users >>>>>>>>>>>>>>
                const user = await usersModel.find(matchQuery).lean();
                return res.status(200).json({ data: user });
            } catch (error) {
                return res.status(500).json({ error: `Searching user failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
