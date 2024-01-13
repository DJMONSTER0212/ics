import villasBookingModel from "@/models/villaBookings.model"
import villasModel from "@/models/villas.model"
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};


export default async function handler(req,res){
    try {
        if(req.method =="GET"){
            let result = [];
            const bookings = await villasBookingModel.find({})
            const yesDate = new Date();
            yesDate.setDate(yesDate.getDate() - 1);
            const currDate = new Date();
            const yesterday = yesDate.toDateString();
            const today = currDate.toDateString();

            for(let i in bookings ){
                if(bookings[i]?.checkIn?.toDateString() == today ||bookings[i]?.checkOut?.toDateString() == today || bookings[i]?.checkOut == yesterday){
                    result.push(bookings[i])
                }
            }
            // console.log(result)
            let temp = []
            for(let i in result){
                const t = await villasBookingModel.findById(result[i]._id)?.populate("villaId")
                temp.push(t);
                // console.log(t)
            }
            // console.log(temp[0].villaId.name)
            return res.status(200).send(temp)
        }
    } catch (error) {

        console.log(error);
        return res.status(500).send("SomeThing went Wrong!");
    }
}