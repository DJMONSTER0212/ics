import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Loader from '@/components/panel/design/Loader';
import Drawer from '@/components/panel/design/Drawer';
import { useForm } from 'react-hook-form'
import Input from '@/components/panel/design/Input';
import TitleDevider from '@/components/panel/design/TitleDevider';

const AddCancellationRule = ({ addMessage, setAddMessage, addCancellationRuleDrawer, setAddCancellationRuleDrawer, reFetchCancellationRules, settings }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For add CancellationRule >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, getValues, clearErrors, formState: { errors } } = useForm()
    // Add Form handler
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/cancellation/rules`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setAddMessage({ message: responseData.error, type: 'error' })
        } else {
            setAddMessage({ message: responseData.success, type: 'success' })
            await reFetchCancellationRules() // To refetch updated data
            // reset() // To reset form
        }
        setSubmitLoading(false)
    }

    return (
        <Drawer title={'Add Cancellation Rule'} drawer={addCancellationRuleDrawer} setDrawer={setAddCancellationRuleDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {addMessage.type == 'error' && <Error error={addMessage.message} />}
                        {addMessage.type == 'success' && <Success success={addMessage.message} />}
                        {/* // Cancellation rule details >>>>>>>>>>>>> */}
                        <TitleDevider title='Cancellation rule details' className='mb-3' />
                        <Input type='number' name='daysBeforeCheckIn' register={register} validationOptions={{ required: 'Days before check-in is required', validate: (value) => Number(value) >= 0 && Number(value) <= 100 ? true : 'Days should be between 0 to 100' }} label='Days before check-in' placeholder='Ex: 2' className='mb-3' />
                        {errors.daysBeforeCheckIn && <Error error={errors.daysBeforeCheckIn.message} className='mb-3 py-1 text-base' />}
                        <Input type='number' name='refundablePrice' register={register} validationOptions={{ required: 'Refundable price is required.', validate: (value) => Number(value) >= 0 && Number(value) <= 100 ? true : 'Price should be between 0 to 100' }} label='Refundable price [In %]' placeholder='Ex: 50' className='mb-3' />
                        {errors.refundablePrice && <Error error={errors.refundablePrice.message} className='mb-3 py-1 text-base' />}
                        <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after refundable price. <br /> Set days before check-in 0 for same day cancellation and refundable price 0 for no refund.</span></p>
                        <Button loading={submitLoading} type='submit' label='Add cancellation rule' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default AddCancellationRule