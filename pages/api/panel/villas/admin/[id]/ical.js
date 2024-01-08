import formidable from 'formidable';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../auth/[...nextauth]';
import connectDB from "@/conf/database/dbConfig";
import villasModel from "@/models/villas.model";
import mongoose from 'mongoose';
import icalendar from 'ical-generator';
import ical from 'node-ical';
import axios from 'axios';


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
            // Unauthorized access
            const session = await getServerSession(req, res, authOptions)
            if (!session || session.user.role != 'admin') {
                return res.status(401).json({ error: "You must be signed in as admin to view the protected content on this page.", })
            }
            if (req.method == 'POST') {
                // Parse icalLinks object
                fields.icalLinks = JSON.parse(fields.icalLinks)
                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    'icalLinks': fields.icalLinks
                }
                // Updating villa ical links >>>>>>>>>>>>>>
                let events = []

                const villa = await villasModel.findById({ _id: req.query.id });
                // console.log(villa)
                events = villa.events;
                // console.log(events);
                const links = fields.icalLinks
                // console.log(links)
                try {
                    for (let linkNo in links) {
                        // console.log(links[linkNo])
                        try {
                            const response = await axios.get(links[linkNo]);
                            const data = response.data;
                            const parsedData = ical.parseICS(data);
                            for (const key in parsedData) {
                                if (parsedData.hasOwnProperty(key) && parsedData[key].type === 'VEVENT') {
                                    const event = parsedData[key];
                                    events.push({
                                        summary: event.summary,
                                        description: event.description || "Booked",
                                        start: new Date(event.start),
                                        end: new Date(event.end),
                                        url: "www.testurl.com"
                                    });
                                }
                            }
                            // console.log(parsedData)
                        } catch (error) {
                            console.log(error)
                            // break;
                        }
                    }

                    // console.log(events)

                    let newIcsContent = "";
                    try {
                        const calendar = await icalendar({
                            prodId: '//superman-industries.com//ical-generator//EN',
                            events: events,
                        })
                        newIcsContent = calendar.toString();
                        const data = await villasModel.findByIdAndUpdate({ _id: req.query.id }, {
                            $push: { events: events },
                            $set: { icsContent: newIcsContent }
                        })


                    } catch (error) {
                        console.log(error)
                    }
                } catch (error) {
                    console.log(error)
                }
                try {
                    await villasModel.updateOne({ _id: req.query.id }, { $set: updateFields });
                    return res.status(200).json({ success: 'iCal links has been updated successfully' })
                } catch (error) {
                    return res.status(500).json({ error: `Updating iCal links failed. Please try again. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` })
                }
            } else if (req.method == 'GET') {
                try {
                    const { id } = req.query;
                    // To set match query >>>>>>>>>>>>>>>>
                    let matchQuery = { _id: mongoose.Types.ObjectId(id) };
                    // Fetch data >>>>>>>>>>>>>>>>
                    const data = await villasModel.aggregate([
                        { $match: matchQuery ? matchQuery : {} },
                        {
                            $project: {
                                icalLinks: 1,
                                name: 1
                            }
                        }
                    ]);
                    // Check for empty data >>>>>>>>>>>>>>>>
                    if (data.length == 0) {
                        return res.status(200).json({ error: 'Villa not found.' });
                    }
                    // Send data >>>>>>>>>>>>>>>>
                    return res.status(200).json({ data: data[0] });
                } catch (error) {
                    return res.status(500).json({ error: `Fetching villa ical links failed. ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
                }
            } else {
                return res.status(404).json({ error: `Page not found` });
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
        }
    });
}
