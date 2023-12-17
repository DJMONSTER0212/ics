import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";
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
    form.uploadDir = path.join(process.cwd(), 'public/panel/uploads');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        try {
            const session = await getServerSession(req, res, authOptions);
            // Logics
            if (req.method == 'POST') {
                // Setting update fields >>>>>>>>>>>>>>
                var updateFields = {
                    'name': fields.name,
                    'email': fields.email,
                    'phone': fields.phone,
                    'dob': fields.dob,
                    'anniversary': fields.anniversary,
                    'image': fields.image
                }
                // To check for existing user >>>>>>>>>>>>>>
                const userExists = await usersModel.findOne({ email: fields.email, _id: { $ne: session.user._id } }).lean();
                if (userExists) {
                    return res.status(500).json({ error: 'User with this email already exists.' })
                }
                // To delete image field if not uploaded one >>>>>>>>>>>>>>
                if (typeof updateFields.image == 'string') {
                    delete updateFields.image
                }
                // Image file handling >>>>>>>>>>>>>>
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
                        Body: fs.createReadStream(files.image.filepath)
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
                // Delete empty fields >>>>>>>>>>>>>>
                const deleteFields = (obj, fieldsToDelete) => {
                    fieldsToDelete.forEach((field) => {
                        if (obj.hasOwnProperty(field) && obj[field] === '') {
                            delete obj[field];
                        }
                    });
                    return obj;
                };
                updateFields = deleteFields(updateFields, ['dob', 'anniversary', 'phone']);
                // Updating user
                try {
                    await usersModel.updateOne({ _id: session.user._id }, { $set: { ...updateFields } })
                    return res.status(200).json({ success: 'User has been edited successfully', newImage: updateFields.image })
                } catch (error) {
                    return res.status(500).json({ error: `Updating user failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else {
                try {
                    const data = await usersModel.findOne({ _id: session.user.id }).lean()
                    if (!data) {
                        return res.status(200).json({ error: 'User not found.' });
                    }
                    // Delete password >>>>>>>>>>>>>>
                    delete data.password;
                    return res.status(200).json({ data });
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
