import ical from "ical"

const icalParser = async(str)=>{
    try {
        const data = await ical.parseICS(str)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
    }
}

module.exports =  icalParser;