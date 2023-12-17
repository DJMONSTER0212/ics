import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

// Database
connectDB()

export default async function handler(req, res) {
    const ical = require('ical');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = ical.parseICS('/listing-39378614.ics');
    console.log(data)
    try {
        // Unauthorized access
        const session = await getServerSession(req, res, authOptions)
        if (!session || session.user.role != 'admin') {
            return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
        }
        // Logics
        if (req.method == 'GET') {
            const { search, searchOption, villaType } = req.query;
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
                case 'location':
                    let locations;
                    try {
                        locations = await locationsModel.find({
                            $or: [
                                { name: { $regex: queryRegx } },
                            ]
                        }).lean();
                    } catch (error) {
                        return res.status(500).json({ error: `Searching location failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                    const locationIds = locations.map(location => location._id);
                    searchQuery = {
                        locationId: { $in: locationIds },
                    }
                    break;
                case 'host':
                    searchQuery = {
                        $or: [
                            { 'hostInfo.name': { $regex: queryRegx } },
                            { 'hostInfo.phone': { $regex: queryRegx } },
                            { 'hostInfo.email': { $regex: queryRegx } }
                        ]
                    }
                    break;
                case 'user':
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
                default:
                    searchQuery = {
                        $or: [
                            { name: { $regex: queryRegx } },
                            { email: { $regex: queryRegx } }
                        ]
                    }
                    break;
            }
            // To set match query [For villaType] >>>>>>>>>>>>>>>
            let matchQuery = {};
            switch (villaType) {
                case 'all':
                    matchQuery = {
                        trash: { $ne: true }
                    }
                    break;
                case 'verified':
                    matchQuery = {
                        'verification.verified': true,
                        trash: { $ne: true }

                    }
                    break;
                case 'notVerified':
                    matchQuery = {
                        'verification.verified': false,
                        trash: { $ne: true }

                    }
                    break;
                case 'submitForVerification':
                    matchQuery = {
                        'verification.verified': false,
                        'verification.submitForVerification': true,
                        trash: { $ne: true }

                    }
                    break;
                case 'block':
                    matchQuery = {
                        block: true,
                        trash: { $ne: true }

                    }
                    break;
                default:
                    matchQuery = {
                        trash: { $ne: true }
                    }
                    break;
            }
            // Fetch villas >>>>>>>>>>>>>>>
            try {
                // To sort results
                const sortQuery = { name: 1 };
                const data = await villasModel.aggregate([
                    { $match: search ? searchQuery : {} },
                    { $match: matchQuery ? matchQuery : {} },
                    { $sort: sortQuery },
                    {
                        $lookup: {
                            from: 'locations',
                            localField: 'locationId',
                            foreignField: '_id',
                            as: 'location'
                        }
                    },
                    { $unwind: '$location' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    { $unwind: '$user' },
                ]);
                return res.status(200).json({ data });
            } catch (error) {
                return res.status(500).json({ error: `Searching villas failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
