import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";
import bcrypt from 'bcrypt';

// Database 
connectDB()

export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            const { email, otp, password, cpassword } = req.body
            // To check user exist or not
            const user = await usersModel.findOne({ email });
            if (!user) {
                res.status(400).json({ error: "User not found" });
                return;
            }
            // To validate exipiration of otp
            if (user.expirationTime < new Date()) {
                res.status(400).json({ error: "OTP has benn expired. Please resend a new one." });
                return;
            }
            // To validate code
            if (user.otp != otp) {
                res.status(400).json({ error: "Invalid verification code" });
                return;
            }
            // To check password and confirm password are same
            if (password != cpassword) {
                res.status(400).json({ error: "Password and Confirm password should match" });
                return;
            }
            // Saving varified status
            try {
                user.password = bcrypt.hashSync(password, 10);
                await user.save();
                return res.status(200).json({ success: true });
            } catch (error) {
                res.status(400).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                return;
            }
        } catch (error) {
            return res.status(400).json({ error: `Something went erong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } else {
        res.status(404).json({ error: 'Page not found' })
    }
}
