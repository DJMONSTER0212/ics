import ICAL from "ical.js"

const createICSLink = async (icsArray) => {
    try {
        const jcalData = ICAL.Component.fromString('BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR');

        icsArray.forEach((icsContent) => {
            // Parse the ICS content
            // const jcalComponent = ICAL.Component.fromString(icsContent);
            // const jcalComponent = ICAL.Component.fromJSON(ICAL.parse(icsContent));
            const jcalComponent = ICAL.Component.fromString(icsContent);

            // Add the parsed component to the main calendar
            jcalData.addSubcomponent(jcalComponent);
        });
        // Convert the jCal object to a string
        const icsString = jcalData.toString();

        const dataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsString)}`;

        return dataUri;
    } catch (error) {
        console.log(error)
        return null;
    }


}

module.exports = createICSLink;