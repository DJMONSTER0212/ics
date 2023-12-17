import connectDB from "@/conf/database/dbConfig";
import locationsModel from "@/models/locations.model";

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        // Logics
        if (req.method == 'GET') {
            try {
                const sortQuery = { name: 1 };
                const pipeline = [
                    { $sort: sortQuery },
                ]
                if (req.query.limit) {
                    pipeline.push({ $limit: Number(req.query.limit) })
                }
                const data = await locationsModel.aggregate(pipeline);
                return res.status(200).json({ data });
            } catch (error) {
                return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
            }
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
