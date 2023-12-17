import ical from "ical-generator"
import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
// import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villaBookingsModel from "@/models/villaBookings.model";
import couponsModel from "@/models/coupons.model";
import seasonalPricingsModel from "@/models/seasonalPricings.model";
import addonsModel from "@/models/addons.model";
import taxesModel from "@/models/taxes.model";
import settingsModel from "@/models/settings.model";
import villasModel from "@/models/villas.model";
import paymentModel from"@/models/payments.model"
import userModel from "@/models/users.model"
import icsModel from "@/models/ics.model"
import icsParser from "@/util/icsParser"

import mongoose from 'mongoose';

connectDB();

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req, res) {

    const form = new formidable.IncomingForm();


    form.parse(req, async (error,fields,files) =>{

        if(error){
            console.log(error)
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }

        try {
            if (req.method == "GET") {
                const {villaId} = req.query;
                // console.log(villaId)

                const ics = await icsModel.findOne({villaId});
                const icsContent = await icsParser(ics.icsContent);
                console.log(icsContent)
                res.send(icsContent)
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({message: "SomeThing Went Wrong"})
        }
    })


}