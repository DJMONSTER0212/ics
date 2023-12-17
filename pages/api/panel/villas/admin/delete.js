import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import paymentsModel from "@/models/payments.model";
import villaBookingsModel from "@/models/villaBookings.model";
import couponsModel from "@/models/coupons.model";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import addonsModel from "@/models/addons.model";
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
            // Deleting Bookings for this villa
            try {
                await villaBookingsModel.updateMany({ villaId: req.body._id }, { $set: { trash: true } })
            } catch (error) {
                return res.status(500).json({ error: `Deleting bookings for this villa failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Deleting payments for this villa
            try {
                await paymentsModel.updateMany({ villaId: req.body._id }, { $set: { trash: true } })
            } catch (error) {
                // Reverting changes
                await villaBookingsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                return res.status(500).json({ error: `Deleting payments for this villa failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Deleting coupons for this villa
            try {
                await couponsModel.updateMany({ villaId: req.body._id, validOn: 'villa' }, { $set: { trash: true } })
            } catch (error) {
                // Reverting changes
                await villaBookingsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await paymentsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                return res.status(500).json({ error: `Deleting coupons for this villa failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Deleting addons for this villa
            try {
                await addonsModel.updateMany({ villaId: req.body._id }, { $set: { trash: true } })
            } catch (error) {
                // Reverting changes
                await villaBookingsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await paymentsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await couponsModel.updateMany({ villaId: req.body._id, validOn: 'villa' }, { $set: { trash: false } })
                return res.status(500).json({ error: `Deleting coupons for this villa failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Deleting seasonal pricing for this villa
            try {
                await seasonalPricingsModel.updateMany({ villaId: req.body._id }, { $set: { trash: true } })
            } catch (error) {
                // Reverting changes
                await villaBookingsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await paymentsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await couponsModel.updateMany({ villaId: req.body._id, validOn: 'villa' }, { $set: { trash: false } })
                await addonsModel.updateMany({ villaId: req.body._id }, { $set: { trash: false } })
                return res.status(500).json({ error: `Deleting coupons for this villa failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
            // Deleting villas
            try {
                await villasModel.updateOne({ _id: req.body._id }, { $set: { trash: true } })
                return res.status(200).json({ success: 'Villa has been deleted successfully' })
            } catch (error) {
                // Reverting changes
                await villaBookingsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await paymentsModel.updateOne({ villaId: req.body._id }, { $set: { trash: false } })
                await couponsModel.updateMany({ villaId: req.body._id, validOn: 'villa' }, { $set: { trash: false } })
                await addonsModel.updateMany({ villaId: req.body._id }, { $set: { trash: false } })
                await seasonalPricingsModel.updateMany({ villaId: req.body._id }, { $set: { trash: false } })
                return res.status(500).json({ error: `Deleting villa failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `404 Not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
    }
}
