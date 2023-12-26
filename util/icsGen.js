import connectDB from "@/conf/database/dbConfig"
import ical from "ical-generator"
import villaModel from "@/models/villas.model"
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
        summary: 'Booking019',
        description: 'Booked',
        location: '',
        url: 'http://sebbo.net/'
    });

    const icsContent = calendar.toString();

    const result = await villaModel.findOneAndUpdate({_id : villaId},{
        $push : {icsContents:icsContent}
    },function(error,success){
        if(error){
            console.log(error)
        }else {
            console.log(success)
        }
    });
    console.log(result);

    // const data = await ics.create({
    //     villaId,
    //     icsContent
    // })

    return icsContent;
}

module.exports = icsGen