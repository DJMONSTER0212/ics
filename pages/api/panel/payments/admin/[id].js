import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import paymentsModel from "@/models/payments.model";
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
                const { id } = req.query;
                let updateFields = {
                    range: fields.range,
                    price: fields.price,
                    paymentDate: fields.paymentDate,
                    paymentNote: fields.paymentNote,
                    status: fields.status,
                }
                // Fetch payment to get src >>>>>>>>>>>
                let payment;
                try {
                    payment = await paymentsModel.findOne({ _id: id }).lean();
                } catch (error) {
                    return res.status(500).json({ error: `Fetching payment failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
                // Add src description if src is other >>>>>>>>>>
                switch (payment.src) {
                    case 'razorpay':
                        updateFields.razorpay = {
                            orderId: fields.orderId,
                            paymentId: fields.paymentId || '',
                        };
                        break;
                    case 'upi':
                        updateFields.upi = {
                            refNo: fields.refNo
                        }
                        break;
                    default:
                        break;
                }
                // Updating data >>>>>>>>>>>>>>
                try {
                    await paymentsModel.updateOne({ _id: id }, { $set: updateFields });
                    return res.status(200).json({ success: 'Payment has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating payment failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { id } = req.query;
                    // To set match query >>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // To sort results >>>>>>>>>>>>>>>
                    const data = await paymentsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
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
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching payment failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
