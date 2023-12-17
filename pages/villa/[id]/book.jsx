import React, { useState, useRef, useEffect } from 'react';
import villasModel from "@/models/villas.model";
import settingsModel from "@/models/settings.model";
import addonsModel from "@/models/addons.model";
import connectDB from "@/conf/database/dbConfig";
import mongoose from 'mongoose';
import Head from 'next/head';
import Calendar from '@/components/website/common/Calendar';
import Guests from '@/components/website/common/Guests';
import OffersApply from '@/components/website/common/OffersApply';
import Button from '@/components/website/design/Button';
import Error from "@/components/website/design/Error";
import { useRouter } from 'next/router';
import Input from '@/components/website/design/Input';
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import config from '@/tailwind.config.js';
const primaryColor = config.theme.extend.colors.primary['500']; // Primary color of website
import Addons from '@/components/website/common/Addons';
import TitleDevider from '@/components/website/design/TitleDevider';

const CheckOut = ({ villa, cancellationRules, settings, villaAddons }) => {
    const { data: session, status } = useSession({ required: true });
    const router = useRouter();
    const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' })
    const [guests, setGuests] = useState({})
    const [coupon, setCoupon] = useState(router.query.coupon || '')
    const [addons, setAddons] = useState([]);

    const checkInRef = useRef(null) // To click on check in button when clicked on book now if no dates selected
    // To Fetch prices >>>>>>>>>>>>>>>>>
    const [priceMessage, setPriceMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [priceLoading, setPriceLoading] = useState(true)
    const [price, setPrice] = useState([])
    useEffect(() => {
        const fetchVilla = async () => {
            setPriceLoading(true)
            let data = {
                villaId: villa._id,
                checkIn: selectedDates.checkIn,
                checkOut: selectedDates.checkOut,
                adults: guests.adults,
                childs: guests.childs,
                pets: guests.pets,
                coupon,
                addons: JSON.stringify(addons)
            }
            const formData = new FormData()
            for (var key in data) {
                formData.append(key, data[key]);
            }
            const response = await fetch(`/api/website/villas/price`, {
                method: "POST",
                body: formData
            });
            const responseData = await response.json();
            if (responseData.data) {
                setPrice(responseData.data);
            } else {
                setPriceMessage({ message: responseData.error, type: 'error' })
                setPrice({})
            }
            setPriceLoading(false)
        }
        if (selectedDates.checkIn && selectedDates.checkOut) {
            fetchVilla()
        }
    }, [setPriceLoading, villa._id, guests, selectedDates, coupon, addons])

    // For Guest info >>>>>>>>>>>>>>>>
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    // Set values to form
    useEffect(() => {
        if (session) {
            setValue('name', session.user.name);
            setValue('email', session.user.email);
        }
    }, [session, setValue])

    // To handle book now button [Razorpay] >>>>>>>>>>>>>>
    const [bookButtonLoading, setBookButtonLoading] = useState(false)
    const bookNow = async (data, paymentType) => {
        setBookButtonLoading(true)
        data = {
            ...data,
            villaId: villa._id,
            checkIn: selectedDates.checkIn,
            checkOut: selectedDates.checkOut,
            adults: guests.adults,
            childs: guests.childs,
            pets: guests.pets,
            coupon,
            addons: JSON.stringify(addons),
            paymentType
        }
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/website/villas/payment`, {
            method: "POST",
            body: formData
        });
        const responseData = await response.json();
        if (responseData.error) {
            setPriceMessage({ message: responseData.error, type: 'error' })
            setBookButtonLoading(false)
        } else if (responseData.redirectUrl) {
            router.push(responseData.redirectUrl);
        } else {
            setPriceMessage({ checkIn: '', checkOut: '' })
            // Set data to state
            var options = {
                "key": settings.admin.gateway.publicApiKey,
                "amount": responseData.amount,
                "currency": responseData.currency,
                "name": settings.website?.name,
                "description": `You are booking ${villa.name} for ${price.totalNights} Nights`,
                "image": settings.website?.lightLogo,
                "order_id": responseData.id,
                "callback_url": "/api/website/villas/payment-confirm",
                "theme": {
                    "color": primaryColor
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        }
        setBookButtonLoading(false)
    }
    // To close price preview >>>>>>>>>>>>>>>>>>
    const [isOpenPriceDetails, setIsOpenPriceDetails] = useState(false)
    const pricePreviewRef = useRef(null);
    const priceRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pricePreviewRef.current && !pricePreviewRef.current.contains(event.target) && !priceRef.current.contains(event.target)) {
                setIsOpenPriceDetails(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Auth >>>>>>>>>>>>>>>>
    if (status === "loading") {
        return <p className='section-lg pt-40 text-lg text-black-500 font-medium'>Loading...</p>
    }
    return (
        <>
            <Head>
                <title>{villa.seoInfo?.title || villa.name + ', ' + villa.location.name}</title>
                <meta name="description" content={villa.seoInfo?.metaDesc || villa.location.name} />
            </Head>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <div className="section-lg pt-20">
                {/* // Main section */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-y-5 md:gap-x-10 my-5 md:my-10">
                    {/* // Form sec */}
                    <div className="col-span-2 rounded-md">
                        {/* // Title and image */}
                        <div className='flex flex-col gap-1'>
                            <p className='text-lg text-black-500 font-medium'>You are booking</p>
                            <h1 className='text-xl xs:text-2xl text-black-500 font-bold'>{villa.name}, {villa.location.name}</h1>
                        </div>
                        {/* // Guest info */}
                        <form className="grid gap-4 grid-cols-1 mt-5 bg-white p-5 rounded-md">
                            <p className='text-lg text-black-500 font-medium'>Your communication details for booking</p>
                            <div className="grid grid-cols-1">
                                <Input type='text' register={register} name='name' label='Full name' validationOptions={{ required: 'Full name is required' }} placeholder='John doe' />
                                {errors.name && <Error error={errors.name.message} className='mb-0 mt-1 py-1 text-base' />}
                            </div>
                            <div className="grid gap-4 grid-cols-1 xs:grid-cols-2">
                                <div className="flex flex-col">
                                    <Input type='email' register={register} name='email' label='Email' validationOptions={{ required: 'Email is required' }} placeholder='yourmail@example.com' />
                                    {errors.email && <Error error={errors.email.message} className='py-1 text-base mb-0 mt-1' />}
                                </div>
                                <div className="flex flex-col">
                                    <Input type='number' register={register} name='phone' label='Phone number' validationOptions={{ required: 'Phone number is required', validate: (value) => value.length == 10 ? true : 'Phone number should have 10 digits' }} placeholder='1234569807' />
                                    {errors.phone && <Error error={errors.phone.message} className='py-1 text-base mb-0 mt-1' />}
                                </div>
                            </div>
                        </form>
                        {/* // Cancellation policies */}
                        {cancellationRules.length > 0 && <div className='mt-10 bg-white border border-black-500 rounded-md py-2 px-4'>
                            <h3 className='text-xl text-black-500 font-medium'>Cancellation {cancellationRules.length > 1 ? 'policies' : 'policy'}</h3>
                            <div className="mt-3">
                                <ul className='list-disc flex flex-col gap-1'>
                                    {cancellationRules.map((rule, index) => (
                                        <li key={index} className='ml-4 text-base text-black-500 font-normal'><span className='font-medium'>{rule.refundablePrice == '0' ? 'No refund' : rule.refundablePrice == '100' ? 'Free cancellation,' : rule.refundablePrice + '% Price will be refunded.'}</span> If canceled before {rule.daysBeforeCheckIn} days of the check-in date.</li>
                                    ))}
                                </ul>
                            </div>
                        </div>}
                    </div>
                    {/* // Price section */}
                    <div className="h-fit pb-2 px-4 md:col-span-2 lg:col-span-1 w-full bg-white border border-gray-300 rounded-md md:order-2 md:sticky md:top-20">
                        {/* Dates */}
                        <Calendar settings={settings} query={router.query} ref={checkInRef} setSelectedDates={setSelectedDates} />
                        {/* Guests */}
                        <Guests
                            query={router.query}
                            setGuests={setGuests}
                            minGuest={villa.minGuest}
                            maxGuest={villa.maxGuest}
                            childAllowed={villa.childAllowed}
                            maxChild={villa.maxChild}
                            petAllowed={villa.petAllowed}
                        />
                        {/* // Only available after selecting check-in and check-out date */}
                        {selectedDates.checkIn && selectedDates.checkOut &&
                            <>
                                {/* Coupon code */}
                                <OffersApply query={router.query} priceLoading={priceLoading} price={price} setCoupon={setCoupon} villaId={villa._id} className='mt-3' />
                                {/* // Addons */}
                                {villaAddons.length > 0 &&
                                    <>
                                        <TitleDevider title='Addons' className='my-3' />
                                        <Addons settings={settings} villaAddons={villaAddons} setAddons={setAddons} />
                                    </>
                                }
                                {/* // Price breakdown */}
                                {priceLoading ?
                                    <div className="bg-gray-50 rounded-md px-3 py-1.5 animate-pulse mt-3">
                                        <div className="flex gap-5 items-center justify-between select-none">
                                            <div className="bg-gray-200 w-[30%] h-5 rounded-md"></div>
                                            <div className="bg-gray-200 w-[20%] h-10 rounded-md"></div>
                                        </div>
                                        <div className="bg-gray-200 w-[60%] h-4 rounded-md mb-0.5"></div>
                                    </div> : priceMessage.type == 'error' ?
                                        <Error error={priceMessage.message} className='mt-3 mb-0' /> :
                                        <>
                                            <div className="relative mt-3">
                                                <div ref={pricePreviewRef} className={`${isOpenPriceDetails ? 'py-2 h-fit border-x border-t transition-all duration-200 bg-gray-50 rounded-t-md' : 'py-0 h-0 overflow-hidden border-none transition-all duration-200'} w-full absolute left-0 bottom-16 mb-1 border-gray-300 grid grid-col-1 gap-2 mt-3 px-2`}>
                                                    <div className="flex items-start gap-3 justify-between">
                                                        <div className="flex flex-col">
                                                            <p className='text-base text-black-500'>{price.totalNights} Night{Number(price.totalNights) > 1 ? 's' : ''} Price</p>
                                                            <p className='text-sm text-black-300'>For {guests.adults + guests.childs} guest{guests.adults + guests.childs > 1 ? 's' : ''}</p>
                                                        </div>
                                                        <p className='text-base text-black-400 '>{settings.website?.currencySymbol} {price.perNightPrice} X {price.totalNights}</p>
                                                    </div>
                                                    {(price.discount.totalPriceDiscount > 0 || price.discount.couponDiscount.couponCode) &&
                                                        <>
                                                            <TitleDevider title='Discounts' />
                                                            {price.discount.totalPriceDiscount > 0 && <div className="flex items-center gap-3 justify-between">
                                                                <p className='text-base text-black-500 dark:text-white'>Price discount</p>
                                                                <p className='text-base text-black-400 dark:text-black-200'>- {settings.website?.currencySymbol} {price.discount.totalPriceDiscount}</p>
                                                            </div>}
                                                            {price.discount.couponDiscount.couponCode &&
                                                                <div className="flex items-center gap-3 justify-between">
                                                                    <div className="flex flex-col">
                                                                        <p className='text-base text-black-500 dark:text-white'>Coupon discount</p>
                                                                        <p className='text-sm text-black-300 dark:text-black-200'>Code: {price.discount.couponDiscount.couponCode}</p>
                                                                    </div>
                                                                    <p className='text-base text-black-400 dark:text-black-200'>- {settings.website?.currencySymbol} {price.discount.couponDiscount.price}</p>
                                                                </div>
                                                            }
                                                        </>
                                                    }
                                                    {price.taxes.appliedTaxes.length > 0 &&
                                                        <>
                                                            <TitleDevider title='Taxes' />
                                                            {price.taxes.appliedTaxes.map((tax, index) => (
                                                                <div key={index} className="flex items-center gap-3 justify-between">
                                                                    <p className='text-base text-black-500 dark:text-white'>{tax.name} ({tax.price}%)</p>
                                                                    <p className='text-base text-black-400 dark:text-black-200'>{settings.website?.currencySymbol} {tax.appliedPrice}</p>
                                                                </div>
                                                            ))}
                                                        </>
                                                    }
                                                    {price.addons.appliedAddons.length > 0 &&
                                                        <>
                                                            <TitleDevider title='Addons' />
                                                            {price.addons.appliedAddons.map((addon, index) => (
                                                                <div key={index} className="flex items-center gap-3 justify-between">
                                                                    <p className='text-base text-black-500 dark:text-white'>{addon.name}</p>
                                                                    <p className='text-base text-black-400 dark:text-black-200'>{settings.website?.currencySymbol} {addon.price}</p>
                                                                </div>
                                                            ))}
                                                        </>
                                                    }
                                                    <TitleDevider title='Total' />
                                                    <div className="flex items-center gap-3 justify-between">
                                                        <div className="flex flex-col">
                                                            <p className='text-base font-medium text-black-500 dark:text-white'>Price to be paid</p>
                                                            <p className='text-sm text-black-300 dark:text-black-200'>For {price.totalNights} Night{Number(price.totalNights) > 1 ? 's' : ''} and {guests.adults + guests.childs} guest{guests.adults + guests.childs > 1 ? 's' : ''}</p>
                                                        </div>
                                                        <p className='text-lg text-black-500 dark:text-white font-bold'>{settings.website?.currencySymbol} {price.priceToBePaid.full}</p>
                                                    </div>
                                                    {price.priceToBePaid.minimum && price.priceToBePaid.minimum < price.priceToBePaid.full &&
                                                        <div className="flex items-center gap-3 justify-between">
                                                            <p className='text-sm text-black-500 dark:text-white'>Min. Price to be paid</p>
                                                            <p className='text-sm text-black-400 dark:text-black-200'>{settings.website?.currencySymbol} {price.priceToBePaid.minimum}</p>
                                                        </div>
                                                    }
                                                </div>
                                                <div ref={priceRef} onClick={() => setIsOpenPriceDetails(!isOpenPriceDetails)} className={`${isOpenPriceDetails ? 'border-x border-b border-gray-300 rounded-b-md bg-white pt-1.5 pb-1.5' : 'rounded-md bg-gray-50 py-1.5'} px-3`}>
                                                    <div className="flex gap-5 items-center justify-between select-none">
                                                        <p className="text-lg text-black-500 font-medium flex gap-2 items-center">Price to be paid <span className='cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>' }}></span></p>
                                                        <p className="text-2xl text-black-500 font-semibold">{settings.website?.currencySymbol} {price.priceToBePaid.full}</p>
                                                    </div>
                                                    <p className="text-sm text-black-500 font-normal">For {price.totalNights} Night{Number(price.totalNights) > 1 ? 's' : ''} and {guests.adults + guests.childs} guest{guests.adults + guests.childs > 1 ? 's' : ''} {price.taxes.appliedTaxes.length > 0 && ', Taxes included'}</p>
                                                </div>
                                            </div>
                                            {price.priceToBePaid.minimum != 0 && price.priceToBePaid.minimum && price.priceToBePaid.minimum > 0 && price.priceToBePaid.minimum < price.priceToBePaid.full && <Button onClick={handleSubmit((data) => { selectedDates.checkIn && selectedDates.checkOut ? bookNow(data, 'min') : checkInRef.current.click() })} label={`Book now, pay ${settings.website?.currencySymbol} ${price.priceToBePaid.minimum} upfront, rest later.`} className={`${price.status == 0 ? 'bg-gray-100 hover:bg-gray-200 text-black-300 cursor-not-allowed' : 'bg-gradient-to-bl from-primary-500/80 to-secondary-500 hover:bg-black-500/90'} mt-3 `} />}
                                        </>
                                }
                            </>
                        }
                        {/* // Book button */}
                        <Button loading={bookButtonLoading} disabled={priceMessage.type == 'error' ? true : false} onClick={handleSubmit((data) => { selectedDates.checkIn && selectedDates.checkOut ? bookNow(data, 'full') : checkInRef.current.click() })} label={`Book now`} className={`Book now bg-black-500 hover:bg-black-500/90 mt-3`} />
                    </div>
                </div>
            </div>
        </>
    )
}

// Layout
CheckOut.layout = 'websiteLayout'
export default CheckOut;


export async function getServerSideProps(context) {

    // Check villa id >>>>>>>>>>>>>>
    if (!context.query.id || (context.query.id == '123456789012' || context.query.id == '313233343536373839303132') || !mongoose.isValidObjectId(context.query.id)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    connectDB();
    // Fetch settings >>>>>>>>>>>>>>s
    const settings = await settingsModel.findOne().lean();
    // Fetch villa >>>>>>>>>>>>>>
    const villas = await villasModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(context.query.id), 'verification.verified': true, block: false, bookingAllowed: true } },
        {
            $lookup: {
                from: 'locations',
                localField: 'locationId',
                foreignField: '_id',
                as: 'location'
            }
        },
        { $unwind: '$location' },
    ]);
    // Redirect the user if no villa found
    if (villas.length == 0 || !settings.admin.booking.enableBookingsVilla) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    // Cancellation rules >>>>>>>>>>>>>>>>>
    var cancellationRules = [];
    if (!settings.admin.cancellation.letOwnerManageCancellation && settings.admin.cancellation.allowCancellation) {
        cancellationRules = settings.admin.cancellation.cancellationRules
    } else if (settings.admin.cancellation.letOwnerManageCancellation) {
        if (villas[0].cancellation.allowCancellation) {
            cancellationRules = villas[0].cancellation.cancellationRules
        }
    }
    // Addons >>>>>>>>>>>>>>>>>
    const villaAddons = await addonsModel.find({
        villaId: villas[0]._id,
    }).lean();
    // Get domain name
    const { req } = context;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domainName = `${protocol}://${req.headers.host}`;
    return {
        props: {
            villa: JSON.parse(JSON.stringify(villas[0])),
            cancellationRules: JSON.parse(JSON.stringify(cancellationRules)),
            settings: JSON.parse(JSON.stringify(settings)),
            villaAddons: JSON.parse(JSON.stringify(villaAddons)),
            seo: {
                title: `${villas[0].seoInfo?.title || villas[0].name + ', ' + villas[0].location.name} | ${settings.website?.name}`,
                desc: `${villas[0].seoInfo?.metaDesc || villas[0].location.name}`,
                fevicon: settings.website?.fevicon,
                image: settings.website?.lightLogo,
                url: domainName,
            }
        },
    }
}