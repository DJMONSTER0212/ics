import connectDB from "@/conf/database/dbConfig";
import settingsModel from "@/models/settings.model";
import usersModel from "@/models/users.model";
import bcrypt from 'bcrypt';

// Database 
connectDB()

export default async function handler(req, res) {
    // Logics
    if (req.method == 'GET') {
        try {
            // Fetch settings >>>>>>>>>>>>>
            let settings;
            try {
                settings = await settingsModel.findOne().select({ website: 1 }).lean();
            } catch (error) {
                return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
            }
            // Gnerate default settings and tnit user account if not found >>>>>>>>>>>>>
            if (!settings) {
                // Gnerate default settings
                settings = await new settingsModel().save();
                // Create TNIT role user
                await new usersModel({
                    name: 'TNIT',
                    email: 'tnit@tnitservices.com',
                    phone: '8652290747',
                    block: false,
                    verified: true,
                    password: bcrypt.hashSync('tnit@1234', 10),
                    role: 'tnit',
                }).save();
            }
            return res.status(200).json(settings);
        } catch (error) {
            return res.status(400).json({ error: `Something went erong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } else {
        return res.status(404).json({ error: `Page not found` });
    }
}
