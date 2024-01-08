import icalendar from 'ical-generator';

const icsGen = async(events)=>{
    // console.log(events)
    try {
        const calendar =  icalendar({
            prodId : '//superman-industries.com//ical-generator//EN',
            events,
        })
        // console.log(calendar.toString)
        return calendar.toString()
    } catch (error) {
        console.log(error);
    }
}

module.exports = icsGen;