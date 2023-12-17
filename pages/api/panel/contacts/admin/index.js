import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import contactsModel from "@/models/contacts.model";
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
    form.uploadDir = path.join(process.cwd(), 'public/panel/uploads');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        try {
            const session = await getServerSession(req, res, authOptions)
            // Unauthorized access
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            // Logics
            if (req.method == 'GET') {
                try {
                    const { pageIndex, maxResult, search, searchOption, contactType } = req.query;
                    // To set search query [For search, searchOption]
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
                        case 'phone':
                            searchQuery = {
                                $or: [
                                    { phone: { $regex: queryRegx } },
                                ]
                            }
                            break;
                        case 'email':
                            searchQuery = {
                                $or: [
                                    { email: { $regex: queryRegx } },
                                ]
                            }
                            break;
                        default:
                            searchQuery = {
                                $or: [
                                    { name: { $regex: queryRegx } },
                                    { phone: { $regex: queryRegx } },
                                    { email: { $regex: queryRegx } },
                                ]
                            }
                            break;
                    }
                    // To set match query [For contactType]
                    let matchQuery = {};
                    switch (contactType) {
                        case 'all':
                            matchQuery = {}
                            break;
                        case 'unreplied':
                            matchQuery = {
                                replied: false,
                            }
                            break;
                        default:
                            matchQuery = {}
                            break;
                    }
                    // To sort results
                    const sortQuery = { addedAt: -1 };
                    const data = await contactsModel.aggregate([
                        { $match: search ? searchQuery : {} },
                        { $match: matchQuery ? matchQuery : {} },
                        { $sort: sortQuery },
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
                    ]);
                    // To count results
                    const totalRow = await contactsModel.countDocuments({
                        $and: [
                            search ? searchQuery : {},
                            matchQuery ? matchQuery : {}
                        ]
                    });

                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Somwthing went wrong ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
                }
            }else{
                return res.status(404).json({ error: "Page not found", })
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
        }
    })
}
