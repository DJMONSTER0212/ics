import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import settingsModel from '@/models/settings.model'
import mongoose from 'mongoose';
import { s3 } from '@/conf/s3/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import urlSlug from 'url-slug'

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
            if (req.method == 'POST') {
                // Parse string of objects in formdata to json >>>>>>>>>>>>>>
                fields.images = JSON.parse(fields.images)

                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    'name': fields.name,
                    'slug': urlSlug(fields.name),
                    'desc': fields.desc,
                    'images': fields.images,
                    'address': fields.address,
                    'locationId': fields.locationId,
                    'googleMapsLink': fields.googleMapsLink,
                    'userId': fields.userId,
                    'basePrice': fields.basePrice,
                    'discountedPrice': fields.discountedPrice,
                    'minGuest': fields.minGuest,
                    'maxGuest': fields.maxGuest,
                    'extraGuestPrice': fields.extraGuestPrice,
                    'maxChild': fields.maxChild || 0,
                    'childPrice': fields.childPrice || 0,
                    'petAllowed': fields.petAllowed,
                    'bookingAllowed': fields.bookingAllowed,
                    'block': fields.block,
                }
                // Fetching settings  >>>>>>>>>>>>>>
                let settings;
                try {
                    settings = await settingsModel.findOne().lean()
                } catch (error) {
                    return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
                // Multi vendor logics >>>>>>>>>>>>>>
                if (!settings.tnit.multiVendorAllowed) {
                    // Remove user id as it is default to the admin
                    delete updateFields.userId;
                    // Remove block as properties can't be blocked in single vendor model
                    delete updateFields.block;
                }
                // Only add field minimumPriceToBook if admin allowed this in settings
                if (settings.admin.booking.letOwnerManageMinimumPriceToBook) {
                    updateFields.minimumPriceToBook = fields.minimumPriceToBook;
                }
                // Only add field reviewsAllowed if admin allowed this in settings
                if (settings.admin.property.letOwnerManageReviews) {
                    updateFields.reviewsAllowed = fields.reviewsAllowed;
                }
                // Image file handling >>>>>>>>>>>>>>
                fields.images = fields.images
                let images = fields.images;
                let newImages = []
                await Promise.all(images.map(async (image, index) => {
                    if (typeof image == 'string') {
                        newImages.push(image)
                    } else {
                        // Creating uninque name
                        const fileExtension = path.extname(files[`file[${index}]`].originalFilename);
                        const timestamp = Date.now();
                        const randomCode = crypto.randomBytes(16).toString('hex');
                        const fileName = `${process.env.S3_PATH}/villas/${timestamp}-${randomCode}${fileExtension}`;
                        // Making upload command
                        const command = new PutObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: fileName,
                            ContentType: files[`file[${index}]`].mimetype,
                            Body: fs.createReadStream(files[`file[${index}]`].filepath)
                        })
                        // Uploading file
                        try {
                            await s3.send(command);
                            // Adding image address in database
                            newImages.push(`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`);
                        } catch (error) {
                            return res.status(500).json({ error: `Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                        }
                    }
                }))
                // Add images to fields >>>>>>>>>>>>>>
                updateFields.images = newImages;
                // Updating villa >>>>>>>>>>>>>>
                try {
                    await villasModel.updateOne({ _id: fields._id }, { $set: updateFields });
                    return res.status(200).json({ success: 'Villa has been updated successfully', newImages })
                } catch (error) {
                    return res.status(500).json({ error: `Updating villa failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                const { id } = req.query;
                // To set match query >>>>>>>>>>>>>>>>
                let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                // Fetch villa >>>>>>>>>>>>>>>>
                try {
                    const data = await villasModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
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
                        {
                            $project: {
                                addons: 0,
                                amenities: 0,
                                icalLinks: 0,
                                hostInfo: 0,
                                amenities: 0,
                                icalLinks: 0,
                                hostInfo: 0,
                                verification: 0,
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Villa not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching villa failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
