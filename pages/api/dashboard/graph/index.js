import paymentsModel from "@/models/payments.model";

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req,res){
    try {
        if(req.method == "GET"){

            const payments = await paymentsModel.find({})
            const currYear = new Date().getFullYear();
            const currMonth = new Date().getMonth();
            const temp = [0,0,0,0,0,0,0,0,0,0,0,0]
            for ( let i in payments){
                if(payments[i]?.paymentDate?.getFullYear() == currYear){
                    const month = payments[i]?.paymentDate?.getMonth();
                    if(month>=0){
                        temp[month]+= parseFloat(payments[i]?.advancePaid)
                    }
                }
            }

            const chartLabels = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct','Nov','Dec'];
            const newLabels = chartLabels.slice(0 , currMonth+1);
            const newChartData = temp.slice(0,currMonth + 1);
            res.status(200).send({chartData : newChartData, chartLabels : newLabels })

        }
    } catch (error) {
        console.log(error)
    }
}