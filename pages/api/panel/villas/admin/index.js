import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import locationsModel from "@/models/locations.model";
import usersModel from "@/models/users.model";
import settingsModel from "@/models/settings.model";
import ical from 'node-ical'
import { s3 } from '@/conf/s3/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import urlSlug from 'url-slug'
import http from 'node:http';
import icalendar from 'ical-generator';
import moment from 'moment';
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
    // const url = "https://www.airbnb.co.in/calendar/ical/39378614.ics?s=e900be549a200d82352ed858a3d8bc88"

    // await ical.fromURL(url, {}, function(err, data) {
    //     if (err) console.log(err);
    //     console.log(data);
    // });
    form.parse(req, async (error, fields, files) => {
        // Checking for error in parsing
        if (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
        // API handling
        try {
            // Unauthorized access >>>>>>>>>>>>>>>
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({
                    error: "You must be signed in as admin to view the protected content on this page.",
                })
            }
            // Logics >>>>>>>>>>>>>>>
            if (req.method == 'POST') {
                // Parse string of objects in formdata to json >>>>>>>>>>>>>>
                fields.images = JSON.parse(fields.images)
                fields.hostInfo = JSON.parse(fields.hostInfo)
                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    'name': fields.name,
                    'slug': urlSlug(fields.name),
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
                    'maxChild': fields.maxChild || 1,
                    'childPrice': fields.childPrice || 0,
                    'petAllowed': fields.petAllowed,
                    'hostInfo': {
                        'name': fields.hostInfo.name,
                        'phone': fields.hostInfo.phone,
                        'email': fields.hostInfo.email,
                    },
                    'bookingAllowed': fields.bookingAllowed,
                    'verification': {
                        'verified': false
                    },
                    'icsContent' : "Hello"
                }
                // Fetching settings  >>>>>>>>>>>>>>
                let settings;
                try {
                    settings = await settingsModel.findOne().lean()
                } catch (error) {
                    return res.status(500).json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
                // Assign admin id if multi vendor is not enabled
                if (!settings.tnit.multiVendorAllowed) {
                    updateFields.userId = session.user._id;
                }
                // Only add field reviewsAllowed if admin allowed this in settings
                if (settings.admin.property.letOwnerManageReviews) {
                    updateFields.reviewsAllowed = fields.reviewsAllowed;
                }
                // Checking max villa limit by admin >>>>>>>>>>>>>>
                if (settings.tnit.limitMaxVillas) {
                    // Count total active villas
                    const totalVillas = await villasModel.countDocuments({ trash: { $ne: true } });
                    if (totalVillas >= settings.tnit.maxVillas) {
                        return res.status(500).json({ error: `Only ${settings.tnit.maxVillas} villas are allowed. To increase the number of total villas please contact TNIT.` })
                    }
                }
                // Checking whether to auto Verify property or not [Part of admin settings] >>>>>>>>>>>>>>
                if (settings.admin.autoVerifyProperty == true) {
                    // Verify property
                    updateFields.verification.verified = true;
                    updateFields.verification.submitForVerification = true;
                }
                // Image file handling >>>>>>>>>>>>>>
                let images = updateFields.images; // Parse array of images from form data string
                let newImages = [] // Final mages to be added in property
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
                            Body: fs.createReadStream(files[`file[${index}]`].filepath),
                            ContentType: files[`file[${index}]`].mimetype
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
                // Adding villa >>>>>>>>>>>>>>
                try {
                    const newVilla = new villasModel(updateFields)

                    const result = await newVilla.save();
                    // console.log(result);
                    return res.status(200).json({ success: 'Villa has been added successfully', newImages })
                } catch (error) {
                    console.log(error)
                    return res.status(500).json({ error: `Adding villa failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                const { pageIndex, maxResult, search, searchOption, villaType } = req.query;
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
                        { $skip: Number(pageIndex) * Number(maxResult) },
                        { $limit: Number(maxResult) },
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
                    // To count results >>>>>>>>>>>>>>>
                    const totalRow = await villasModel.countDocuments({
                        $and: [
                            search ? searchQuery : {},
                            matchQuery ? matchQuery : {}
                        ]
                    });
                    return res.status(200).json({ data, totalRow });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching villas fialed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
