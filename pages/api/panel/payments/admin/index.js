import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import paymentsModel from "@/models/payments.model";
import usersModel from "@/models/users.model";
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
            // Unauthorized access >>>>>>>>>>>>>>>
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({
                    error: "You must be signed in as admin to view the protected content on this page.",
                })
            }
            // Logics >>>>>>>>>>>>>>>
            if (req.method == 'POST') {
                let updateFields = {
                    type: fields.type,
                    src: fields.src,
                    userId: fields.userId,
                    paidFor: fields.paidFor,
                    range: fields.range,
                    price: fields.price,
                    paymentDate: fields.paymentDate,
                    paymentNote: fields.paymentNote,
                    status: fields.status,
                }
                // Add src description if src is other >>>>>>>>>>
                switch (fields.src) {
                    case 'razorpay':
                        updateFields.razorpay = {
                            orderId: fields.orderId,
                            paymentId: fields.paymentId,
                        };
                        break;
                    case 'upi':
                        updateFields.upi = {
                            refNo: fields.refNo
                        }
                        break;
                    case 'other':
                        updateFields.srcDesc = fields.srcDesc;
                        break;
                    default:
                        break;
                }
                // Check paid for and add relevent details >>>>>>>>>>
                if (fields.paidFor == 'villa') {
                    updateFields.villaId = fields.villaId;
                    updateFields.villaBookingId = fields.villaBookingId;
                }
                // Create payment >>>>>>>>>>>>>
                try {
                    const newPaymnet = new paymentsModel(updateFields)
                    await newPaymnet.save();
                    return res.status(200).json({ success: 'Payment has been added successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Adding payment failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { pageIndex, maxResult, search, searchOption, paymentType } = req.query;
                    // To set search query [For search, searchOption] >>>>>>>>>>>>>>>
                    let searchQuery = {};
                    const queryRegx = new RegExp(`.*${search}.*`, "i");
                    switch (searchOption) {
                        case 'paymentId':
                            searchQuery = {
                                $or: [
                                    { 'razorpay.paymentId': { $regex: queryRegx } },
                                    { 'upi.refNo': { $regex: queryRegx } },
                                ]
                            }
                            break;
                        case 'bookingId':
                            searchQuery = {
                                $or: [
                                    { 'villaBookingId': mongoose.Types.ObjectId(search) },
                                    { 'hotelBookingId': mongoose.Types.ObjectId(search) },
                                ]
                            }
                            break;
                        case 'userId':
                            const users = await usersModel.find({
                                $or: [
                                    { name: { $regex: queryRegx } },
                                    { email: { $regex: queryRegx } },
                                ]
                            }).lean();
                            const userIds = users.map(user => user._id);
                            searchQuery = {
                                userId: { $in: userIds },
                            }
                            break;
                        case 'villaId':
                            const villas = await villasModel.find({
                                $or: [
                                    { name: { $regex: queryRegx } },
                                ]
                            }).lean();
                            const villaIds = villas.map(villa => villa._id);
                            searchQuery = {
                                villaId: { $in: villaIds },
                            }
                            break;
                        default:
                            searchQuery = {
                                $or: [
                                    { 'razorpay.paymentId': { $regex: queryRegx } },
                                    { 'upi.refNo': { $regex: queryRegx } },
                                ]
                            }
                            break;
                    }
                    // To set match query [For bookingType] >>>>>>>>>>>>>>>
                    let matchQuery = {};
                    switch (paymentType) {
                        case 'all':
                            matchQuery = {
                                trash: { $ne: true }
                            }
                            break;
                        case 'successful':
                            matchQuery = {
                                'status': 'successful',
                                trash: { $ne: true }
                            }
                            break;
                        case 'pending':
                            matchQuery = {
                                'status': 'pending',
                                trash: { $ne: true }
                            }
                            break;
                        case 'failed':
                            matchQuery = {
                                'status': 'failed',
                                trash: { $ne: true }
                            }
                            break;
                        case 'refund':
                            matchQuery = {
                                'type': 'refund',
                                trash: { $ne: true }
                            }
                            break;
                        default:
                            matchQuery = {
                                trash: { $ne: true }
                            }
                            break;
                    }
                    // To sort results >>>>>>>>>>>>>>>
                    const sortQuery = { name: 1 };
                    const data = await paymentsModel.aggregate([
                        { $match: search ? searchQuery : {} },
                        { $match: matchQuery ? matchQuery : {} },
                        { $sort: sortQuery },
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'user'
                            }
                        },
                        { $unwind: '$user' },
                        {
                            $lookup: {
                                from: 'villas',
                                localField: 'villaId',
                                foreignField: '_id',
                                as: 'villa'
                            }
                        },
                        { $unwind: '$villa' },
                        {
                            $lookup: {
                                from: 'locations',
                                localField: 'villa.locationId',
                                foreignField: '_id',
                                as: 'villa.location'
                            }
                        },
                        { $unwind: '$villa.location' },
                    ]);
                    // To count results >>>>>>>>>>>>>>>
                    const totalRow = await paymentsModel.countDocuments({
                        $and: [
                            search ? searchQuery : {},
                            matchQuery ? matchQuery : {}
                        ]
                    });
                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching payments failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
