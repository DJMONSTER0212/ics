import connectDB from "@/conf/database/dbConfig"
import ical from "ical-generator"
import ics from "@/models/ics.model"
connectDB();
const icsGen = async (villaId, startTime, endTime) => {
    console.log(villaId)
    console.log(startTime)
    console.log(endTime)
    if(!villaId || !startTime || !endTime){
        return null;
    }
    const calendar = ical({ name: villaId });
    // endTime.setHours(startTime.getHours() + 1);
    const temp = calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: 'Booking',
        description: 'Booked',
        location: '',
        url: 'http://sebbo.net/'
    });

    const icsContent = calendar.toString();

    const data = await ics.create({
        villaId,
        icsContent
    })

    return icsContent;
}

module.exports = icsGen