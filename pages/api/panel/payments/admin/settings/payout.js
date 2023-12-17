import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]";
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
    form.parse(req, async (error, fields) => {
        // Checking for error in parsing
        if (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
        // API handling
        try {
            // Unauthorized access
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page." })
            }
            // Logics
            if (req.method == 'POST') {
                // Setting update fields >>>>>>>>>>>>>>
                var updateFields = {
                    'admin.payout.enablePayout': fields.enablePayout,
                    'admin.payout.payoutDay': fields.payoutDay,
                    'admin.payout.applyTds': fields.applyTds,
                    'admin.payout.tdsPrice': fields.tdsPrice,
                    'admin.payout.applyCommission': fields.applyCommission,
                    'admin.payout.commissionPrice': fields.commissionPrice,
                }
                // Multivendor logics >>>>>>>>>>>>>>
                try {
                    const settings = await settingsModel.findOne().lean()
                    if (!settings.tnit.multiVendorAllowed) {
                        return res.status(200).json({ error: 'Payouts are not available for single vendor model' })
                    }
                } catch (error) {
                    return res.status(500).json({ error: `Checking for multi vendor model failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
                // Update settings >>>>>>>>>>>>>>
                try {
                    await settingsModel.updateOne({}, { $set: updateFields }).exec()
                    return res.status(200).json({ success: 'Payout settings has been updated successfully.' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating payout setting failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                // Multivendor logics >>>>>>>>>>>>>>
                try {
                    const settings = await settingsModel.findOne().lean()
                    if (!settings.tnit.multiVendorAllowed) {
                        return res.status(200).json({ error: 'Commission settings are not available for single vendor model' })
                    }
                } catch (error) {
                    return res.status(500).json({ error: `Checking for multi vendor model failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
                // To set match query >>>>>>>>>>>>>>>>
                let matchQuery = {};
                // Fetching settings >>>>>>>>>>>>>>>>
                try {
                    const data = await settingsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                'admin.commission': 1,
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Settings not found.' });
                    }
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching payout settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
