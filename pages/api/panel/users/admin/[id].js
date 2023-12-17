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
import villasModel from "@/models/villas.model";
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
            const session = await getServerSession(req, res, authOptions)
            // Unauthorized access
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
                // To fetch user info >>>>>>>>>>>>>>
                let user;
                try {
                    user = await usersModel.findOne({ _id: fields._id }).lean();
                } catch (error) {
                    return res.status(500).json({ error: `Error in fetching user ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
                // To prevent from self blocking, role change, etc. >>>>>>>>>>>>>>
                if (session && session.user._id == updateFields._id) {
                    delete updateFields.role;
                    delete updateFields.block;
                    delete updateFields.verified;
                }
                // To check for existing user >>>>>>>>>>>>>>
                if (user.email != updateFields.email) {
                    try {
                        let existsUser;
                        existsUser = await usersModel.findOne({ email: updateFields.email }).lean();
                        if (existsUser) {
                            return res.status(500).json({ error: 'User with this email already exists.' })
                        }
                    } catch (error) {
                        return res.status(500).json({ error: `Checking for existing user with this email failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                    }
                }
                // To check vendor role is tnit >>>>>>>>>>>>>>
                if (updateFields.role == 'tnit') {
                    return res.status(500).json({ error: 'You can not create a user or assign TNIT role to another user' })
                }
                // To check vendor settings and max vendor >>>>>>>>>>>>>>
                if ((!(user.role == 'vendor' || user.role == 'admin') && (updateFields.role == 'vendor' || updateFields.role == 'admin'))) {
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
                // To transfer properties of a vendor/admin to another vendor/admin if admin changes the role >>>>>>>>>>>>>>
                if ((user.role == 'admin' || user.role == 'vendor') && (updateFields.role != 'admin' && updateFields.role != 'vendor' && updateFields.role != null)) {
                    // To check user id of new vendor/admin to transfer properties
                    if (!updateFields.adminId) {
                        return res.status(500).json({ error: `An admin or vendor is required to transfer properties. Please try again.` });
                    }
                    // Transfer all the villas to selected admin/vendor
                    try {
                        await villasModel.updateMany({ userId: updateFields._id }, { $set: { userId: updateFields.adminId } });
                    } catch (error) {
                        return res.status(500).json({ error: `Transferring villas failed. Please try again. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
                    }
                }
                // To manage password >>>>>>>>>>>>>>
                if (updateFields.password == '') {
                    // To delete password if user didn't updated it
                    delete updateFields.password;
                } else {
                    // Incrypt password
                    updateFields.password = bcrypt.hashSync(updateFields.password, 10);
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
                    await usersModel.updateOne({ _id: req.query.id }, { $set: updateFields })
                    return res.status(200).json({ success: 'User has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating user failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { id } = req.query;
                    try {
                        const user = await usersModel.findOne({ _id: id, role: { $ne: 'tnit' } }).lean()
                        if (!user) {
                            return res.status(200).json({ error: 'User not found.' });
                        }
                        // Delete password
                        delete user.password;
                        return res.status(200).json({ data: user });
                    } catch (error) {
                        return res.status(500).json({ error: `Fetching user failed. :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                    }
                } catch (error) {
                    return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
