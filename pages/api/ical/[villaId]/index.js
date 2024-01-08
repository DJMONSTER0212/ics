import { getServerSession } from "next-auth/next";
// import { authOptions } from '../../../auth/[...nextauth]';
import ICAL from "ical.js"
import villaModel from "@/models/villas.model"

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req, res) {
    try {
        if (req.method == "GET") {
            const { villaId } = req.query;
            const villa = await villaModel.findById(villaId)
            const icsContent = villa.icsContent
            const jcalData = await ICAL.parse(icsContent);
            const comp = new ICAL.Component(jcalData);
            res.setHeader('Content-Type', 'text/calendar');
            // console.log(comp)
            res.status(200).send(icsContent);
            // // const icalLink =  `data:text/calendar;charset=utf-8,${encodeURIComponent(comp.toString())}`;
            // return res.send({status : 200, icalLink});/
        }
    } catch (error) {

        console.log(error)
        return res.status(500).send("Something went wrong");
    }
}