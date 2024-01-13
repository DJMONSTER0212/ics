// import paymentModel from "@/models/payments.model"
import paymentsModel from "@/models/payments.model";

const getPaymentsPerMonth = async () =>{
    const temp = [0,0,0,0,0,0,0,0,0,0,0,0]
    try {
        const data = await paymentsModel.find({});
        console.log(data)
    } catch (error) {
        console.log(error);
    }

}

module.exports = getPaymentsPerMonth;