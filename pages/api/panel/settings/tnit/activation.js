import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import settingsModel from "@/models/settings.model";

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
    form.parse(req, async (err, fields, files) => {
        try {
            const session = await getServerSession(req, res, authOptions)
            // Unauthorized access
            if (!session || session.user.role != 'tnit') {
                return res.status(401).json({ error: "You must be signed in as TNIT to view the protected content on this page." })
            }
            // Logics
            if (req.method == 'POST') {
                try {
                    // Setting update fields >>>>>>>>>>>>>>
                    const updateFields = {
                        'tnit.activateWebsite': fields.activateWebsite,
                    }
                    // Updating >>>>>>>>>>>>>>
                    await settingsModel.updateOne({}, { $set: updateFields }).exec()
                    return res.status(200).json({ success: 'Activation setting has been added successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating activation setting failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
