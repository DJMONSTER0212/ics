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
import Link from 'next/link'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const EditPayment = ({ editPaymentDrawer, setEditPaymentDrawer, editMessage, setEditMessage, settings, reFetch, session, editPaymentId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For drawer view type
    const [viewType, setViewType] = useState('details')
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for status
    let statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'successful', label: 'Successful' },
        { value: 'failed', label: 'Failed' },
    ]
    // Values for payment range
    let ranges = [
        { value: 'full', label: 'Full payment' },
        { value: 'pre', label: 'Pre payment' },
        { value: 'post', label: 'Post payment' },
    ]
    // For edit payment >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm()
    const status = useWatch({ control, name: 'status' });
    // Edit payment handler
    const [refetchPayment, setRefetchPayment] = useState(true)
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/payments/admin/${editPaymentId}`, {
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
            setRefetchPayment(!refetchPayment)
        }
        setSubmitLoading(false)
    }
    // Fetch payment >>>>>>>>>>>>>>>>>
    const [payment, setPayment] = useState({})
    const fetchPayment = useCallback(async (id) => {
        setDrawerLoading(true)
        const fetchPayment = await fetch(`/api/panel/payments/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const payment = await fetchPayment.json();
        if (payment.data) {
            // Reset form >>>>>>>>>>>>>>>>>
            reset()
            // Set value to form >>>>>>>>>>>>>>>>>
            const paymentData = {};
            switch (payment.data.src) {
                case 'razorpay':
                    paymentData.orderId = payment.data.razorpay.orderId;
                    paymentData.paymentId = payment.data.razorpay.paymentId;
                    break;
                case 'upi':
                    paymentData.refNo = payment.data.refNo
                    break;
                default:
                    break;
            }
            paymentData.range = payment.data.range;
            paymentData.price = payment.data.price;
            paymentData.status = payment.data.status;
            if (payment.data.paymentDate) {
                paymentData.paymentDate = payment.data.paymentDate.slice(0, 10);
            }
            paymentData.paymentNote = payment.data.paymentNote;
            Object.entries(paymentData).forEach(([name, value]) => setValue(name, value));
            // Set value to states >>>>>>>>>>>>>>>>>
            setPayment(payment.data)
            setGlobalMessage({ message: '', type: '' })  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: payment.error, type: 'error' })
            setEditPaymentDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditPaymentDrawer, setValue, setGlobalMessage])
    // To fetch payment
    useEffect(() => {
        if (editPaymentId) {
            fetchPayment(editPaymentId)
        }
    }, [editPaymentId, fetchPayment, refetchPayment])

    return (
        <Drawer title={'Edit Payment'} drawer={editPaymentDrawer} setDrawer={setEditPaymentDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> : Object.keys(payment).length > 0 &&
                <>
                    <Tabs>
                        <TabButton onClick={() => setViewType('details')} label='Details' activeTab={viewType} tabName='details' />
                        <TabButton onClick={() => setViewType('edit')} label='Edit' activeTab={viewType} tabName='edit' />
                    </Tabs>
                    {/* // Info >>>> */}
                    {viewType == 'details' &&
                        <div className="grid grid-cols-1 gap-3 mt-5">
                            {/* // Payment details */}
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs bg-gray-300 dark:bg-black-400/40 px-1.5 py-0.5 w-fit rounded-sm text-black-500 dark:text-white">{payment.src != 'other' ? payment.src.charAt(0).toUpperCase() + payment.src.slice(1) : payment.srcDesc} {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} payment</p>
                                    {payment.status == 'confirmed' && <p className='text-sm font-medium text-green-700'>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>}
                                    {payment.status == 'pending' && <p className='text-sm font-medium text-orange-600'>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>}
                                    {payment.status == 'cancelled' && <p className='text-sm font-medium text-red-600'>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>}
                                    {(payment.status == 'confirmed' && payment.src == 'razorpay' || payment.src == 'upi') && <div className="flex flex-col">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{payment.src == 'razorpay' ? 'Payment ID' : payment.src == 'upi' && 'Ref. No.'}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{payment.src == 'razorpay' ? payment.razorpay.paymentId : payment.src == 'upi' && payment.upi.refNo}</p>
                                    </div>}
                                </div>
                            </div>
                            {/* // Payment for user details */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>User details</p>
                                <Link href={`/panel/admin/users?searchOption=email&search=${payment.user.email}`}>
                                    <div className="flex items-center gap-x-3 rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 p-2">
                                        <Image className="object-cover w-12 h-12 rounded-sm" src={payment.user.image} width='35' height='35' alt="x" />
                                        <div>
                                            <h2 className="text-base font-medium text-black-500 dark:text-white flex gap-2 items-center">{payment.user.name}</h2>
                                            <p className="text-sm font-normal text-black-400 dark:text-black-200">{payment.user.email}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {/* // Villa details */}
                            {payment.paidFor == 'villa' &&
                                <div className="grid grid-cols-1 gap-3">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Villa</p>
                                    <Link href={`/panel/admin/villas/${payment.villa._id}/general`} passHref className="flex gap-x-3 rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 p-2">
                                        <Image className="rounded-sm" src={payment.villa.images[0]} width='70' height='45' alt="x" />
                                        <div>
                                            <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{payment.villa.name}</h2>
                                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">{payment.villa.location.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            }
                            {/* // Booking Id */}
                            <div className="grid grid-cols-1 gap-1">
                                <p className='text-base font-medium text-black-500 dark:text-white'>{payment.paidFor == 'villa' ? 'Villa Booking Id' : 'Hotel Booking Id'}</p>
                                <p className='text-base text-black-400 dark:text-black-200'>{payment.paidFor == 'villa' ? payment.villaBookingId : payment.hotelBookingId}</p>
                            </div>
                            {/* // Price detail  */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Price</p>
                                <div className="rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 px-3 py-2 grid grid-cols-1 gap-1">
                                    <div className="grid grid-cols-1 gap-1">
                                        <p className="w-fit text-xs bg-gray-300 dark:bg-black-400/40 px-1 py-0.5 rounded-sm text-black-500 dark:text-white">{payment.range.charAt(0).toUpperCase() + payment.range.slice(1)} payment</p>
                                        <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {payment.price}</p>
                                    </div>
                                </div>
                            </div>
                            {/* // Payment date  */}
                            <div className="grid grid-cols-1 gap-3">
                                <p className='text-base font-medium text-black-500 dark:text-white'>Payment date</p>
                                <div className="rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 px-3 py-2 grid grid-cols-1 gap-1">
                                    <div className="grid grid-cols-1 gap-1">
                                        <p className="text-base text-black-500 dark:text-white">Payment created at</p>
                                        <p className='text-base text-black-300 dark:text-black-200'>{payment.createdAt}</p>
                                    </div>
                                    {payment.paymentDate &&
                                        <div className="grid grid-cols-1 gap-1">
                                            <p className="text-base text-black-500 dark:text-white">Payment completed at</p>
                                            <p className='text-base text-black-300 dark:text-black-200'>{payment.paymentDate}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            {/* // Price note  */}
                            {payment.paymentNote &&
                                <div className="grid grid-cols-1 gap-3">
                                    <p className='text-base font-medium text-black-500 dark:text-white'>Payment note</p>
                                    <div className="rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 px-3 py-2 grid grid-cols-1 gap-1">
                                        <p className="text-xs bg-gray-300 dark:bg-black-400/40 px-1 py-0.5 rounded-sm text-black-500 dark:text-white">{payment.paymentNote}</p>
                                    </div>
                                </div>
                            }
                        </div >
                    }
                    {/* // Booking updates >>>> */}
                    {viewType == 'edit' &&
                        <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                            {editMessage.type == 'error' && <Error error={editMessage.message} />}
                            {editMessage.type == 'success' && <Success success={editMessage.message} />}
                            <Controller
                                name='range'
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value == null) {
                                            return "Payment range is required"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={ranges}
                                        className="mb-3"
                                        value={ranges.filter((range) => range.value == field.value)}
                                        label='Payment range'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {errors.range && <Error error={errors.range.message} className='mb-3 py-1 text-base' />}
                            <Input type='number' name='price' register={register} label={`Price`} validationOptions={{ required: 'Price is required', validate: (value) => value > 0 ? true : 'Price should be grater than 0' }} placeholder='Ex: 1699' className='mb-3' />
                            {errors.price && <Error error={errors.price.message} className='mb-3 py-1 text-base' />}
                            {payment.src == 'razorpay' &&
                                <>
                                    <Input type='text' name='orderId' register={register} label='Enter order Id' optional={true} placeholder='Ex: order_M9ZuoegoLFSwDd' className='mb-3' />
                                    {status == 'successful' &&
                                        <>
                                            <Input type='text' name='paymentId' register={register} label='Enter payment Id' validationOptions={{ required: 'Payment Id is required' }} placeholder='Ex: pay_M9Zv8UZwdyZahf' className='mb-3' />
                                            {errors.paymentId && <Error error={errors.paymentId.message} className='mb-3 py-1 text-base' />}
                                        </>
                                    }
                                </>
                            }
                            {payment.src == 'upi' &&
                                <>
                                    <Input type='text' name='refNo' register={register} label='Enter Ref. No' validationOptions={{ required: 'Ref. No is required' }} placeholder='Ex: 49761649664979' className='mb-3' />
                                    {errors.refNo && <Error error={errors.refNo.message} className='mb-3 py-1 text-base' />}
                                </>
                            }
                            <Controller
                                name='status'
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value == null) {
                                            return "Payment status is required"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={statuses}
                                        className="mb-3"
                                        value={statuses.filter((status) => status.value == field.value)}
                                        label='Payment status'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {errors.status && <Error error={errors.status.message} className='mb-3 py-1 text-base' />}
                            {status == 'successful' &&
                                <>
                                    <Input type='date' name='paymentDate' register={register} label='Select payment date' validationOptions={{ required: 'Payment date is required' }} className='mb-3' />
                                    {errors.paymentDate && <Error error={errors.paymentDate.message} className='mb-3 py-1 text-base' />}
                                </>
                            }
                            <Textarea rows={5} name='paymentNote' register={register} label='Payment note' optional={true} placeholder='Write here...' className='mb-3' />
                            <Button loading={submitLoading} label='Update payment' />
                        </form>
                    }
                </>
            }
        </Drawer >
    )
}

export default EditPayment