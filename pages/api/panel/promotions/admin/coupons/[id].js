import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import couponsModel from "@/models/coupons.model";

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
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            // Logics
            if (req.method == 'POST') {
                const updateFields = {
                    couponCode: fields.couponCode,
                    shortDesc: fields.shortDesc,
                    type: fields.type,
                    validOn: fields.validOn,
                    priceType: fields.priceType,
                    priceIn: fields.priceIn,
                    price: fields.price,
                    maxUses: fields.maxUses,
                    expirationDate: fields.expirationDate,
                    allowMultipleUses: fields.allowMultipleUses,
                    makePublic: fields.makePublic
                }
                // To check for existing coupon with same code
                let coupon;
                try {
                    coupon = await couponsModel.findOne({ couponCode: updateFields.couponCode, _id: { $ne: req.query.id } }).lean();
                    if (coupon) {
                        return res.status(500).json({ error: 'Coupon with same code already exists.' })
                    }
                } catch (error) {
                    return res.status(500).json({ error: `Checking for existing same coupon with this code failed. :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
                // To check coupon type
                switch (fields.type) {
                    case 'userOnly':
                        if (fields.userId) {
                            updateFields.userId = fields.userId;
                        } else {
                            return res.status(500).json({ error: `Please select a user for user only coupon.` });
                        }
                        break;
                    default:
                        break;
                }
                // To check coupon valid on
                switch (fields.validOn) {
                    case 'villa':
                        if (fields.villaId) {
                            updateFields.villaId = fields.villaId;
                        } else {
                            return res.status(500).json({ error: `Please select a villa for villa only coupon.` });
                        }
                        break;
                    case 'hotel':
                        if (fields.hotelId) {
                            updateFields.hotelId = fields.hotelId;
                        } else {
                            return res.status(500).json({ error: `Please select a hotel for hotel only coupon.` });
                        }
                        break;
                    default:
                        break;
                }
                // To check price type
                switch (fields.priceType) {
                    case 'upto':
                        if (fields.maxPrice) {
                            updateFields.maxPrice = Number(fields.maxPrice);
                        } else {
                            return res.status(500).json({ error: `Max price is required for a "discount upto" coupon.` });
                        }
                        break;
                    default:
                        break;
                }
                // Updating coupon
                try {
                    await couponsModel.updateOne({ _id: req.query.id, trash: { $ne: true } }, { $set: updateFields })
                    return res.status(200).json({ success: 'Coupon has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating coupon failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                const { id } = req.query;
                try {
                    const couponCode = await couponsModel.findOne({ _id: id, trash: { $ne: true } }).populate('userId').populate('villaId').lean()
                    if (!couponCode) {
                        return res.status(200).json({ error: 'Coupon not found.' });
                    }
                    return res.status(200).json({ data: couponCode });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching coupon failed. :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
