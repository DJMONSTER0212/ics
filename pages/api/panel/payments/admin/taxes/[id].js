import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import taxesModel from "@/models/taxes.model";

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
            // Logics
            if (req.method == 'POST') {
                const updateFields = {
                    name: fields.name,
                    price: fields.price,
                    applyOnVillas: fields.applyOnVillas,
                    applyOnHotels: fields.applyOnHotels
                }
                // updating tax
                try {
                    await taxesModel.updateOne({ _id: fields._id }, { $set: updateFields })
                    return res.status(200).json({ success: 'Tax has been updated successfully' })
                } catch (error) {
                    res.status(500).json({ error: `Updating tax failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                const { id } = req.query;
                try {
                    const data = await taxesModel.findById(id)
                    if (!data) {
                        return res.status(200).json({ error: 'Tax not found.' });
                    }
                    return res.status(200).json({ data });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching tax failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
