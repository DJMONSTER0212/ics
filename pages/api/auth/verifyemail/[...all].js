import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        // To check user exist or not
        const user = await usersModel.findOne({ email: req.query.all[1] }).lean();
        if (!user) {
            res.status(400).json({ error: "User not found" });
            return;
        }
        // To validate exipiration of link
        if (user.expirationTime < new Date()) {
            res.status(400).json({ error: "Verification link has expired" });
            return;
        }
        // To validate exipiration code
        if (user.verificationCode !== req.query.all[0]) {
            res.status(400).json({ error: "Invalid verification link" });
            return;
        }
        // Saving varified status
        try {
            user.verified = true;
            user.verificationCode = null;
            user.expirationTime = null;
            await user.save();
            res.status(302).redirect('/auth/verified');
        } catch (error) {
            return res.status(400).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } catch (error) {
        return res.status(400).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
