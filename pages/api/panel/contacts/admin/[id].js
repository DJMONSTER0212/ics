import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import contactsModel from "@/models/contacts.model";
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
    form.uploadDir = path.join(process.cwd(), 'public/panel/uploads');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        try {
            const session = await getServerSession(req, res, authOptions)
            // Unauthorized access
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            // Logics
            if (req.method == 'POST') {
                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    replied: fields.replied,
                }
                // Updating
                try {
                    await contactsModel.updateOne({ _id: req.query.id }, { $set: { ...updateFields } })
                    return res.status(200).json({ success: 'Status has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating status failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { id } = req.query;
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await contactsModel.aggregate([
                        { $match: matchQuery },
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Query not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
        }
    });
}
