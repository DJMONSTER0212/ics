import connectDB from "@/conf/database/dbConfig";
import settingModel from "@/models/settings.model";
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
            const { templateType, templateId } = req.body;
            if (!templateId || !templateType) {
                return res.status(200).json({ error: 'Template Id and type is required' })
            }
            // Update query 
            let updateQuery = {};
            switch (templateType) {
                case 'otp':
                    updateQuery["login.otpMailTemplate"] = templateId;
                    break;
                case 'link':
                    updateQuery["login.linkMailTemplate"] = templateId;
                    break;
                default:
                    updateQuery["login.otpMailTemplate"] = templateId;
                    break;
                    break;
            }
            // Updating data
            try {
                await settingModel.updateOne({ $set: updateQuery })
                return res.status(200).json({ success: 'Template updated successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Template update failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
