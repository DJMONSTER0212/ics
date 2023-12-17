import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import settingsModel from "@/models/settings.model";
import villasModel from "@/models/villas.model";
import hotelsModel from "@/models/hotels.model";
import usersModel from "@/models/users.model";

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
            if (!session || session.user.role != 'tnit') {
                return res.status(401).json({ error: "You must be signed in as tnit to view the protected content on this page.", })
            }
            // Logics
            if (req.method == 'POST') {
                try {
                    // Fetch settings >>>>>>>>>>>>>
                    let settings;
                    try {
                        settings = await settingsModel.findOne().lean();
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                    // Setting update fields >>>>>>>>>>>>>>
                    const updateFields = {
                        'tnit.limitMaxVillas': fields.limitMaxVillas,
                        'tnit.maxVillas': fields.maxVillas,
                        'tnit.limitMaxHotels': fields.limitMaxHotels,
                        'tnit.maxHotels': fields.maxHotels,
                        'tnit.multiVendorAllowed': fields.multiVendorAllowed,
                        'tnit.limitMaxVendors': fields.limitMaxVendors,
                        'tnit.maxVendors': fields.maxVendors,
                    }
                    // To check that max villas is not less than current villas >>>>>>>>>>>>>>
                    if (fields.maxVillas) {
                        try {
                            const createdVillas = await villasModel.countDocuments({ trash: { $ne: true } });
                            if (createdVillas > fields.maxVillas) {
                                return res.status(500).json({ error: `Already ${createdVillas} villas are available. Please remove ${Number(createdVillas) - Number(fields.maxVillas)} villas and try again.` });
                            }
                        } catch (error) {
                            return res.status(500).json({ error: `Unable to check created villas. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                        }
                    }
                    // To check that max hotels is not less than current hotels >>>>>>>>>>>>>>
                    if (fields.maxHotels) {
                        try {
                            const createdHotels = await hotelsModel.countDocuments({ trash: { $ne: true } });
                            if (createdHotels > fields.maxHotels) {
                                return res.status(500).json({ error: `Already ${createdHotels} hotels are available. Please remove ${Number(createdHotels) - Number(fields.maxHotels)} hotels and try again.` });
                            }
                        } catch (error) {
                            return res.status(500).json({ error: `Unable to check created hotels. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                        }
                    }
                    // Cheking total vendors >>>>>>>>>>>>>>
                    const totalVendors = await usersModel.countDocuments({ role: { $in: ['admin', 'vendor'] } });
                    // To check if TNIT enables multi vendor model >>>>>>>>>>>>>>
                    if (fields.multiVendorAllowed == 'true') {
                        // To set max vendor limit by checking current vendors >>>>>>>>>>>>>>
                        if (fields.limitMaxVendors == 'true') {
                            if (Number(totalVendors) > Number(fields.maxVendors)) {
                                return res.status(500).json({ error: `Already ${totalVendors} vendors are available. Please remove ${Number(totalVendors) - Number(fields.maxVendors)} vendors and try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                            }
                        }
                    }
                    // To check if TNIT disables multi vendor model >>>>>>>>>>>>>>
                    if (fields.multiVendorAllowed == 'false' && settings.tnit.multiVendorAllowed) {
                        // To check if multiple vendors are there then update owner of properties
                        if (totalVendors > 1) {
                            if (!fields.adminId) {
                                return res.status(500).json({ error: `Please select a user to transfer all properties. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                            }
                            // Shift settings to single vendor model
                            try {
                                await settingsModel.updateMany({}, {
                                    $set:
                                    {
                                        'admin.property.autoVerifyVilla': true,
                                        'admin.property.autoVerifyHotel': true,
                                        'admin.property.letOwnerManageReviews': true,
                                        'admin.property.reviewsAllowed': true,
                                        'admin.booking.enableBookingsVilla': true,
                                        'admin.booking.enableBookingsHotel': true,
                                        'admin.booking.letOwnerManageMinimumPriceToBook': true,
                                        'admin.cancellation.letOwnerManageCancellation': true,
                                    }
                                });
                            } catch (error) {
                                return res.status(500).json({ error: `Enabling auto verification for properties failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                            }
                            // Transfer all the villas to admin selected by tnit
                            try {
                                await villasModel.updateMany({}, { $set: { userId: fields.adminId, 'verification.verified': true, 'verification.submitForVerification': true, } });
                            } catch (error) {
                                return res.status(500).json({ error: `Transferring villas failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                            }
                            // Transfer all the hotels to admin selected by tnit
                            try {
                                await hotelsModel.updateMany({}, { $set: { userId: fields.adminId, 'verification.verified': true } });
                            } catch (error) {
                                return res.status(500).json({ error: `Transferring hotels failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                            }
                        }
                        // Make all vendors, vendor support user, vendor manager and admins a normal user 
                        try {
                            await usersModel.updateMany(
                                {
                                    $or: [
                                        { _id: { $ne: fields.adminId }, role: { $in: ['admin', 'vendor'] } },
                                        { role: { $in: ['support_vendor', 'manager_vendor'] }, vendorId: { $exists: true } }
                                    ]
                                },
                                {
                                    $set: { role: 'user' },
                                    $unset: { vendorId: "" }
                                }
                            );
                        } catch (error) {
                            return res.status(500).json({ error: `Transferring roles failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                        }
                    }
                    // Update settings >>>>>>>>>>>>>>
                    await settingsModel.updateOne({}, { $set: updateFields }).exec()
                    return res.status(200).json({ success: 'Vendor settings has been added successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating vendor settings failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
