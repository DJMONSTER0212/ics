import settingModel from '@/models/settings.model'
import usersModel from "@/models/users.model";
import connectDB from "@/conf/database/dbConfig";
import crypto from "crypto";
import bcrypt from 'bcrypt';

// Database
connectDB()

// Verification email
import sendVerificationMail from '@/conf/mail/verificationMail'

export default async function register(req, res) {
    if (req.method == 'POST') {
        try {
            const { name, email, password, cpassword } = req.body;
            // To check password and confirm password are same
            if (password != cpassword) {
                res.status(400).json({ error: "Password and Confirm password should match" });
                return;
            }
            // To check user exist or not [If exist and not verified delete the user]
            const user = await usersModel.findOne({ email }).lean();
            if (user && user.verified) {
                res.status(400).json({ error: "An user with this email already exists. Please try to sign in." });
                return;
            }
            if (user && !user.verified) {
                await usersModel.deleteOne({ email })
            }
            // Saving varified status
            try {
                // Fetch settings [To check verification method]
                const settings = await settingModel.findOne();
                // console.log(settings)
                // Verification method check
                if (settings.login.verificationMethod == 'link' ) {
                    const token = crypto.randomBytes(20).toString('hex');
                    const expirationTime = new Date();
                    expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time for the token or link
                    const verificationLinkProp = `${token}/${encodeURIComponent(email)}`
                    // Send mail
                    if (await sendVerificationMail(name, email, verificationLinkProp)) {
                        // Create user
                        const newUser = new usersModel(
                            {
                                name,
                                email,
                                password: bcrypt.hashSync(password, 10),
                                image: '/panel/images/newUser.webp',
                                verified: false,
                                role: 'user',
                                verificationCode: token,
                                expirationTime
                            }
                        )
                        await newUser.save();
                    } else {
                        res.status(400).json({ error: "Account not verified and sending email failed. Please try again." });
                    }
                } else {
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const expirationTime = new Date();
                    expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time for the otp
                    // Send mail
                    if (await sendVerificationMail(name, email, otp)) {
                        // Create user
                        const newUser = new usersModel(
                            {
                                name,
                                email,
                                password: bcrypt.hashSync(password, 10),
                                image: '/panel/images/newUser.webp',
                                verified: false,
                                role: 'user',
                                otp,
                                expirationTime
                            }
                            )
                            await newUser.save();
                            // console.log("Done")
                            // console.log("hello")
                    } else {
                        res.status(400).json({ error: "Account not verified and sending email failed. Please try again." });
                    }
                }
                return res.status(200).json({ verificationMethod: settings.login.verificationMethod });
            } catch (error) {
                return res.status(400).json({ error: `Something went erong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
            }
        } catch (error) {
            return res.status(400).json({ error: `Something went erong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } else {
        res.status(404).json({ error: 'Page not found' })
    }
}