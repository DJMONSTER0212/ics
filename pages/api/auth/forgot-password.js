import settingModel from '@/models/settings.model'
import usersModel from "@/models/users.model";
import connectDB from "@/conf/database/dbConfig";
import crypto from "crypto";

// Database 
connectDB()

// Verification email 
import sendVerificationMail from '@/conf/mail/verificationMail'

export default async function register(req, res) {
    if (req.method == 'POST') {
        try {
            const { email } = req.body
            // Fetch user details
            const user = await usersModel.findOne({ email }).lean()
            if (!user) {
                return res.status(400).json({ error: "No user found with this email. Please check and try again." })
            }
            if (user.block) {
                return res.status(400).json({ error: "Your account is blocked. Please contact support." })
            }
            // Sending OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time for the otp
            if (await sendVerificationMail(user.name, user.email, otp)) {
                await usersModel.updateOne({ email: user.email }, { $set: { otp, expirationTime } })
            } else {
                return res.status(400).json({ error: `Account not verified and sending email failed. Please try again.` })
            }
            return res.status(400).json({ error: `Please verify your email using otp` })
        } catch (error) {
            return res.status(400).json({ error: `Something went erong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } else {
        res.status(404).json({ error: 'Page not found' })
    }
}