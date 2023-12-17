import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import homepageBannersModel from "@/models/homepageBanners.model";
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
                var updateField = {
                    'title': fields.title,
                    'ctaUrl': fields.ctaUrl,
                    'ctaName': fields.ctaName
                }
                // Image file handling >>>>>>>>>>>>>>
                if (files.image) {
                    // Creating uninque name
                    const fileExtension = path.extname(files.image.originalFilename);
                    const timestamp = Date.now();
                    const randomCode = crypto.randomBytes(16).toString('hex');
                    const fileName = `${process.env.S3_PATH}/homepage-banners/${timestamp}-${randomCode}${fileExtension}`;
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
                    updateField.image = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                }
                // Updating banner
                try {
                    await homepageBannersModel.updateOne({ _id: fields._id }, { $set: { ...updateField } })
                    return res.status(200).json({ success: 'Banner has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating banner failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                const { id } = req.query;
                try {
                    const data = await homepageBannersModel.findById(id)
                    if (!data) {
                        return res.status(200).json({ error: 'Banner not found.' });
                    }
                    return res.status(200).json({ data });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching banner failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
