import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
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
    form.parse(req, async (error, fields, files) => {
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
                try {
                    // Setting update fields >>>>>>>>>>>>>>
                    var updateFields = {
                        'admin.booking.enableBookingsVilla': fields.enableBookingsVilla,
                        'admin.booking.enableBookingsHotel': fields.enableBookingsHotel,
                        'admin.booking.minimumPriceToBook': fields.minimumPriceToBook,
                        'admin.booking.checkInTime': fields.checkInTime,
                        'admin.booking.checkOutTime': fields.checkOutTime,
                    }
                    console.log(updateFields)
                    // Multi vendor logics >>>>>>>>>>>>>>
                    const settings = await settingsModel.findOne().select().lean();
                    if (settings.tnit.multiVendorAllowed) {
                        // Only allow these fields in multi vendor
                        updateFields['admin.booking.letOwnerManageMinimumPriceToBook'] = fields.letOwnerManageMinimumPriceToBook;
                    }
                    // Update setting >>>>>>>>>>>>>>
                    await settingsModel.updateOne({}, { $set: updateFields }).exec()
                    return res.status(200).json({ success: 'Property settings has been updated successfully.', updatedFields: updateFields })
                } catch (error) {
                    return res.status(500).json({ error: `Updating setting failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = {};
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await settingsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                'admin.booking': 1,
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Settings not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
