import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";
import addonsModel from "@/models/addons.model";
import couponsModel from "@/models/coupons.model";
import paymentsModel from "@/models/payments.model";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import villaBookingsModel from "@/models/villaBookings.model";
import villasModel from "@/models/villas.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        // Unauthorized access
        const session = await getServerSession(req, res, authOptions)
        if (!session || session.user.role != 'tnit') {
            return res.status(401).json({ error: "You must be signed in as tnit to view the protected content on this page.", })
        }
        // API handling
        if (req.method == 'POST') {
            // Fetch user >>>>>>>>>>>>>>
            let user;
            try {
                user = await usersModel.findOne({ _id: req.body._id }).lean();
            } catch (error) {
                return res.status(500).json({ error: `Fetching user failed. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
            // To check user exist or not >>>>>>>>>>>>>>
            if (user.length == 0) {
                return res.status(500).json({ error: `User not found` })
            }
            // To prevent blocking TNIT >>>>>>>>>>>>>>
            if (user.role == 'tnit') {
                return res.status(500).json({ error: 'You can not delete a user whose role is TNIT' })
            }
            // To prevent self deletion >>>>>>>>>>>>>>
            if (user._id == session.user._id) {
                return res.status(500).json({ error: 'You cannot delete yourself' })
            }
            // Check if user admin want to transfer the data id this user >>>>>>>>>>>>>>
            if (req.body.adminId != '') {
                // Transfer all the data to the selected admin/vendor >>>>>>>>>>>>>>
                // Transfer all the villas to admin selected by tnit
                try {
                    await villasModel.updateMany({ userId: req.body._id }, { $set: { userId: req.body.adminId } });
                } catch (error) {
                    return res.status(500).json({ error: `Transferring villas failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                }
            }
            // Delete user data >>>>>>>>>>>>>>
            // Delete villas and villa data
            try {
                const villas = await villasModel.find({ userId: req.body._id });
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
            // Deleting user >>>>>>>>>>>>>>
            try {
                await usersModel.deleteOne({ _id: req.body._id })
                if (req.body.adminId != '') {
                    return res.status(200).json({ success: 'Data has been transferred and User has been deleted successfully' })
                } else {
                    return res.status(200).json({ success: 'User has been deleted successfully' })
                }
            } catch (error) {
                return res.status(500).json({ error: `Deleting user failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else if (req.method == 'GET') {
            return res.status(404).json({ error: `Page not found` });
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
