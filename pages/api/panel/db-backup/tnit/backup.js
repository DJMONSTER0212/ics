import connectDB from '@/conf/database/dbConfig';
import fs from 'fs';
import path from 'path';
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
import hotelsModel from '@/models/hotels.model'
import villasModel from '@/models/villas.model'
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req, res) => {
  // Unauthorized access
  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user.role != 'tnit') {
    return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
  }
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
      hotels: hotelsModel,
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

    // Set response headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.json');

    // Stream the backup file
    const fileStream = fs.createReadStream(backupFilePath);
    fileStream.pipe(res);

    // Clean up after sending the file
    fileStream.on('end', () => {
      fs.unlinkSync(backupFilePath);
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to perform backup. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
  }
};

export default handler;
