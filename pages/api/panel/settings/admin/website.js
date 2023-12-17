import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import connectDB from "@/conf/database/dbConfig";
import settingsModel from "@/models/settings.model";
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
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page." })
            }
            // Logics
            if (req.method == 'POST') {
                try {
                    // Setting update fields >>>>>>>>>>>>>>
                    var updateFields = {
                        'website.name': fields.name,
                        'website.lightLogo': fields.lightLogo,
                        'website.darkLogo': fields.darkLogo,
                        'website.emailLogo': fields.emailLogo,
                        'website.fevicon': fields.fevicon,
                        'website.companyName': fields.companyName,
                        'website.currencySymbol': fields.currencySymbol,
                    }
                    // File handling >>>>>>>>>>>>>>
                    const settings = await settingsModel.findOne().select({ website: 1 }).lean()
                    // File handling for light logo 
                    if (files.lightLogo) {
                        // Creating uninque name
                        const fileExtension = path.extname(files.lightLogo.originalFilename);
                        const timestamp = Date.now();
                        const randomCode = crypto.randomBytes(16).toString('hex');
                        const fileName = `${process.env.S3_PATH}/website/${timestamp}-${randomCode}${fileExtension}`;
                        // Making upload command
                        const command = new PutObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: fileName,
                            Body: fs.createReadStream(files.lightLogo.filepath),
                            ContentType: files.lightLogo.mimetype,
                        })
                        // Uploading file
                        try {
                            await s3.send(command);
                        } catch (error) {
                            return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                        // Adding image address in database
                        updateFields['website.lightLogo'] = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                    } else {
                        updateFields['website.lightLogo'] = settings.website.lightLogo
                    }
                    // File handling for dark logo 
                    if (files.darkLogo) {
                        // Creating uninque name
                        const fileExtension = path.extname(files.darkLogo.originalFilename);
                        const timestamp = Date.now();
                        const randomCode = crypto.randomBytes(16).toString('hex');
                        const fileName = `${process.env.S3_PATH}/website/${timestamp}-${randomCode}${fileExtension}`;
                        // Making upload command
                        const command = new PutObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: fileName,
                            Body: fs.createReadStream(files.darkLogo.filepath),
                            ContentType: files.darkLogo.mimetype,
                        })
                        // Uploading file
                        try {
                            await s3.send(command);
                        } catch (error) {
                            return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                        // Adding image address in database
                        updateFields['website.darkLogo'] = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                    } else {
                        updateFields['website.darkLogo'] = settings.website.darkLogo
                    }
                    // File handling for email logo
                    if (files.emailLogo) {
                        // Creating uninque name
                        const fileExtension = path.extname(files.emailLogo.originalFilename);
                        const timestamp = Date.now();
                        const randomCode = crypto.randomBytes(16).toString('hex');
                        const fileName = `${process.env.S3_PATH}/website/${timestamp}-${randomCode}${fileExtension}`;
                        // Making upload command
                        const command = new PutObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: fileName,
                            Body: fs.createReadStream(files.emailLogo.filepath),
                            ContentType: files.emailLogo.mimetype,
                        })
                        // Uploading file
                        try {
                            await s3.send(command);
                        } catch (error) {
                            return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                        // Adding image address in database
                        updateFields['website.emailLogo'] = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                    } else {
                        updateFields['website.emailLogo'] = settings.website.fevicon
                    }
                    // File handling for fevicon
                    if (files.fevicon) {
                        // Creating uninque name
                        const fileExtension = path.extname(files.fevicon.originalFilename);
                        const timestamp = Date.now();
                        const randomCode = crypto.randomBytes(16).toString('hex');
                        const fileName = `${process.env.S3_PATH}/website/${timestamp}-${randomCode}${fileExtension}`;
                        // Making upload command
                        const command = new PutObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: fileName,
                            Body: fs.createReadStream(files.fevicon.filepath),
                            ContentType: files.fevicon.mimetype,
                        })
                        // Uploading file
                        try {
                            await s3.send(command);
                        } catch (error) {
                            return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                        // Adding image address in database
                        updateFields['website.fevicon'] = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;
                    } else {
                        updateFields['website.fevicon'] = settings.website.fevicon
                    }
                    // Update setting >>>>>>>>>>>>>>
                    await settingsModel.updateOne({}, { $set: updateFields }).exec()
                    return res.status(200).json({ success: 'Website settings has been updated successfully.', updatedFields: updateFields })
                } catch (error) {
                    return res.status(500).json({ error: `Updating setting failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = {};
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await settingsModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                website: 1,
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Settings not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
