import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import mongoose from 'mongoose';

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
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            if (req.method == 'POST') {
                // Parse hostInfo object
                fields.hostInfo = JSON.parse(fields.hostInfo)
                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    'hostInfo': {
                        'name': fields.hostInfo.name,
                        'phone': fields.hostInfo.phone,
                        'email': fields.hostInfo.email,
                    }
                }

                // Updating villa host info >>>>>>>>>>>>>>
                try {
                    await villasModel.updateOne({ _id: fields._id }, { $set: updateFields });
                    return res.status(200).json({ success: 'Host information has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating host information failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { id } = req.query;
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await villasModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                hostInfo: 1,
                                name: 1
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Villa not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching villa host info failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
