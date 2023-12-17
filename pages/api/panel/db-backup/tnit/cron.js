import connectDB from '@/conf/database/dbConfig';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import cron from 'node-cron';
import addonsModel from '@/models/addons.model'
import amenitiesModel from '@/models/amenities.model'
import contactsModel from '@/models/contacts.model'
import couponsModel from '@/models/coupons.model'
import homepageBannersModel from '@/models/homepageBanners.model'
import locationsModel from '@/models/locations.model'
import paymentsModel from '@/models/payments.model'
import seasonalPricingsModel from '@/models/seasonalPricings.model'
import settingsModel from '@/models/settings.model'
import taxesModel from '@/models/taxes.model'
import usersModel from '@/models/users.model'
import villaBookingsModel from '@/models/villaBookings.model'
import villasModel from '@/models/villas.model'
import { s3 } from '@/conf/s3/s3';
import { PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const handler = async (req, res) => {
    try {
        try {
            // Connect to MongoDB
            await connectDB();

            // Fetch all collections from MongoDB
            const collections = mongoose.connection.collections;
            const backupData = {};

            // Object to map collection names to models
            const collectionModels = {
                addons: addonsModel,
                amenities: amenitiesModel,
                contacts: contactsModel,
                coupons: couponsModel,
                homepagebanners: homepageBannersModel,
                locations: locationsModel,
                payments: paymentsModel,
                seasonalpricings: seasonalPricingsModel,
                settings: settingsModel,
                users: usersModel,
                taxes: taxesModel,
                villabookings: villaBookingsModel,
                villas: villasModel,
            };
            // Loop through each collection and fetch all documents
            for (const collectionName in collections) {
                const collectionModel = collectionModels[collectionName];
                const documents = await collectionModel.find({}).exec();
                // Add documents to the backup data
                backupData[collectionName] = documents;
            }

            // Save the backup data to a file (JSON format)
            const backupFilePath = path.join(process.cwd(), 'backup.json');
            fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

            // Upload backup to Amazon S3
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `${process.env.S3_BACKUP_PATH}/backup_${Date.now()}.json`,
                Body: fs.createReadStream(backupFilePath),
            })
            try {
                await s3.send(command);
            } catch (error) {
                return console.log(`Error uploading file. Please try again ${process.env.NODE_ENV == 'development' && `Error : ${error}`}`);
            }
            // Delete past backups from Amazon S3
            const listObjects = new ListObjectsV2Command({
                Bucket: process.env.S3_BUCKET_NAME,
                Prefix: `${process.env.S3_BACKUP_PATH}/`,
            });
            const objects = await s3.send(listObjects);
            console.log(objects)

            // Sort objects by timestamp
            const sortedObjects = objects.Contents.sort(
                (a, b) => b.LastModified - a.LastModified
            );

            // Keep the last 3 backups, delete the rest
            const backupsToDelete = sortedObjects.slice(3);
            for (const backup of backupsToDelete) {
                const deleteObject = new DeleteObjectsCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: backup.Key,
                });
                await s3.send(deleteObject);
            }
            console.log('Old backups deleted.');

            // Clean up after sending the file
            fs.unlinkSync(backupFilePath);
            res.send('Done')
        } catch (error) {
            console.log(`Failed to perform backup. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}`);
        }
        cron.schedule('0 0 * * *', performBackupAndCleanup);
    } catch (error) {
        res.status(500).json({ error: `Failed to perform backup. ${process.env.NODE_ENV === 'development' ? `Error: ${error}` : ''}` });
    }
};

export default handler;
