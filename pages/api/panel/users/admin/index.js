import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";
import settingsModel from "@/models/settings.model";
import bcrypt from 'bcrypt';
import { s3 } from '@/conf/s3/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            // Logics
            if (req.method == 'POST') {
                let updateFields = {
                    name: fields.name,
                    email: fields.email,
                    phone: fields.phone,
                    dob: fields.dob,
                    anniversary: fields.anniversary,
                    image: fields.image,
                    block: fields.block,
                    verified: fields.verified,
                    password: fields.password,
                    role: fields.role,
                }
                // To check for existing user
                let user;
                try {
                    user = await usersModel.findOne({ email: fields.email }).lean();
                    if (user) {
                        return res.status(500).json({ error: 'User with this email already exists.' })
                    }
                } catch (error) {
                    return res.status(500).json({ error: `Checking for existing user with this email failed. :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
                // To check if role is tnit
                if (fields.role == 'tnit') {
                    return res.status(500).json({ error: 'You can not create a user with TNIT role' })
                }
                // To check tnit settings for max vendor limit
                if (fields.role == 'vendor' || fields.role == 'admin') {
                    let settings
                    try {
                        settings = await settingsModel.findOne().select({ tnit: 1 }).lean()
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching total number of admins & vendor failed ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                    }
                    // To check multi vendor model is on or not
                    if (!settings.tnit.multiVendorAllowed) {
                        return res.status(500).json({ error: `You are not allowed to create admin or vendor on single vendor model. Please contact TNIT to upgrade to multi vendor model` })
                    }
                    if (settings.tnit.limitMaxVendor == true) {
                        // To check max vendor or admin
                        const totalVendor = await usersModel.countDocuments({ role: { $in: ['admin', 'vendor'] } });
                        if (totalVendor >= settings.tnit.maxVendors) {
                            return res.status(500).json({ error: `Only ${settings.tnit.maxVendors} vendors or admins are allowed. To increase the number of total vendor please contact TNIT.` })
                        }
                    }
                }
                // To encrypt password using bcrypt
                updateFields.password = bcrypt.hashSync(updateFields.password, 10);
                // To delete image field if not uploaded one
                if (typeof updateFields.image == 'string') {
                    delete updateFields.image
                }
                // Image file handling
                if (files.image) {
                    // Creating uninque name
                    const fileExtension = path.extname(files.image.originalFilename);
                    const timestamp = Date.now();
                    const randomCode = crypto.randomBytes(16).toString('hex');
                    const fileName = `${process.env.S3_PATH}/users/${timestamp}-${randomCode}${fileExtension}`;
                    // Making upload command
                    const command = new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: fileName,
                        Body: fs.createReadStream(files.image.filepath),
                        ContentType: files.image.mimetype,
                    })
                    // Uploading file
                    try {
                        await s3.send(command);
                    } catch (error) {
                        return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                    // Adding image address in database
                    updateFields.image = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                }
                // Delete empty fields
                const deleteFields = (obj, fieldsToDelete) => {
                    fieldsToDelete.forEach((field) => {
                        if (obj.hasOwnProperty(field) && obj[field] === '') {
                            delete obj[field];
                        }
                    });
                    return obj;
                };
                updateFields = deleteFields(updateFields, ['dob', 'anniversary', 'phone']);
                // Adding user
                try {
                    const newUser = new usersModel(updateFields)
                    await newUser.save()
                    return res.status(200).json({ success: 'User has added successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Adding user failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }

            } else if (req.method == 'GET') {
                try {
                    const { pageIndex, maxResult, search, searchOption, userType } = req.query;
                    // To set search query [For search, searchOption]
                    let searchQuery = {};
                    const queryRegx = new RegExp(`.*${search}.*`, "i");
                    switch (searchOption) {
                        case 'all':
                            searchQuery = {
                                $or: [
                                    { name: { $regex: queryRegx } },
                                    { email: { $regex: queryRegx } },
                                    { phone: { $regex: queryRegx } }
                                ]
                            }
                            break;
                        case 'name':
                            searchQuery = {
                                $or: [
                                    { name: { $regex: queryRegx } },
                                ]
                            }
                            break;
                        case 'email':
                            searchQuery = {
                                $or: [
                                    { email: { $regex: queryRegx } }
                                ]
                            }
                            break;
                        case 'phone':
                            searchQuery = {
                                $or: [
                                    { phone: { $regex: queryRegx } }
                                ]
                            }
                            break;
                        default:
                            searchQuery = {
                                $or: [
                                    { name: { $regex: queryRegx } },
                                    { email: { $regex: queryRegx } },
                                    { phone: { $regex: queryRegx } }
                                ]
                            }
                            break;
                    }
                    // To set match query [For userType]
                    let matchQuery = {};
                    switch (userType) {
                        case 'all':
                            // To exclude users with role tnit
                            matchQuery = { role: { $ne: 'tnit' } }
                            break;
                        case 'adminVendor':
                            matchQuery = {
                                $or: [
                                    { role: { $in: ['admin', 'vendor'] } },
                                ],
                                block: false,
                                verified: true
                            }
                            break;
                        case 'blocked':
                            matchQuery = {
                                block: true
                            }
                            break;
                        case 'support_admin':
                            matchQuery = {
                                role: 'support_admin'
                            }
                            break;
                        default:
                            // To exclude users with role tnit
                            matchQuery = { role: { $ne: 'tnit' } }
                            break;
                    }
                    // To sort results
                    const sortQuery = { name: 1 };
                    const data = await usersModel.aggregate([
                        { $match: search ? searchQuery : {} },
                        { $match: matchQuery ? matchQuery : {} },
                        { $sort: sortQuery },
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
                        { $project: { _id: 1, name: 1, email: 1, image: 1, block: 1, verified: 1, role: 1, createdAt: 1 } }
                    ]);
                    // To count results
                    const totalRow = await usersModel.countDocuments({
                        $and: [
                            search ? searchQuery : {},
                            matchQuery ? matchQuery : {}
                        ]
                    });
                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching users failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
