import React from "react";
import villaBookingsModel from "@/models/villaBookings.model";
import paymentsModel from "@/models/payments.model";
import connectDB from "@/conf/database/dbConfig";
import mongoose from "mongoose";
import Invoice from "@/components/website/common/Invoice";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Button from "@/components/website/design/Button";
import settingsModel from "@/models/settings.model";

const InvoiceDownload = ({ booking, websiteUrl, settings }) => {
    return (
        <div className="bg-white py-2">
            {/* // Download btn >>>>>>>>> */}
            <PDFDownloadLink document={<Invoice booking={booking} settings={settings} />} fileName={`${booking._id}.pdf`}>
                {({ loading }) => <Button type='submit' label='Download invoice' loading={loading} className='section-md h-full bg-black-500 text-white hover:bg-black-500/90' />}
            </PDFDownloadLink>
            {/* // PDF Preview >>>>>>>>> */}
            <div className="section-md w-full mx-auto mt-2 rounded-md overflow-hidden" id="invoice-content">
                <PDFViewer width="100%" height="800px">
                    <Invoice booking={booking} settings={settings} websiteUrl={websiteUrl} />
                </PDFViewer>
            </div>
        </div>
    );
};

// Layout
InvoiceDownload.layout = "default";
export default InvoiceDownload;

export async function getServerSideProps(context) {
    // Check booking id >>>>>>>>>>>>>>
    if (
        !context.query.bookingId ||
        context.query.bookingId == "123456789012" ||
        context.query.bookingId == "313233343536373839303132" ||
        !mongoose.isValidObjectId(context.query.bookingId)
    ) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    connectDB();
    // Fetch booking >>>>>>>>>>>>>>
    const booking = await villaBookingsModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(context.query.bookingId) } },
        {
            $lookup: {
                from: "villas",
                localField: "villaId",
                foreignField: "_id",
                as: "villa",
            },
        },
        { $unwind: "$villa" },
        {
            $lookup: {
                from: "locations",
                localField: "villa.locationId",
                foreignField: "_id",
                as: "villa.location",
            },
        },
        { $unwind: "$villa.location" },
    ]);
    // Fetch payments for this booking
    const payments = await paymentsModel.find({
        villaBookingId: mongoose.Types.ObjectId(context.query.bookingId),
    });
    // Total paid price
    let totalPaidPrice = 0;
    for (const payment of payments) {
        if (payment.status === "successful") {
            totalPaidPrice += payment.price;
        }
    }
    booking[0].payments = payments;
    booking[0].totalPaidPrice = totalPaidPrice;
    // Redirect the user if no villa found
    if (booking.length == 0) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    // Fetch settings
    const settings = await settingsModel.findOne().select({ website: 1 }).lean();
    // Get domain name
    const { req } = context;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domainName = `${protocol}://${req.headers.host}`;
    return {
        props: {
            booking: JSON.parse(JSON.stringify(booking[0])),
            websiteUrl: JSON.parse(JSON.stringify(process.env.BASE_URI)),
            settings: JSON.parse(JSON.stringify(settings)),
            seo: {
                title: `Booking - ${booking[0]._id} | ${settings.website?.name}`,
                desc: settings.website?.seoInfo?.metaDesc,
                fevicon: settings.website?.fevicon,
                image: settings.website?.lightLogo,
                url: domainName,
            }
        },
    };
}
