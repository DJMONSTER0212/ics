import paymentsModel from "@/models/payments.model"
import villaBookingsModel from "@/models/villaBookings.model"
import contactsModel from "@/models/contacts.model"

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req, res) {
    try {
        if (req.method == "GET") {
            // const currDate = new Date().toDateString();
            const currDate = new Date().getMonth();
            const currYear = new Date().getFullYear();
            // console.log(currYear)
            let newPayments = 0;
            let newBookings = 0;
            let newContacts = 0;
            const bookings = await villaBookingsModel.find({});
            const payments = await paymentsModel.find({});
            const contacts = await contactsModel.find({});

            for (let i in bookings) {
                // if (new Date(bookings[i].createdAt).toDateString() == currDate) newBookings = newBookings + 1;
                if ((new Date(bookings[i].createdAt).getMonth() == currDate) &&( new Date(bookings[i].createdAt).getFullYear() == currYear )) newBookings = newBookings + 1;
            }
            for (let i in payments) {
                // if (new Date(payments[i].createdAt).toDateString() == currDate) newPayments = newPayments + 1;
                if ((new Date(payments[i].createdAt).getMonth() == currDate) && (new Date(payments[i].createdAt).getFullYear() == currYear) ) newPayments = newPayments + 1;
            }
            for (let i in contacts) {
                // if (new Date(contacts[i].createdAt).toDateString() == currDate) newcontacts = newcontacts + 1;
                if ((new Date(contacts[i].createdAt).getMonth() == currDate) && (new Date(contacts[i].createdAt).getFullYear() == currYear) ) newContacts = newContacts + 1;
            }



            return res.status(200).send({ newPayments: newPayments, newBookings: newBookings, newContacts : newContacts });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send("SomeThing went Wrong")
    }
}