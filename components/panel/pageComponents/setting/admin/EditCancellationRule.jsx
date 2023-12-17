import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Loader from '@/components/panel/design/Loader';
import Drawer from '@/components/panel/design/Drawer';
import { useForm } from 'react-hook-form'
import Input from '@/components/panel/design/Input';
import TitleDevider from '@/components/panel/design/TitleDevider';

const EditCancellationRule = ({ editMessage, setEditMessage, editCancellationRuleDrawer, setEditCancellationRuleDrawer, reFetchCancellationRules, settings, setGlobalMessage, editCancellationRuleId }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For edit CancellationRule >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm()
    // Edit Form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/cancellation/rules/${data._id}`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setEditMessage({ message: responseData.error, type: 'error' })
        } else {
            setEditMessage({ message: responseData.success, type: 'success' })
            await reFetchCancellationRules() // To refetch updated data
            // reset() // To reset form
        }
        setSubmitLoading(false)
    }

    // To fetch seasonal pricing >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        const response = await fetch(`/api/panel/settings/admin/cancellation/rules/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            Object.entries(responseData.data.cancellationRules).forEach(([name, value]) => setValue(name, value)); // Set value to form
            // Set user role
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditCancellationRuleDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditCancellationRuleDrawer, setEditMessage, setValue, setGlobalMessage])

    // To fetch seasonal pricing
    useEffect(() => {
        if (editCancellationRuleId) {
            editFetch(editCancellationRuleId)
        }
    }, [editCancellationRuleId, editFetch])

    return (
        <Drawer title={'Edit Cancellation Rule'} drawer={editCancellationRuleDrawer} setDrawer={setEditCancellationRuleDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {editMessage.type == 'error' && <Error error={editMessage.message} />}
                        {editMessage.type == 'success' && <Success success={editMessage.message} />}
                        {/* // Cancellation rule details >>>>>>>>>>>>> */}
                        <TitleDevider title='Cancellation rule details' className='mb-3' />
                        <Input type='number' name='daysBeforeCheckIn' register={register} validationOptions={{ required: 'Days before check-in is required', validate: (value) => Number(value) >= 0 ? true : 'Days should be equal or greater than 0' }} label='Days before check-in' placeholder='Ex: 2' className='mb-3' />
                        {errors.daysBeforeCheckIn && <Error error={errors.daysBeforeCheckIn.message} className='mb-3 py-1 text-base' />}
                        <Input type='number' name='refundablePrice' register={register} validationOptions={{ required: 'Refundable price is required.', validate: (value) => Number(value) >= 0 ? true : 'Price should be equal or greater than 0' }} label='Refundable price [In %]' placeholder='Ex: 50' className='mb-3' />
                        {errors.refundablePrice && <Error error={errors.refundablePrice.message} className='mb-3 py-1 text-base' />}
                        <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after refundable price. <br /> Set days before check-in 0 for same day cancellation and refundable price 0 for no refund.</span></p>
                        <Button loading={submitLoading} type='submit' label='Update cancellation rule' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default EditCancellationRule