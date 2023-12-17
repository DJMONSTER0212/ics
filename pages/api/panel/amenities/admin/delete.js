import connectDB from "@/conf/database/dbConfig";
import amenitiesModel from "@/models/amenities.model";
import villasModel from "@/models/villas.model";
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
            // Delete amenity from hotels and villas
            try {
                await villasModel.updateMany(
                    { amenities: { $in: [req.body._id] } },
                    { $pull: { amenities: req.body._id } },
                );
            } catch (error) {
                return res.status(500).json({ error: `Removing amenity from villas failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Deleting amenity
            try {
                await amenitiesModel.deleteOne({ _id: req.body._id })
                return res.status(200).json({ success: 'Amenity has been deleted successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Deletings amenity failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `404 Not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
    }
}
