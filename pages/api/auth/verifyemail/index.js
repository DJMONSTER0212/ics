import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";

// Database
connectDB()

export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            // To check user exist or not
            const user = await usersModel.findOne({ email: req.body.email }).lean();
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
            if (user.otp != req.body.otp) {
                res.status(400).json({ error: "Invalid verification code" });
                return;
            }
            // Saving varified status
            try {
                user.verified = true;
                user.otp = null;
                user.expirationTime = null;
                console.log(user)
                const updateduser = await usersModel.findByIdAndUpdate(user._id,{
                    verified :true,
                    otp: null,
                    expirationTime : null
                });
                console.log(updateduser)
                return res.status(200).json({ success: true });
            } catch (error) {
                console.log(error)
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
