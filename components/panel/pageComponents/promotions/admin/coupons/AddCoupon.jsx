import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Toggle from '@/components/panel/design/Toggle'
import Textarea from '@/components/panel/design/Textarea'
import { components } from 'react-select'
import Image from 'next/image'

const AddCoupon = ({ addCouponDrawer, setAddCouponDrawer, addMessage, setAddMessage, settings, reFetch }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for coupon types
    let types = [
        { value: 'regular', label: 'Valid for everyone' },
        { value: 'userOnly', label: 'Only for a user' },
    ]
    // Values for valid on
    let validOns = [
        { value: 'all', label: 'All properties' },
        { value: 'villa', label: 'Only on a villa' },
        { value: 'hotel', label: 'Only on a hotel' },
    ]
    // Values for price types
    let priceTypes = [
        { value: 'flat', label: 'Flat' },
        { value: 'upto', label: 'Upto' },
    ]
    // Values for price types
    let priceIns = [
        { value: 'percentage', label: 'Percentage' },
        { value: 'price', label: 'Price' },
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
        const response = await fetch(`/api/panel/villas/admin/search?search=${inputValue}&searchOption=name&villaType=verified`);
        const responseData = await response.json();
        const options = responseData.data.map((villa) => ({
            value: villa._id,
            label: villa.name,
            email: villa.user.email,
            image: villa.images[0]
        }));
        console.log(responseData)
        return options;
    };
    // Values for hotels 
    const loadHotels = async (inputValue) => {
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
    // For add coupon >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm()
    const type = useWatch({ control, name: 'type' });
    const validOn = useWatch({ control, name: 'validOn' });
    const priceType = useWatch({ control, name: 'priceType' });
    const priceIn = useWatch({ control, name: 'priceIn' });
    const [selectedUser, setSelectedUser] = useState()
    const [selectedVilla, setSelectedVilla] = useState()
    const [selectedHotel, setSelectedHotel] = useState()
    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/promotions/admin/coupons`, {
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
        <Drawer title={'Add Coupon'} drawer={addCouponDrawer} setDrawer={setAddCouponDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {addMessage.type == 'error' && <Error error={addMessage.message} />}
                    {addMessage.type == 'success' && <Success success={addMessage.message} />}
                    <Input type='text' name='couponCode' maxLength={12} register={register} validationOptions={{ required: 'Coupon code is required', validate: (value) => value.length > 12 ? 'Coupon code can have max 12 characters' : true }} label='Coupon code' placeholder='Ex: WELCOME' className='mb-3' />
                    {errors.couponCode && <Error error={errors.couponCode.message} className='mb-3 py-1 text-base' />}
                    <Textarea name='shortDesc' maxLength={120} register={register} label='Short description' validationOptions={{ required: 'Short description is required' }} placeholder='Ex: john@example.com' className='mb-3' />
                    {errors.shortDesc && <Error error={errors.shortDesc.message} className='mb-3 py-1 text-base' />}
                    <Controller
                        name='type'
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value == null) {
                                    return "Coupon type is required"
                                }
                                return true
                            }
                        }}
                        render={({ field }) => {
                            return <SelectInput
                                options={types}
                                className="mb-3"
                                value={types.filter((type) => type.value == field.value)}
                                label='Coupon type'
                                isSearchable={false}
                                onChange={(e) => field.onChange(e.value)}
                                required={true}
                            />
                        }}
                    />
                    {errors.type && <Error error={errors.type.message} className='mb-3 py-1 text-base' />}
                    {type == 'userOnly' &&
                        <>
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
                        </>
                    }
                    <Controller
                        name='validOn'
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value == null) {
                                    return "'Valid on' is required"
                                }
                                return true
                            }
                        }}
                        render={({ field }) => {
                            return <SelectInput
                                options={validOns}
                                className="mb-3"
                                value={validOns.filter((validOn) => validOn.value == field.value)}
                                label='Valid on'
                                isSearchable={false}
                                onChange={(e) => field.onChange(e.value)}
                                required={true}
                            />
                        }}
                    />
                    {errors.validOn && <Error error={errors.validOn.message} className='mb-3 py-1 text-base' />}
                    {validOn == 'villa' &&
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
                            {errors.villaId && <Error error={errors.villaId.message} className='mb-3 py-1 text-base' />}
                        </>
                    }
                    {validOn == 'hotel' &&
                        <>
                            <Controller
                                name='hotelId'
                                control={control}
                                rules={{ validate: (value) => !value ? 'Hotel is required.' : null }}
                                render={({ field }) => {
                                    return <SelectInput
                                        AsyncSelectOn={true}
                                        className="mb-3"
                                        cacheOptions
                                        // defaultValue={{ value: field.value, label: field.value }}
                                        defaultOptions
                                        value={selectedHotel}
                                        onChange={(e) => { field.onChange(e.value); setSelectedHotel({ value: e.value, label: e.label, email: e.email }) }}
                                        loadOptions={loadHotels}
                                        label="Select hotel"
                                        placeholder='Search here...'
                                        noOptionsMessage={() => 'Type to see hotels..'}
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
                            {errors.hotelId && <Error error={errors.hotelId.message} className='mb-3 py-1 text-base' />}
                        </>
                    }
                    <Controller
                        name='priceType'
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value == null) {
                                    return "Price type is required"
                                }
                                return true
                            }
                        }}
                        render={({ field }) => {
                            return <SelectInput
                                options={priceTypes}
                                className="mb-3"
                                value={priceTypes.filter((priceType) => priceType.value == field.value)}
                                label='Price type'
                                isSearchable={false}
                                onChange={(e) => { field.onChange(e.value); e.value == 'upto' && setValue('priceIn', 'percentage') }}
                                required={true}
                            />
                        }}
                    />
                    {errors.priceType && <Error error={errors.priceType.message} className='mb-3 py-1 text-base' />}
                    <Controller
                        name='priceIn'
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value == null) {
                                    return "This field is required"
                                }
                                return true
                            }
                        }}
                        render={({ field }) => {
                            return <SelectInput
                                options={priceIns}
                                className="mb-3"
                                value={priceIns.filter((priceIn) => priceIn.value == field.value)}
                                label='Price is in'
                                isSearchable={false}
                                onChange={(e) => { field.onChange(e.value); e.value == 'price' && setValue('priceType', 'flat') }}
                                required={true}
                            />
                        }}
                    />
                    {errors.priceIn && <Error error={errors.priceIn.message} className='mb-3 py-1 text-base' />}
                    <Input type='number' name='price' register={register} label={`Price ${priceIn == 'percentage' ? '[In %]' : ''}`} validationOptions={{ required: 'Price is required', validate: (value) => priceIn == 'percentage' ? value > 0 && value <= 100 ? true : 'Price should be between 1 to 100' : true }} placeholder='Ex: 99' className='mb-3' />
                    {errors.price && <Error error={errors.price.message} className='mb-3 py-1 text-base' />}
                    {priceType == 'upto' &&
                        <>
                            <Input type='number' name='maxPrice' register={register} label='Max discount price' validationOptions={{ required: 'Max price is required' }} placeholder='Ex: 1999' className='mb-3' />
                            {errors.maxPrice && <Error error={errors.maxPrice.message} className='mb-3 py-1 text-base' />}
                        </>
                    }
                    <Input type='number' name='maxUses' register={register} label='Max usage [Ex: 2 Times]' validationOptions={{ required: 'Max usage is required' }} placeholder='Ex: 2' className='mb-3' />
                    {errors.maxUses && <Error error={errors.maxUses.message} className='mb-3 py-1 text-base' />}
                    <Input type='date' name='expirationDate' register={register} label='Expiration date' validationOptions={{ required: 'Expiration date is required' }} className='mb-3' />
                    {errors.expirationDate && <Error error={errors.expirationDate.message} className='mb-3 py-1 text-base' />}
                    <Toggle
                        control={control}
                        name='allowMultipleUses'
                        defaultValue={false}
                        label='Allow multiple uses'
                        className='mb-3'
                    />
                    <Toggle
                        control={control}
                        name='makePublic'
                        defaultValue={false}
                        label='Make public'
                        className='mb-3'
                    />
                    <Button loading={submitLoading} label='Add coupon' />
                </form>
            }
        </Drawer>
    )
}

export default AddCoupon