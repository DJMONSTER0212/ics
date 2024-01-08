import ICAL from "ical.js"

const createICSLink = async (icsContent) => {

    try {
        const jcalData = ICAL.parse(icsContent);
        const comp = new ICAL.Component(jcalData);
        const icalLink = `data:text/calendar;charset=utf-8,${encodeURIComponent(comp.toString())}`;

        // console.log('iCal link:', icalLink);

    } catch (error) {
        console.log(error)
    }

}

module.exports = createICSLink;