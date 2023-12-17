import connectDB from "@/conf/database/dbConfig";
import villaBookingsModel from "@/models/villaBookings.model";
import paymentsModel from "@/models/payments.model";
import couponsModel from "@/models/coupons.model";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]';

// Database 
connectDB()

export default async function handler(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions);
        // Logics
        if (req.method == 'POST') {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
            // Check for valid order id
            var validOrderId;
            try {
                validOrderId = await paymentsModel.findOne({ 'razorpay.orderId': razorpay_order_id, status: 'pending' })
            } catch (error) {
                return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in getting order id from db : ${error}`}` });
            }
            if (validOrderId.length == 0) {
                return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error: Order id is not vaild`}` });
            }
            // Verify signature >>>>>>>>>>>>>>>>>>>>
            if (!validatePaymentVerification({ "order_id": validOrderId.razorpay.orderId, "payment_id": razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET)) {
                return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error: Payment is not vaild `}` });
            }
            // Update booking entry with confirmed status to db >>>>>>>>>>>>>>>>>
            let updatedBooking;
            try {
                updatedBooking = await villaBookingsModel.findOneAndUpdate(
                    { _id: validOrderId.villaBookingId },
                    { $set: { status: 'confirmed' } },
                    { new: true }
                ).exec();
            } catch (error) {
                return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in updating booking entry : ${error}`}` });
            }
            // Update coupon usage >>>>>>>>>>>>>>>>
            if (updatedBooking.invoicePricing.discount.couponDiscount.couponCode && updatedBooking.invoicePricing.discount.couponDiscount.couponCode != '') {
                try {
                    await couponsModel.updateOne({ couponCode: updatedBooking.invoicePricing.discount.couponDiscount.couponCode }, { $push: { usedByUsers: session.user._id } })
                } catch (error) {
                    // Revert booking status
                    await villaBookingsModel.findOneAndUpdate(
                        { _id: validOrderId.villaBookingId },
                        { $set: { status: 'pending' } }
                    ).exec();
                    return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in updating coupon usage entry : ${error}`}` });
                }
            }
            // Add payment entry with successful status to db >>>>>>>>>>>>>>>>>
            try {
                await paymentsModel.updateOne({ _id: validOrderId._id, order_id: validOrderId.razorpay.orderId }, { $set: { status: 'successful', 'razorpay.paymentId': razorpay_payment_id, paymentDate: new Date() } }).exec()
            } catch (error) {
                return res.status(500).json({ error: `Booking failed. Please try again later. ${process.env.NODE_ENV == 'development' && `Error in updating payment entry : ${error}`}` });
            }
            // Send booking confrimation >>>>>>>>>>>>>>>>>
            try {
                await bookingMail(`user/bookings/${validOrderId.villaBookingId}/invoice`, session.user.email)
            } catch (error) {
            }
            // Payment successfull, redirect to new page
            res.status(302).redirect(`/user/bookings/${validOrderId.villaBookingId}/invoice`);
        } else {
            return res.status(404).json({ error: `Page not found` });
        }
    } catch (error) {
        return res.status(500).json({ error: `Something went wrong ${process.env.NODE_ENV == 'development' && `Error : ${error}`}` });
    }
}
