import connectDB from "@/conf/database/dbConfig";
import usersModel from "@/models/users.model";

// Database 
connectDB()

export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            const user = await usersModel.findOne({ _id: req.body._id }).lean()
            if (!user || user.block || !user.verified) {
                return res.status(400).json({ error: "User not authorized" });
            } else {
                return res.status(200).json({ success: true, role: user.role });
            }

        } catch (error) {
            return res.status(400).json({ error: `Unabale to find user ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    } else {
        res.status(404).json({ error: 'Page not found' })
    }
}
