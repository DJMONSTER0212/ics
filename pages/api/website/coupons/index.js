import connectDB from "@/conf/database/dbConfig";
import couponsModel from "@/models/coupons.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        // Get session
        const session = await getServerSession(req, res, authOptions)
        // Logics
        if (req.method == 'GET') {
            try {
                // Setting pipeline >>>>>>>>>>>>>>>>>
                const pipeline = [
                    {
                        $match: {
                            status: true,
                            makePublic: true,
                            expirationDate: { $gte: new Date() },
                            $expr: { $gt: ["$maxUses", { $size: "$usedByUsers" }] },
                            type: { $in: ['regular'] },
                            validOn: { $in: ['all'] },
                            trash: { $ne: true }
                        }
                    },
                ]
                // Set type and data related to them
                if (session && session.user._id) {
                    pipeline[0].$match.type.$in.push('userOnly');
                    pipeline[0].$match.userId = mongoose.Types.ObjectId(session.user._id);
                }
                // Set 'valid on' and data related to them
                if (req.query.villaId) {
                    pipeline[0].$match.validOn.$in.push('villa');
                    pipeline[0].$match.villaId = mongoose.Types.ObjectId(req.query.villaId);
                }
                if (req.query.hotelId) {
                    pipeline[0].$match.validOn.$in.push('hotel');
                    pipeline[0].$match.hotelId = mongoose.Types.ObjectId(req.query.hotelId);
                }

                // Set limit
                if (req.query.limit) {
                    pipeline.push({ $limit: Number(req.query.limit) })
                }

                // Fetch coupons >>>>>>>>>>>>>>>>>
                var coupons;
                try {
                    coupons = await couponsModel.aggregate(pipeline);
                } catch (error) {
                    return res.status(500).json({ error: `Fetching coupons failed ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
                return res.status(200).json({ data: coupons });
            } catch (error) {
                return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
