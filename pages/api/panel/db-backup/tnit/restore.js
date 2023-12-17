import connectDB from '@/conf/database/dbConfig';
import fs from 'fs';
import path from 'path';
import addonsModel from '@/models/addons.model'
import amenitiesModel from '@/models/amenities.model'
import contactsModel from '@/models/contacts.model'
import couponsModel from '@/models/coupons.model'
import homepageBannersModel from '@/models/homepageBanners.model'
import hotelsModel from '@/models/hotels.model'
import locationsModel from '@/models/locations.model'
import paymentsModel from '@/models/payments.model'
import seasonalPricingsModel from '@/models/seasonalPricings.model'
import settingsModel from '@/models/settings.model'
import taxesModel from '@/models/taxes.model'
import usersModel from '@/models/users.model'
import villaBookingsModel from '@/models/villaBookings.model'
import villasModel from '@/models/villas.model'
import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

// Disable next js body parser
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const handler = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'public/panel/uploads');
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to parse the upload' });
      return;
    }
    // Unauthorized access
    const session = await getServerSession(req, res, authOptions)
    if (!session || session.user.role != 'tnit') {
      return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
    }
    try {
      // Connect to MongoDB
      await connectDB();

      // Read the backup file
      const backupFilePath = files.backup.filepath;
      const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));

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
      // Loop through the backup data and overwrite the collections
      for (const collectionName in backupData) {
        const collectionModel = collectionModels[collectionName];
        // Remove all existing documents from the collection
        await collectionModel.deleteMany({});
        // Insert documents from the backup data into the collection
        await collectionModel.insertMany(backupData[collectionName]);
      }
      res.status(200).json({ success: 'Restore successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Failed to perform restore. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
  })
};

export default handler;
