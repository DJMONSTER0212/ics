import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";

// Database 
connectDB()

// Verification email 
import sendVerificationMail from '@/conf/mail/verificationMail'

export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time for the otp
            const user = await usersModel.findOneAndUpdate({ email: req.body.email }, { otp, expirationTime })
            if (!user) {
                res.status(400).json({ error: "User not found" });
                return;
            }
            // Send verification mail
            if (!await sendVerificationMail(user.name, user.email, otp)) {
                res.status(400).json({ error: "Sending email failed. Please try again." });
                return;
            }
            return res.status(200).json({ success: true });
        } catch (error) {
            res.status(400).json({ error: `Unabale to find user ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
            return;
        }
    } else {
        res.status(404).json({ error: 'Page not found' })
    }
}
