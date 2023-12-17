import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import settingModel from '@/models/settings.model'
import usersModel from "@/models/users.model";
import connectDB from "@/conf/database/dbConfig";
import crypto from "crypto";
import bcrypt from 'bcrypt';

// Database 
connectDB()

// Verification email 
import sendVerificationMail from '@/conf/mail/verificationMail'

export const authOptions = {
    session: {
        jwt: true,
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "ex@example.com" },
                password: { label: "Password", type: "password", placeholder: "XXXXX" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials
                // Fetch settings
                const settings = await settingModel.findOne().lean();
                // Fetch user details
                const user = await usersModel.findOne({ email }).lean()
                if (!user) {
                    throw new Error("No user found with this email. Please check and try again.")
                }
                if (user.role != 'tnit' && !settings.tnit.activateWebsite) {
                    throw new Error("Website is disabled by TNIT. Please contact TNIT to reactivate website.")
                }
                if (user.block) {
                    throw new Error("Your account is blocked. Please contact support.")
                }
                if (!user.password) {
                    throw new Error("Looks like you've signed in with Google before. Please use google to sign in.")
                } else if (!await bcrypt.compare(password, user.password)) {
                    throw new Error("Password is incorrect. Please check and try again.")
                }
                if (!user.verified) {
                    // Verification method check
                    if (settings.login.verificationMethod == 'link') {
                        const token = crypto.randomBytes(20).toString('hex');
                        const expirationTime = new Date();
                        expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time for the token or link
                        const verificationLinkProp = `${token}/${encodeURIComponent(user.email)}`
                        if (await sendVerificationMail(user.name, user.email, verificationLinkProp)) {
                            await usersModel.updateOne({ email: user.email }, { $set: { verificationCode: token, expirationTime } })
                        } else {
                            throw new Error(`Account not verified and sending email failed. Please try again.`)
                        }
                    } else {
                        const otp = Math.floor(100000 + Math.random() * 900000).toString();
                        const expirationTime = new Date();
                        expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time for the otp
                        if (await sendVerificationMail(user.name, user.email, otp)) {
                            await usersModel.updateOne({ email: user.email }, { $set: { otp, expirationTime } })
                        } else {
                            throw new Error(`Account not verified and sending email failed. Please try again.`)
                        }
                    }
                    throw new Error(`Please verify your email using ${settings.login.verificationMethod}`)
                }
                return { _id: user._id.toString(), name: user.name, email: user.email, image: user.image, role: user.role }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Handler for google
            if (account.provider === "google") {
                try {
                    const existingUser = await usersModel.findOne({ email: user.email });
                    // Create user if not exist
                    if (!existingUser) {
                        try {
                            const newUser = new usersModel({
                                name: user.name,
                                email: user.email,
                                verified: true,
                                role: 'user',
                            })
                            await newUser.save()
                            user._id = newUser._id.toString();
                            user.name = newUser.name
                            user.image = newUser.image
                            user.role = newUser.role;
                            return user;
                        } catch (error) {
                            console.error("Error creating new user:", error);
                            return false;
                        }
                    } else { // Logics for exisitng user
                        if (existingUser.block) {
                            try {
                                throw new error('Your account has been blocked. Please contact support for assistance.');
                            } catch (error) {
                                return false;
                            }
                        }
                        if (!existingUser.verified) {
                            try {
                                await usersModel.updateOne({ email: user.email }, { $set: { verified: true } })
                            } catch (error) {
                                return false;
                            }
                        }
                        // Return user info if exist
                        user._id = existingUser._id.toString();
                        user.name = existingUser.name
                        user.image = existingUser.image
                        user.role = existingUser.role;
                        return true;
                    }
                } catch (error) {
                    console.error("Error finding existing user:", error);
                    return false;
                }
            } else if (account.provider == 'credentials') {
                return true;
            }
        },
        async jwt({ token, user }) {
            if (token && user) {
                token._id = user._id;
                token.image = user.image;
                token.role = user.role;
                delete token.picture;
            }
            return token
        },
        async session({ session, token }) {
            if (session && token) {
                session.user._id = token._id;
                session.user.image = token.image;
                session.user.role = token.role;
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
}

export default NextAuth(authOptions)