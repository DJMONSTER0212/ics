import connectDB from "@/conf/database/dbConfig";
import settingModel from "@/models/settings.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    // Unauthorized access
    if (!session || session.user.role != 'admin') {
        return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
    }
    // Logics
    if (req.method == 'GET') {
        try {
            // Fetch settings >>>>>>>>>>>>>
            const settings = await settingModel.findOne().lean();
            // Delete tnit settings
            delete settings.tnit;
            // Gnerate default settings if not found >>>>>>>>>>>>>
            if (!settings) {
                await new settingModel().save();
                return res.status(200).json(settings);
            }
            return res.status(200).json(settings);
        } catch (error) {
            return res.status(400).json({ error: `Something went erong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } else {
        return res.status(404).json({ error: `Page not found` });
    }
}
