import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import amenitiesModel from "@/models/amenities.model";
import { s3 } from '@/conf/s3/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

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
            if (req.method == 'POST') {
                try {
                    const updateFields = {
                        name: fields.name,
                    }
                    // Image file handling >>>>>>>>>>
                    if (files.image) {
                        // Creating uninque name
                        const fileExtension = path.extname(files.image.originalFilename);
                        const timestamp = Date.now();
                        const randomCode = crypto.randomBytes(16).toString('hex');
                        const fileName = `${process.env.S3_PATH}/amenities/${timestamp}-${randomCode}${fileExtension}`;
                        // Making upload command
                        const command = new PutObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: fileName,
                            Body: fs.createReadStream(files.image.filepath),
                            ContentType: files.image.mimetype,
                        });
                        // Uploading file
                        try {
                            await s3.send(command);
                        } catch (error) {
                            return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                        // Adding image address in database
                        updateFields.image = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                    }
                    // Adding amenity >>>>>>>>>>
                    try {
                        const newAmenity = new amenitiesModel(updateFields)
                        await newAmenity.save();
                        return res.status(200).json({ success: 'Amenity has been added successfully' })
                    } catch (error) {
                        return res.status(500).json({ error: `Adding amenity failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { pageIndex, maxResult, search, searchOption } = req.query;
                    const queryRegx = new RegExp(`.*${search}.*`, "i");
                    let matchQuery = {} // For normal request
                    let SearchMatchQuery = {} // For search
                    switch (searchOption) {
                        case 'all':
                            SearchMatchQuery.name = { $regex: queryRegx };
                            break;
                        default:
                            SearchMatchQuery.name = { $regex: queryRegx };
                            break;
                    }
                    const sortQuery = { name: 1 };
                    const data = await amenitiesModel.aggregate([
                        { $match: search ? SearchMatchQuery : matchQuery },
                        { $sort: sortQuery },
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
                    ]);
                    const totalRow = await amenitiesModel.countDocuments(search ? SearchMatchQuery : matchQuery);
                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
