import connectDB from "@/conf/database/dbConfig";
import locationsModel from "@/models/locations.model";
import villasModel from "@/models/villas.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions)
        // Unauthorized access
        if (!session || session.user.role != 'admin') {
            return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
        }
        // Logics
        if (req.method == 'POST') {
            // Check for existing villas which are not in trash
            try {
                const totalVillas = await villasModel.countDocuments({ location: req.body._id, trash: { $ne: true } })
                if (totalVillas > 0) {
                    return res.status(500).json({ error: `This location has villas. Please delete villas first.` })
                }
            } catch (error) {
                return res.status(500).json({ error: `Fetching total villas failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Delete villas in trash for this location
            try {
                const villas = await villasModel.find({ location: req.body._id, trash: true });
                villas.forEach(async (villa) => {
                    await addonsModel.deleteMany({ villaId: villa._id });
                    await couponsModel.deleteMany({ villaId: villa._id, validOn: 'villa' });
                    await paymentsModel.deleteMany({ villaId: villa._id, paidFor: 'villa' });
                    await seasonalPricingsModel.deleteMany({ villaId: villa._id });
                    await villaBookingsModel.deleteMany({ villaId: villa._id });
                    await villasModel.deleteOne({ _id: villa._id });
                });
            } catch (error) {
                return res.status(500).json({ error: `Deleting villas and villa data failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
            }
            // Deleting location
            try {
                await locationsModel.deleteOne({ _id: req.body._id })
                return res.status(200).json({ success: 'Location has been deleted successfully' })
            } catch (error) {
                return res.status(500).json({ error: `Deletings location failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `404 Not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
    }
}
