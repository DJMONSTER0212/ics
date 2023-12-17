import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Textarea from '@/components/panel/design/Textarea'
import Image from 'next/image'
import moment from 'moment'
import Link from 'next/link'
import TitleDevider from '@/components/panel/design/TitleDevider'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'
import Calendar from './Calendar'
import Guests from './Guests'
import Addons from './Addons'
import RemoveAddons from './RemoveAddons'

const EditVillaBooking = ({ editVillaBookingDrawer, setEditVillaBookingDrawer, editMessage, setEditMessage, settings, reFetch, session, editVillaBookingId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For drawer view type
    const [viewType, setViewType] = useState('details')
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for VillaBooking types
    let sources = [
        { value: 'panel', label: 'Panel' },
        { value: 'other', label: 'Other' },
    ]
    // Values for status
    let statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'cancelled', label: 'Cancelled' },
    ]
    // For edit villa booking >>>>>>>>>>>>>>>>
    const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
    const [guests, setGuests] = useState({});
    const [newAddons, setNewAddons] = useState([]);
    const [removeAddons, setRemoveAddons] = useState([]);
    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm()
    const src = useWatch({ control, name: 'src' });
    const checkedIn = useWatch({ control, name: 'checkedIn' });
    const status = useWatch({ control, name: 'status' });
    // Edit villa booking handler
    const [refetchVillaBooking, setRefetchVillaBooking] = useState(true)
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        // Check check-in and check-out date is not empty
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            setEditMessage({ message: 'Please select stay dates.', type: 'error' });
            setSubmitLoading(false)
            return;
        } else {
            data.checkIn = selectedDates.checkIn;
            data.checkOut = selectedDates.checkOut;
        }
        // Check guests is not empty
        if (!guests) {
            setEditMessage({ message: 'Please select guests.', type: 'error' });
            setSubmitLoading(false)
            return;
        } else {
            data.adults = guests.adults;
            data.childs = guests.childs;
            data.pets = guests.pets;
        }
        // Add new addons
        data.newAddons = JSON.stringify(newAddons)
        // Add addons to be removed
        data.removeAddons = JSON.stringify(removeAddons)
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villa-bookings/admin/${data._id}`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setEditMessage({ message: responseData.error, type: 'error' })
        } else {
            setEditMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            setRefetchVillaBooking(!refetchVillaBooking)
        }
        setSubmitLoading(false)
    }
    // Fetch villa booking >>>>>>>>>>>>>>>>>
    const [villaBooking, setVillaBooking] = useState({})
    const fetchBooking = useCallback(async (id) => {
        setDrawerLoading(true)
        const fetchBooking = await fetch(`/api/panel/villa-bookings/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const booking = await fetchBooking.json();
        if (booking.data) {
            // Set value to form >>>>>>>>>>>>>>>>>
            const villaBookingData = { ...booking.data };
            // Reset form
            reset()
            // Set main guest details
            villaBookingData.name = villaBookingData.mainGuestInfo.name;
            villaBookingData.email = villaBookingData.mainGuestInfo.email;
            villaBookingData.phone = villaBookingData.mainGuestInfo.phone;
            delete villaBookingData.mainGuestInfo;
            // Set stay dates to form
            if (villaBookingData.status == 'confirmed' && villaBookingData.checkedIn && villaBookingData.checkedOut) {
                villaBookingData.checkedIn = villaBookingData.checkedIn.split('T')[0]
                villaBookingData.checkedOut = villaBookingData.checkedOut.split('T')[0]
            }
            Object.entries(villaBookingData).forEach(([name, value]) => setValue(name, value));
            // Set value to states >>>>>>>>>>>>>>>>>
            setVillaBooking(booking.data)
            setSelectedDates({ checkIn: booking.data.checkIn, checkOut: booking.data.checkOut })
            setGuests(villaBookingData.guests)
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: booking.error, type: 'error' })
            setEditVillaBookingDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditVillaBookingDrawer, setValue, setGlobalMessage])
    // To fetch villa booking
    useEffect(() => {
        if (editVillaBookingId) {
            fetchBooking(editVillaBookingId)
        }
    }, [editVillaBookingId, fetchBooking, refetchVillaBooking])
    // To fetch villa addons on villa booking fetch >>>>>>>>>>>>>>>>
    const [villaAddons, setVillaAddons] = useState({})
    // To fetch addons
    useEffect(() => {
        const fetchAddons = async (villaId) => {
            const fetchAddons = await fetch(`/api/panel/villas/admin/${villaId}/addons`);
            const addons = await fetchAddons.json();
            if (addons.data) {
                // Remove already added addons from the list
                villaBooking.invoicePricing.addons.appliedAddons.map((appliedAddon) => {
                    addons.data = addons.data.filter(addon => addon._id != appliedAddon.addonId)
                })
                setVillaAddons(addons.data)  // Set data in addon
            } else {
                setEditMessage({ message: addons.error, type: 'error' })
            }
        }
        if (villaBooking.villaId) {
            fetchAddons(villaBooking.villaId)
        }
    }, [villaBooking, setEditMessage])
    // To send confirmation mail
    const [sendingMail, setSendingMail] = useState(false)
    const sendConfirmation = async (mail, bookingId) => {
        setSendingMail(true)
        const formData = new FormData()
        // Adding data to formdata
        formData.append('mail', mail);
        formData.append('bookingId', bookingId);
        await fetch(`/api/panel/villa-bookings/admin/send-confirmation`, {
            method: "POST",
            body: formData
        })
        setSendingMail(false)
    }
    return (
        <Drawer title={'Edit Booking'} drawer={editVillaBookingDrawer} setDrawer={setEditVillaBookingDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> : Object.keys(villaBooking).length > 0 &&
                <>
                    <Tabs>
                        <TabButton onClick={() => setViewType('details')} label='Details' activeTab={viewType} tabName='details' />
                        <TabButton onClick={() => setViewType('edit')} label='Edit' activeTab={viewType} tabName='edit' />
                    </Tabs>
                    {/* // Info >>>> */}
                    {viewType == 'details' &&
                        <div className="grid grid-cols-1 gap-3 mt-5">
                            {/* // Booking Id */}
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex items-base gap-2">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Booking ID</p>
                                    {villaBooking.status == 'confirmed' && <p className='text-sm font-medium text-green-700'>{villaBooking.status.charAt(0).toUpperCase() + villaBooking.status.slice(1)}</p>}
                                    {villaBooking.status == 'pending' && <p className='text-sm font-medium text-orange-600'>{villaBooking.status.charAt(0).toUpperCase() + villaBooking.status.slice(1)}</p>}
                                    {villaBooking.status == 'cancelled' && <p className='text-sm font-medium text-red-600'>{villaBooking.status.charAt(0).toUpperCase() + villaBooking.status.slice(1)}</p>}
                                </div>
                                <p className='text-base text-black-400 dark:text-black-200'>{villaBooking._id}</p>
                            </div>
                            {/* // Stay details */}
                            <div className="grid grid-cols-1 gap-1">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Booked for</p>
                                <p className='text-base text-black-400 dark:text-black-200'>{moment(villaBooking.checkIn).format('DD MMM YYYY') + ' to ' + moment(villaBooking.checkOut).format('DD MMM YYYY')}</p>
                            </div>
                            {villaBooking.status == 'confirmed' && villaBooking.checkedIn || villaBooking.checkedOut &&
                                <div className="grid grid-cols-1 gap-1">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Stay between</p>
                                    <p className='text-base text-black-400 dark:text-black-200'>{moment(villaBooking.checkedIn).format('DD MMM YYYY') + ' to ' + moment(villaBooking.checkedOut).format('DD MMM YYYY')}</p>
                                </div>
                            }
                            {/* // Booking src details */}
                            {villaBooking.src != 'other' &&
                                <div className="grid grid-cols-1 gap-1">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Booking SRC</p>
                                    <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.src.charAt(0).toUpperCase() + villaBooking.src.slice(1)}</p>
                                </div>
                            }
                            {villaBooking.src == 'other' &&
                                <div className="grid grid-cols-1 gap-1">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Booking SRC</p>
                                    <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.srcDesc}</p>
                                </div>
                            }
                            {/* // Booked for user details */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Booked for</p>
                                <Link href={`/panel/admin/users?searchOption=email&search=${villaBooking.user.email}`}>
                                    <div className="flex items-center gap-x-3 rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 p-2">
                                        <Image className="object-cover w-12 h-12 rounded-sm" src={villaBooking.user.image} width='35' height='35' alt="x" />
                                        <div>
                                            <h2 className="text-base font-medium text-black-500 dark:text-white flex gap-2 items-center">{villaBooking.user.name}</h2>
                                            <p className="text-sm font-normal text-black-400 dark:text-black-200">{villaBooking.user.email}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {/* // Villa details */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Villa</p>
                                <Link href={`/panel/admin/villas/${villaBooking.villa._id}/general`} passHref className="flex gap-x-3 rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 p-2">
                                    <Image className="rounded-sm" src={villaBooking.villa.images[0]} width='70' height='45' alt="x" />
                                    <div>
                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{villaBooking.villa.name}</h2>
                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">{villaBooking.villa.location.name}</p>
                                    </div>
                                </Link>
                            </div>
                            {/* // Main guest and guests details  */}
                            {villaBooking.mainGuestInfo &&
                                <div className="grid grid-cols-1 gap-3">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Main Guest and guests</p>
                                    <div className="rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 px-3 py-2 grid grid-cols-1 gap-1">
                                        <div className="grid grid-cols-1 gap-1">
                                            <p className='text-base font-medium text-black-500 dark:text-white'>Name</p>
                                            <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.mainGuestInfo.name}</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1">
                                            <p className='text-base font-medium text-black-500 dark:text-white'>Email</p>
                                            <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.mainGuestInfo.email}</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1">
                                            <p className='text-base font-medium text-black-500 dark:text-white'>Phone number</p>
                                            <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.mainGuestInfo.phone}</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1">
                                            <p className='text-base font-medium text-black-500 dark:text-white'>Guests</p>
                                            <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.guests.adults} Adults, {villaBooking.guests.childs} Childs, {villaBooking.guests.pets} Pets</p>
                                        </div>
                                    </div>
                                </div>
                            }
                            {/* // Applied pricing */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Applied pricing</p>
                                <div className="rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 px-3 py-2 grid grid-cols-1 gap-1">
                                    <div className="flex justify-between items-center gap-1">
                                        <p className='text-base font-medium text-black-500 dark:text-white'>Base price</p>
                                        <p className='text-base text-black-400 dark:text-black-200'> {settings.website.currencySymbol} {villaBooking.appliedPricing.basePrice}</p>
                                    </div>
                                    {villaBooking.appliedPricing.discountedPrice > 0 && <div className="flex justify-between items-center gap-1">
                                        <p className='text-base font-medium text-black-500 dark:text-white'>Discounted price</p>
                                        <p className='text-base text-black-400 dark:text-black-200'> {settings.website.currencySymbol} {villaBooking.appliedPricing.discountedPrice}</p>
                                    </div>}
                                    <div className="flex justify-between items-center gap-1">
                                        <p className='text-base font-medium text-black-500 dark:text-white'>Extra guest price</p>
                                        <p className='text-base text-black-400 dark:text-black-200'> {settings.website.currencySymbol} {villaBooking.appliedPricing.extraGuestPrice}</p>
                                    </div>
                                    <div className="flex justify-between items-center gap-1">
                                        <p className='text-base font-medium text-black-500 dark:text-white'>Child price</p>
                                        <p className='text-base text-black-400 dark:text-black-200'> {settings.website.currencySymbol} {villaBooking.appliedPricing.childPrice}</p>
                                    </div>
                                </div>
                            </div>
                            {/* // Price details and invoice download */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Price Details</p>
                                <div className="mb-1 rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 py-2 px-3">
                                    <div className="grid grid-cols-1 gap-1">
                                        <div className="flex items-start gap-3 justify-between">
                                            <div className="flex flex-col">
                                                <p className='text-base text-black-500 dark:text-white'>{villaBooking.invoicePricing.totalNights} Night{Number(villaBooking.invoicePricing.totalNights) > 1 ? 's' : ''} Price</p>
                                                <p className='text-sm text-black-300 dark:text-black-200'>For {villaBooking.guests.adults + villaBooking.guests.childs} guest{villaBooking.guests.adults + villaBooking.guests.childs > 1 ? 's' : ''}</p>
                                            </div>
                                            <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {villaBooking.invoicePricing.perNightPrice} X {villaBooking.invoicePricing.totalNights}</p>
                                        </div>
                                        {(villaBooking.invoicePricing.discount.totalPriceDiscount > 0 || villaBooking.invoicePricing.discount.couponDiscount.couponCode) &&
                                            <>
                                                <TitleDevider title='Discounts' />
                                                {villaBooking.invoicePricing.discount.totalPriceDiscount > 0 && <div className="flex items-center gap-3 justify-between">
                                                    <p className='text-base text-black-500 dark:text-white'>Price discount</p>
                                                    <p className='text-base text-black-400 dark:text-black-200'>- {settings.website.currencySymbol} {villaBooking.invoicePricing.discount.totalPriceDiscount}</p>
                                                </div>}
                                                {villaBooking.invoicePricing.discount.couponDiscount.couponCode &&
                                                    <div className="flex items-center gap-3 justify-between">
                                                        <div className="flex flex-col">
                                                            <p className='text-base text-black-500 dark:text-white'>Coupon discount</p>
                                                            <p className='text-sm text-black-300 dark:text-black-200'>Code: {villaBooking.invoicePricing.discount.couponDiscount.couponCode}</p>
                                                        </div>
                                                        <p className='text-base text-black-400 dark:text-black-200'>- {settings.website.currencySymbol} {villaBooking.invoicePricing.discount.couponDiscount.price}</p>
                                                    </div>
                                                }
                                            </>
                                        }
                                        {villaBooking.invoicePricing.taxes.appliedTaxes.length > 0 &&
                                            <>
                                                <TitleDevider title='Taxes' />
                                                {villaBooking.invoicePricing.taxes.appliedTaxes.map((tax, index) => (
                                                    <div key={index} className="flex items-center gap-3 justify-between">
                                                        <p className='text-base text-black-500 dark:text-white'>{tax.name} ({tax.price}%)</p>
                                                        <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {tax.appliedPrice}</p>
                                                    </div>
                                                ))}
                                            </>
                                        }
                                        {villaBooking.invoicePricing.addons.appliedAddons.length > 0 &&
                                            <>
                                                <TitleDevider title='Addons' />
                                                {villaBooking.invoicePricing.addons.appliedAddons.map((addon, index) => (
                                                    <div key={index} className="flex items-center gap-3 justify-between">
                                                        <p className='text-base text-black-500 dark:text-white'>{addon.name}</p>
                                                        <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {addon.price}</p>
                                                    </div>
                                                ))}
                                            </>
                                        }
                                        {(villaBooking.invoicePricing.directDiscount && villaBooking.invoicePricing.directDiscount > 0) &&
                                            <>
                                                <TitleDevider title='Direct discounts' />
                                                <div className="flex items-center gap-3 justify-between">
                                                    <p className='text-base text-black-500 dark:text-white'>Direct discount</p>
                                                    <p className='text-base text-black-400 dark:text-black-200'>- {settings.website.currencySymbol} {villaBooking.invoicePricing.directDiscount}</p>
                                                </div>
                                            </>
                                        }
                                        <TitleDevider title='Total' />
                                        <div className="flex items-center gap-3 justify-between">
                                            <div className="flex flex-col">
                                                <p className='text-base font-medium text-black-500 dark:text-white'>Price to be paid</p>
                                                <p className='text-sm text-black-300 dark:text-black-200'>For {villaBooking.invoicePricing.totalNights} Night{Number(villaBooking.invoicePricing.totalNights) > 1 ? 's' : ''} and {villaBooking.guests.adults + villaBooking.guests.childs} guest{villaBooking.guests.adults + villaBooking.guests.childs > 1 ? 's' : ''}</p>
                                            </div>
                                            <p className='text-lg text-black-500 dark:text-white font-bold'>{settings.website.currencySymbol} {villaBooking.invoicePricing.priceToBePaid.full}</p>
                                        </div>
                                        <div className="flex items-center gap-3 justify-between">
                                            <p className='text-sm text-black-500 dark:text-white'>Min. Price to be paid</p>
                                            <p className='text-sm text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {villaBooking.invoicePricing.priceToBePaid.minimum}</p>
                                        </div>
                                    </div>
                                </div>
                                {villaBooking.status == 'confirmed' && <Link href={`/user/bookings/${villaBooking._id}/invoice`} passHref target='_blank'><Button label='Download invoice' /></Link>}
                                {villaBooking.status == 'confirmed' && <Button onClick={()=>{sendConfirmation(villaBooking.user.email, villaBooking._id)}} variant='secondary' loading={sendingMail} className='bg-primary-100 text-primary-500 border h-8 -mt-2' label='Send confirmation' />}
                            </div>
                            {/* // Payments */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="select-none flex items-center gap-3 justify-between cursor-pointer">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Payments for this booking</p>
                                    <p className='text-base text-black-400 dark:text-black-200'>{villaBooking.payments.length}</p>
                                </div>
                                <div className="rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 px-3 py-2 grid grid-cols-1 gap-1">
                                    <div className="grid grid-cols-1">
                                        <div className="flex items-center gap-3 justify-between">
                                            <p className='text-base font-medium text-black-500 dark:text-white'>Price Paid</p>
                                            <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {villaBooking.totalPaidPrice}</p>
                                        </div>
                                        <div className="flex items-center gap-3 justify-between pb-2 border-b border-gray-300">
                                            <p className='text-base font-medium text-black-500 dark:text-white'>Remaining Price</p>
                                            <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {Number(villaBooking.invoicePricing.priceToBePaid.full) - Number(villaBooking.totalPaidPrice)}</p>
                                        </div>
                                        {/* // Payments */}
                                        {villaBooking.payments && villaBooking.payments.length > 0 ?
                                            <div className="grid grid-cols-1 gap-1 mt-2">
                                                {villaBooking.payments.map((payment, index) => (
                                                    <div key={index} className="grid grid-cols-1 gap-1 bg-gray-100 rounded-md p-2">
                                                        <div className="flex flex-col gap-0">
                                                            <div className="flex gap-2 items-center">
                                                                <p className="text-xs bg-gray-300 dark:bg-black-400/40 px-1.5 py-0.5 w-fit rounded-sm text-black-500 dark:text-white">{payment.src != 'other' ? payment.src.charAt(0).toUpperCase() + payment.src.slice(1) : payment.srcDesc} {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} payment</p>
                                                                {payment.status == 'successful' && <p className='text-sm font-medium text-green-700'>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>}
                                                                {payment.status == 'pending' && <p className='text-sm font-medium text-orange-600'>{payment.status.charAt(0).toUpperCase() + villaBooking.status.slice(1)}</p>}
                                                                {payment.status == 'cancelled' && <p className='text-sm font-medium text-red-600'>{payment.status.charAt(0).toUpperCase() + villaBooking.status.slice(1)}</p>}
                                                            </div>
                                                            {(payment.status == 'successful' && payment.src == 'razorpay' || payment.src == 'upi') && <div className="flex flex-col">
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">{payment.src == 'razorpay' ? 'Payment ID' : payment.src == 'upi' && 'Ref. No.'}</p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{payment.src == 'razorpay' ? payment.razorpay.paymentId : payment.src == 'upi' && payment.upi.refNo}</p>
                                                            </div>}
                                                        </div>
                                                        <div className="flex items-center gap-3 justify-between">
                                                            <p className='text-base font-medium text-black-500 dark:text-white'>Type</p>
                                                            <p className='text-base text-black-400 dark:text-black-200'>{payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} payment</p>
                                                        </div>
                                                        <div className="flex items-center gap-3 justify-between">
                                                            <p className='text-base font-medium text-black-500 dark:text-white'>Price range</p>
                                                            <p className='text-base text-black-400 dark:text-black-200'>{payment.range.charAt(0).toUpperCase() + payment.range.slice(1)} payment</p>
                                                        </div>
                                                        <div className="flex items-center gap-3 justify-between">
                                                            <p className='text-base font-medium text-black-500 dark:text-white'>Price</p>
                                                            <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {payment.price}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3 justify-between">
                                                            <p className='text-base font-medium text-black-500 dark:text-white'>Payment Date</p>
                                                            <p className='text-base text-black-400 dark:text-black-200'>{moment(payment.paymentDate).format("DD MMM YYYY")}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div> :
                                            <p className='text-black-300 dark:text-black-200 text-base mt-2'>No transactions for this booking found</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div >
                    }
                    {/* // Booking updates >>>> */}
                    {viewType == 'edit' &&
                        <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                            {editMessage.type == 'error' && <Error error={editMessage.message} className='mb-0' />}
                            {editMessage.type == 'success' && <Success success={editMessage.message} className='mb-0' />}
                            <Calendar
                                settings={settings}
                                checkIn={villaBooking.checkIn}
                                checkOut={villaBooking.checkOut}
                                setSelectedDates={setSelectedDates}
                            />
                            {/* Guests */}
                            <Guests
                                settings={settings}
                                guests={villaBooking.guests}
                                setGuests={setGuests}
                                minGuest={villaBooking.villa.minGuest}
                                maxGuest={villaBooking.villa.maxGuest}
                                maxChild={villaBooking.villa.maxChild}
                                petAllowed={villaBooking.villa.petAllowed}
                            />
                            {villaBooking.src != 'website' &&
                                <>
                                    <Controller
                                        name='src'
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                if (value == null) {
                                                    return "Booking source is required"
                                                }
                                                return true
                                            }
                                        }}
                                        render={({ field }) => {
                                            return <SelectInput
                                                options={sources}
                                                className="mb-3"
                                                value={sources.filter((source) => source.value == field.value)}
                                                label='Booking source'
                                                isSearchable={false}
                                                onChange={(e) => field.onChange(e.value)}
                                                required={true}
                                            />
                                        }}
                                    />
                                    {errors.src && <Error error={errors.src.message} className='mb-3 py-1 text-base' />}
                                </>
                            }
                            {src == 'other' &&
                                <>
                                    <Input type='text' name='srcDesc' register={register} label='Enter booking source' validationOptions={{ required: 'A booking source is required' }} placeholder='Ex: Airbnb' className='mb-3' />
                                    {errors.srcDesc && <Error error={errors.srcDesc.message} className='mb-3 py-1 text-base' />}
                                </>
                            }
                            <Controller
                                name='status'
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value == null) {
                                            return "Booking status is required"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={statuses}
                                        className="mb-3"
                                        value={statuses.filter((status) => status.value == field.value)}
                                        label='Booking status'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {errors.status && <Error error={errors.v.message} className='mb-3 py-1 text-base' />}
                            {status == 'confirmed' &&
                                <>
                                    <Input type='date' name='checkedIn' optional={true} register={register} label='Checked In date' className='mb-3' />
                                    {checkedIn &&
                                        <>
                                            <Input type='date' name='checkedOut' optional={true} register={register} label='Checked Out date' validationOptions={{ validate: (value) => value ? new Date(value) >= new Date(checkedIn) ? true : 'Checked Out date should be greater or equal to start date' : true }} className='mb-3' />
                                            {errors.checkedOut && <Error error={errors.checkedOut.message} className='mb-3 py-1 text-base' />}
                                        </>
                                    }
                                </>
                            }
                            <TitleDevider title='Main guest info' className='mb-3' />
                            <Input type='text' name='name' register={register} validationOptions={{ required: 'Full name is required' }} label='Full name' placeholder='Ex: John Doe' className='mb-3' />
                            {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                            <Input type='text' name='email' register={register} label='Email' validationOptions={{ required: 'Email is required' }} placeholder='Ex: john@example.com' className='mb-3' />
                            {errors.email && <Error error={errors.email.message} className='mb-3 py-1 text-base' />}
                            <Input type='number' name='phone' register={register} label={`Phone number`} validationOptions={{ required: 'Phone number is required' }} placeholder='Ex: 0123456789' className='mb-3' />
                            {errors.phone && <Error error={errors.phone.message} className='mb-3 py-1 text-base' />}
                            <TitleDevider title='Booking update notes' className='mb-3' />
                            <Textarea name='updateNote' rows={8} register={register} label='Booking update notes' optional={true} placeholder='Ex: Changed booking source on 23 Feb....' className='mb-3' />
                            {villaBooking.invoicePricing.addons.appliedAddons.length > 0 &&
                                <>
                                    <TitleDevider title='Already added addons' className='mb-3' />
                                    <RemoveAddons addedAddons={villaBooking.invoicePricing.addons.appliedAddons} setAddons={setRemoveAddons} />
                                </>
                            }
                            {villaAddons.length > 0 &&
                                <>
                                    <TitleDevider title='Add new addons' className='mb-3' />
                                    <Addons villaAddons={villaAddons} setAddons={setNewAddons} />
                                </>
                            }
                            <Button loading={submitLoading} label='Edit booking' />
                        </form>
                    }
                </>
            }
        </Drawer >
    )
}

export default EditVillaBooking