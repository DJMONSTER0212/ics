import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Textarea from '@/components/panel/design/Textarea'
import { components } from 'react-select'
import Image from 'next/image'

const AddPayment = ({ addPaymentDrawer, setAddPaymentDrawer, addMessage, setAddMessage, settings, reFetch }) => {
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for payment type
    let types = [
        { value: 'normal', label: 'Normal' },
        { value: 'refund', label: 'Refund' },
    ]
    // Values for payment src
    let sources = [
        { value: 'razorpay', label: 'Razorpay' },
        { value: 'offline', label: 'Offline' },
        { value: 'upi', label: 'UPI' },
        { value: 'other', label: 'Other' },
    ]
    // Values for paid for
    let paidFors = [
        { value: 'villa', label: 'Villa' },
        { value: 'hotel', label: 'Hotel' },
    ]
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
    // Values for user 
    const loadUsers = async (inputValue) => {
        const response = await fetch(`/api/panel/users/admin/search?users=true&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options;
    };
    // Values for villas 
    const loadVillas = async (inputValue) => {
        const response = await fetch(`/api/panel/villas/admin/search?searchOption=name&search=${inputValue}`);
        const responseData = await response.json();
        const options = responseData.data.map((villa) => ({
            value: villa._id,
            label: villa.name,
        }));
        return options;
    };
    // For add payment >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm()
    const src = useWatch({ control, name: 'src' });
    const paidFor = useWatch({ control, name: 'paidFor' });
    const status = useWatch({ control, name: 'status' });
    const [selectedUser, setSelectedUser] = useState()
    const [selectedVilla, setSelectedVilla] = useState()

    // Add payment handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/payments/admin/`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setAddMessage({ message: responseData.error, type: 'error' })
        } else {
            setAddMessage({ message: responseData.success, type: 'success' })
            reset() // To reset form
            // To re fetch data on table
            reFetch()
        }
        setSubmitLoading(false)
    }

    return (
        <Drawer title={'Add Payment'} drawer={addPaymentDrawer} setDrawer={setAddPaymentDrawer}>
            <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                {addMessage.type == 'error' && <Error error={addMessage.message} />}
                {addMessage.type == 'success' && <Success success={addMessage.message} />}
                <Controller
                    name='type'
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                                return "Payment type is required"
                            }
                            return true
                        }
                    }}
                    render={({ field }) => {
                        return <SelectInput
                            options={types}
                            className="mb-3"
                            value={types.filter((type) => type.value == field.value)}
                            label='Payment type'
                            isSearchable={false}
                            onChange={(e) => field.onChange(e.value)}
                            required={true}
                        />
                    }}
                />
                {errors.type && <Error error={errors.type.message} className='mb-3 py-1 text-base' />}
                <Controller
                    name='src'
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                                return "Payment source is required"
                            }
                            return true
                        }
                    }}
                    render={({ field }) => {
                        return <SelectInput
                            options={sources}
                            className="mb-3"
                            value={sources.filter((source) => source.value == field.value)}
                            label='Payment source'
                            isSearchable={false}
                            onChange={(e) => field.onChange(e.value)}
                            required={true}
                        />
                    }}
                />
                {errors.src && <Error error={errors.src.message} className='mb-3 py-1 text-base' />}
                {src == 'other' &&
                    <>
                        <Input type='text' name='srcDesc' register={register} label='Enter payment source' validationOptions={{ required: 'A payment source is required' }} placeholder='Ex: Paytm' className='mb-3' />
                        {errors.srcDesc && <Error error={errors.srcDesc.message} className='mb-3 py-1 text-base' />}
                    </>
                }
                <Controller
                    name='userId'
                    control={control}
                    rules={{ validate: (value) => !value ? 'User is required.' : null }}
                    render={({ field }) => {
                        return <SelectInput
                            AsyncSelectOn={true}
                            className="mb-3"
                            cacheOptions
                            // defaultValue={{ value: field.value, label: field.value }}
                            defaultOptions
                            value={selectedUser}
                            onChange={(e) => { field.onChange(e.value); setSelectedUser({ value: e.value, label: e.label, email: e.email }) }}
                            loadOptions={loadUsers}
                            label="Select a user"
                            placeholder='Search here...'
                            noOptionsMessage={() => 'Type to see users..'}
                            isSearchable={true}
                            components={{
                                Option: ({ data, ...props }) => {
                                    return (
                                        <components.Option {...props}>
                                            <div className="flex items-center gap-x-3">
                                                <Image className="rounded-md" src={data.image} width='45' height='45' alt="x" />
                                                <div>
                                                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                                                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{data.email}</p>
                                                </div>
                                            </div>
                                        </components.Option>
                                    );
                                }
                            }}
                        />
                    }}
                />
                {errors.userId && <Error error={errors.userId.message} className='mb-3 py-1 text-base' />}
                <Controller
                    name='paidFor'
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                                return "Paid for is required"
                            }
                            return true
                        }
                    }}
                    render={({ field }) => {
                        return <SelectInput
                            options={paidFors}
                            className="mb-3"
                            value={paidFors.filter((paidFor) => paidFor.value == field.value)}
                            label='Paid for'
                            isSearchable={false}
                            onChange={(e) => field.onChange(e.value)}
                            required={true}
                        />
                    }}
                />
                {errors.paidFor && <Error error={errors.paidFor.message} className='mb-3 py-1 text-base' />}
                {paidFor == 'villa' &&
                    <>
                        <Controller
                            name='villaId'
                            control={control}
                            rules={{ validate: (value) => !value ? 'Villa is required.' : null }}
                            render={({ field }) => {
                                return <SelectInput
                                    AsyncSelectOn={true}
                                    className="mb-3"
                                    cacheOptions
                                    // defaultValue={{ value: field.value, label: field.value }}
                                    defaultOptions
                                    value={selectedVilla}
                                    onChange={(e) => { field.onChange(e.value); setSelectedVilla({ value: e.value, label: e.label }) }}
                                    loadOptions={loadVillas}
                                    label="Select villa"
                                    placeholder='Search here...'
                                    noOptionsMessage={() => 'Type to see villas..'}
                                    isSearchable={true}
                                />
                            }}
                        />
                        {errors.villaId && <Error error={errors.villaId.message} className='mb-3 py-1 text-base' />}
                        <Input type='text' name='villaBookingId' register={register} validationOptions={{ required: 'Villa booking ID is required' }} label='Booking ID' placeholder='Ex: 64ec8ff1218223c12811af69' className='mb-3' />
                        {errors.villaBookingId && <Error error={errors.villaBookingId.message} className='mb-3 py-1 text-base' />}
                    </>
                }
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
                {src == 'razorpay' &&
                    <>
                        <Input type='text' name='orderId' register={register} label='Enter order Id' optional={true} placeholder='Ex: order_M9ZuoegoLFSwDd' className='mb-3' />
                        <Input type='text' name='paymentId' register={register} label='Enter payment Id' validationOptions={{ required: 'Payment Id is required' }} placeholder='Ex: pay_M9Zv8UZwdyZahf' className='mb-3' />
                        {errors.paymentId && <Error error={errors.paymentId.message} className='mb-3 py-1 text-base' />}
                    </>
                }
                {src == 'upi' &&
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
                <Button loading={submitLoading} label='Add payment' />
            </form>
        </Drawer>
    )
}

export default AddPayment