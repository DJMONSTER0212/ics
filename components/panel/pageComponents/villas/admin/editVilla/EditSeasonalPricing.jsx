import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Loader from '@/components/panel/design/Loader';
import Drawer from '@/components/panel/design/Drawer';
import { useForm, useWatch, Controller } from 'react-hook-form'
import Input from '@/components/panel/design/Input';
import SelectInput from '@/components/website/design/Select';
import TitleDevider from '@/components/panel/design/TitleDevider';

const EditSeasonalPricing = ({ editMessage, setEditMessage, editSeasonalPricingDrawer, setEditSeasonalPricingDrawer, fetchSeasonalPricings, settings, villa, setGlobalMessage, editSeasonalPricingId }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for select fields [Pricing type]
    const rangeTypes = [
        { value: 'date', label: 'Date range' },
        { value: 'day', label: 'Day' }
    ]
    // Values for select fields [day]
    let days = [
        { value: 'sunday', label: 'Sunday' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thrusday', label: 'Thrusday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
    ]
    // For Edit seasonal pricing >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, getValues, clearErrors, formState: { errors } } = useForm()
    const rangeType = useWatch({ control, name: 'rangeType' });
    const startDate = useWatch({ control, name: 'startDate' });
    const basePrice = useWatch({ control, name: 'basePrice' });

    // Edit Form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/seasonal-pricings/${editSeasonalPricingId}`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setEditMessage({ message: responseData.error, type: 'error' })
        } else {
            setEditMessage({ message: responseData.success, type: 'success' })
            await fetchSeasonalPricings(villa._id) // To refetch updated data
        }
        setSubmitLoading(false)
    }

    // To fetch seasonal pricing >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/seasonal-pricings/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            // Set value to form
            if (responseData.data.rangeType == 'date') {
                responseData.data.startDate = responseData.data.date.startDate.split('T')[0]
                responseData.data.endDate = responseData.data.date.endDate.split('T')[0]
            }
            delete responseData.data.date
            Object.entries(responseData.data).forEach(([name, value]) => setValue(name, value)); // Set value to form
            // Set user role
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditSeasonalPricingDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditSeasonalPricingDrawer, setEditMessage, setValue, setGlobalMessage, villa._id])
    // To fetch seasonal pricing
    useEffect(() => {
        if (editSeasonalPricingId) {
            editFetch(editSeasonalPricingId)
        }
    }, [editSeasonalPricingId, editFetch])


    return (
        <Drawer title={'Edit Seasonal Pricing'} drawer={editSeasonalPricingDrawer} setDrawer={setEditSeasonalPricingDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {editMessage.type == 'error' && <Error error={editMessage.message} />}
                        {editMessage.type == 'success' && <Success success={editMessage.message} />}
                        {/* // Seasonal Pricing details >>>>>>>>>>>>> */}
                        <TitleDevider title='Seasonal pricing details' className='mb-3' />
                        <Input type='text' name='name' register={register} validationOptions={{ required: 'Seasonal pricing name is required' }} label='Seasonal pricing name' placeholder='Ex: Royal hills' className='mb-3' />
                        {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                        <Controller
                            name='rangeType'
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value == null) {
                                        return "Pricing type is required"
                                    }
                                    return true
                                }
                            }}
                            render={({ field }) => {
                                return <SelectInput
                                    options={rangeTypes}
                                    className="mb-3"
                                    value={rangeTypes.filter((el) => el.value == field.value)}
                                    label='Pricing type'
                                    isSearchable={false}
                                    onChange={(e) => field.onChange(e.value)}
                                    required={true}
                                />
                            }}
                        />
                        {errors.type && <Error error={errors.type.message} className='mb-3 py-1 text-base' />}
                        {rangeType == 'day' &&
                            <>
                                <Controller
                                    name='day'
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (value == null) {
                                                return "Day is required"
                                            }
                                            return true
                                        }
                                    }}
                                    render={({ field }) => {
                                        return <SelectInput
                                            options={days}
                                            className="mb-3"
                                            value={days.filter((el) => el.value == field.value)}
                                            label='Select day'
                                            isSearchable={false}
                                            onChange={(e) => field.onChange(e.value)}
                                            required={true}
                                        />
                                    }}
                                />
                                {errors.day && <Error error={errors.day.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                        {rangeType == 'date' &&
                            <>
                                <Input type='date' name='startDate' register={register} label='Start date' validationOptions={{ required: 'Start date is required' }} placeholder='Ex: 2999' className='mb-3' />
                                {errors.startDate && <Error error={errors.startDate.message} className='mb-3 py-1 text-base' />}
                                <Input type='date' name='endDate' register={register} label='End date' validationOptions={{ required: 'End date is required', validate: (value) => new Date(value) >= new Date(startDate) ? true : 'End date should be greater or equal to start date' }} placeholder='Ex: 2999' className='mb-3' />
                                {errors.endDate && <Error error={errors.endDate.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                        {/* // Price details */}
                        <TitleDevider className='mb-3' title='Price details' />
                        <Input type='number' name='basePrice' register={register} label='Base price' validationOptions={{ required: 'Base price is required', validate: (value) => Number(value) <= 0 ? 'Base price should be grater than 0' : true }} placeholder='Ex: 2999' className='mb-3' />
                        {errors.basePrice && <Error error={errors.basePrice.message} className='mb-3 py-1 text-base' />}
                        <Input type='number' name='discountedPrice' optional={true} register={register} label='Discounted price' validationOptions={{ validate: (value) => value && Number(value) <= 0 ? 'Discounted price should be grater than 0' : Number(value) >= Number(basePrice) ? 'Discounted price should not be higher or equal to base price' : true }} placeholder='Ex: 1999' className='mb-3' />
                        {errors.discountedPrice && <Error error={errors.discountedPrice.message} className='mb-3 py-1 text-base' />}
                        {/* // Price details [Can be updated automatically] */}
                        {((Number(villa.maxGuest) > Number(villa.minGuest)) || villa.childAllowed || villa.petAllowed) &&
                            <>
                                <TitleDevider className='mb-1' title='Optional price details' />
                                <p className='mb-3 text-black-500 dark:text-white'>Note: <span className='text-black-300 dark:text-black-200'>If empty then general prices will be applied</span></p>
                                {Number(villa.maxGuest) > Number(villa.minGuest) && <Input type='number' name='extraGuestPrice' optional={true} register={register} validationOptions={{ validate: (value) => value && Number(value) <= 0 ? 'Extra guest price should be grater than 0' : true }} label='Extra guest price' placeholder='Ex: 0 or 599' className='mb-3' />}
                                {errors.extraGuestPrice && <Error error={errors.extraGuestPrice.message} className='mb-3 py-1 text-base' />}
                                <Input type='number' name='childPrice' optional={true} register={register} validationOptions={{ validate: (value) => value && Number(value) <= 0 ? 'Child price should be grater than 0' : true }} label='Child price' placeholder='Ex: 0 or 299' className='mb-3' />
                                {errors.childPrice && <Error error={errors.childPrice.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                        <Button loading={submitLoading} type='submit' label='Update seasonal pricing' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default EditSeasonalPricing