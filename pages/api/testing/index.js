// const ical = require('node-ical');
const axios = require('axios');
import ical from 'ical.js';
import villasmodel from "@/models/villas.model"


export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

// const iCalData = await getICalData(villaId);

// export default async function handler(req, res) {
//     try {
//         if (req.method == "POST") {
//             const icalUrl = 'https://www.airbnb.co.in/calendar/ical/39378614.ics?s=e900be549a200d82352ed858a3d8bc88';
//             const response = await axios.get(icalUrl);
//             const data = response.data;
//             // console.log(data);
//             const parsedData = ical.parseICS(data);

//             const events = [];

//             for (const key in parsedData) {

//                 if (parsedData.hasOwnProperty(key) && parsedData[key].type === 'VEVENT') {
//                     const event = parsedData[key];
//                     events.push({
//                         summary: event.summary,
//                         description: event.description || "Booked",
//                         start: new Date(event.start),
//                         end: new Date(event.end),
//                         url: "www.testurl.com"
//                     });
//                 }
//             }
//             // console.log(events)

//             return res.status(200).send(ical.parseICS(data));
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

export default async function handler(req, res) {
    try {
        if (req.method == "GET") {
            const villaId = "64fc30d7c46bd2c4a529105e";
            const villa = await villasmodel.findById(villaId);
            console.log(villa)
            const iCalData = villa.icsContent;
            res.setHeader('Content-Type', 'text/calendar');
            res.status(200).send(iCalData);
        }
    } catch (error) {
        console.log(error)
    }
}