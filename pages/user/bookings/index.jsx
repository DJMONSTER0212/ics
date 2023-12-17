import React from 'react';
import '@splidejs/react-splide/css';
import Button from '@/components/website/design/Button';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import villaBookingsModel from "@/models/villaBookings.model";
import connectDB from "@/conf/database/dbConfig";
import { authOptions } from '../../api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next"
import mongoose from 'mongoose';
import moment from 'moment';
import Image from 'next/image';
import Empty from '@/components/website/design/Empty';
import { signOut } from 'next-auth/react';
import settingsModel from "@/models/settings.model";

const Booking = ({ bookings }) => {
    return (
        <div className="section-lg pt-20">
            {/* // Main section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-5 lg:gap-x-10 my-0 md:my-5">
                <div className="hidden md:block h-fit p-2 md:col-span-1 lg:col-span-1 w-full bg-white border border-gray-300 rounded-md md:sticky md:top-20">
                    {/* // Menu */}
                    <Link href='/user/account' className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                        Account settings
                    </Link>
                    <Link href='/user/bookings' className="rounded-md bg-black-500 flex items-center text-sm text-white font-regular py-1.5 px-3">
                        Bookings
                    </Link>
                    <p onClick={() => { signOut({ callbackUrl: '/' }) }} className="cursor-pointer rounded-md hover:bg-red-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                        Logout
                    </p>
                </div>
                <div className="md:col-span-2 lg:col-span-3 rounded-md">
                    <div className="mb-5">
                        <h1 className='text-2xl text-black-500 font-bold'>Bookings</h1>
                        <p className='text-base text-black-300 font-normal'>All your bookings are here</p>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        {bookings.length > 0 ?
                            bookings.map((booking, index) => (
                                <div key={index} className="bg-white rounded-md p-5 flex flex-col xs:flex-row flex-wrap lg:flex-nowrap gap-3 justify-between">
                                    {/* Image */}
                                    <Image src={booking.villa.images[0]} height={500} width={500} alt={booking.villa.name} className="aspect-[4/3] w-full xs:w-1/2 xs:h-auto md:w-1/3 md:h-auto lg:w-auto lg:h-full lg:max-w-[200px] bg-red-200 rounded-md"></Image>
                                    {/* Details */}
                                    <div className="xs:w-2/3 lg:w-auto flex-1 flex flex-col">
                                        {/* Title */}
                                        <h1 className='text-xl text-black-500 font-bold line-clamp-2'>{booking.villa.name}, {booking.villa.location.name}</h1>
                                        <p className='text-sm text-black-500 font-medium'>Booking ID: {booking._id}</p>
                                        {/* Details */}
                                        <h3 className='text-base text-black-500 font-medium mt-3'>Booked for</h3>
                                        <p className='text-sm text-black-500 font-normal'>{moment(booking.checkIn).format("DD MMM YYYY")} - {moment(booking.checkOut).format("DD MMM YYYY")}</p>
                                        <p className='text-sm text-black-500 font-normal'>{Number(booking.guests.adults) + Number(booking.guests.childs)} Guests</p>
                                    </div>
                                    {/* Status */}
                                    <div className="xs:w-full lg:w-auto flex flex-col">
                                        <p className='text-base text-green-600 font-medium mb-1'><span className='text-black-500'>Status: </span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
                                        <Link href={`/user/bookings/${booking._id}/invoice`} passHref><Button label='View invoice' className='h-fit bg-black-500 text-white hover:bg-black-500/90' /></Link>
                                    </div>
                                </div>
                            )) :
                            <Empty message={'You do not have any bookings yet.'} className='mt-5' />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

// Layout
Booking.layout = 'websiteLayout'

export default Booking;

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    // Check session >>>>>>>>>>>>>>
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin?callbackUrl=/user/bookings',
                permanent: false,
            },
        }
    }
    connectDB();
    // Fetch user >>>>>>>>>>>>>>s
    const bookings = await villaBookingsModel.aggregate([
        { $match: { 'status': 'confirmed', 'userId': mongoose.Types.ObjectId(session.user._id) } },
        {
            $lookup: {
                from: 'villas',
                localField: 'villaId',
                foreignField: '_id',
                as: 'villa'
            }
        },
        { $unwind: '$villa' },
        {
            $lookup: {
                from: 'locations',
                localField: 'villa.locationId',
                foreignField: '_id',
                as: 'villa.location'
            }
        },
        { $unwind: '$villa.location' },
    ]);
    // Fetch settings
    const fetchSettings = await settingsModel.findOne().select({website:1}).lean();
    const settings = JSON.parse(JSON.stringify(fetchSettings));
    // Get domain name
    const { req } = context;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domainName = `${protocol}://${req.headers.host}`;
    return {
        props: {
            bookings: JSON.parse(JSON.stringify(bookings)),
            seo: {
                title: `Bookings | ${settings.website?.name}`,
                desc: settings.website?.seoInfo?.metaDesc,
                fevicon: settings.website?.fevicon,
                image: settings.website?.lightLogo,
                url: domainName,
            }
        },
    }
}