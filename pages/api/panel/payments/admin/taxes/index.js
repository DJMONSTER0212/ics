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
                return res.status(401).json({
                    error: "You must be signed in as admin to view the protected content on this page.",
                })
            }
            // Logics
            if (req.method == 'POST') {
                const updateFields = {
                    name: fields.name,
                    price: fields.price,
                    applyOnVillas: fields.applyOnVillas,
                    applyOnHotels: fields.applyOnHotels
                }
                // Adding tax
                try {
                    const newTax = new taxesModel(updateFields)
                    await newTax.save();
                    return res.status(200).json({ success: 'Tax has been added successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Adding tax failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { pageIndex, maxResult, search, searchOption, taxType } = req.query;
                    // To set search query [For search, searchOption] >>>>>>>>>>>>>>>
                    let searchQuery = {};
                    const queryRegx = new RegExp(`.*${search}.*`, "i");
                    switch (searchOption) {
                        case 'name':
                            searchQuery = {
                                $or: [
                                    { name: { $regex: queryRegx } },
                                ]
                            }
                            break;
                        default:
                            searchQuery = {
                                $or: [
                                    { name: { $regex: queryRegx } },
                                ]
                            }
                            break;
                    }
                    // To set match query [For taxType] >>>>>>>>>>>>>>>
                    let matchQuery = {};
                    switch (taxType) {
                        case 'all':
                            matchQuery = {}
                            break;
                        case 'onHotels':
                            matchQuery = {
                                'applyOnHotels': true
                            }
                            break;
                        case 'onVillas':
                            matchQuery = {
                                'applyOnVillas': true,
                            }
                            break;
                        case 'inActive':
                            matchQuery = {
                                'applyOnVillas': false,
                                'applyOnHotels': false
                            }
                            break;
                        default:
                            matchQuery = {}
                            break;
                    }
                    // To sort results >>>>>>>>>>>>>>>
                    const sortQuery = { name: 1 };
                    const data = await taxesModel.aggregate([
                        { $match: search ? searchQuery : {} },
                        { $match: matchQuery ? matchQuery : {} },
                        { $sort: sortQuery },
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
                    ]);
                    // To count results >>>>>>>>>>>>>>>
                    const totalRow = await taxesModel.countDocuments({
                        $and: [
                            search ? searchQuery : {},
                            matchQuery ? matchQuery : {}
                        ]
                    });
                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching taxes failed. :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
