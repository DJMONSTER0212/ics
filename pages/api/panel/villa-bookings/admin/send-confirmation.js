import formidable from 'formidable';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import mongoose from 'mongoose';
import bookingMail from '@/conf/mail/bookingEmail';

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
            // Unauthorized access >>>>>>>>>>>>>>>
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({
                    error: "You must be signed in as admin to view the protected content on this page.",
                })
            }
            // Logics >>>>>>>>>>>>>>>
            if (req.method == 'POST') {
                let { mail, bookingId } = fields;
                await bookingMail(`user/bookings/${bookingId}/invoice`, mail)
                return res.status(200).json({ success: `Mail sent` });

            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    })
}
