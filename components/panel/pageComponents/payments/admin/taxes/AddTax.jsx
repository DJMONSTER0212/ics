import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Toggle from '@/components/panel/design/Toggle'

const AddTax = ({ addTaxDrawer, setAddTaxDrawer, addMessage, setAddMessage, reFetch }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For add tax >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm()
    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/payments/admin/taxes`, {
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
        <Drawer title={'Add Tax'} drawer={addTaxDrawer} setDrawer={setAddTaxDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {addMessage.type == 'error' && <Error error={addMessage.message} />}
                    {addMessage.type == 'success' && <Success success={addMessage.message} />}
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Tax name is required' }} label='Tax name' placeholder='Ex: GST' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <Input type='number' step=".01" name='price' register={register} validationOptions={{ required: 'Tax price is required', validate: (value) => (Number(value) >= 0 && Number(value) < 36) ? true : 'Tax price should be less than 35' }} label='Tax price [In %]' placeholder='Ex: 4' className='mb-3' />
                    {errors.price && <Error error={errors.price.message} className='mb-3 py-1 text-base' />}
                    <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after Tax price.</span></p>
                    <Toggle
                        control={control}
                        name='applyOnVillas'
                        label='Apply tax on villas'
                        defaultValue={false}
                        className='mb-3'
                    />
                    <Toggle
                        control={control}
                        name='applyOnHotels'
                        label='Apply tax on hotels'
                        defaultValue={false}
                        className='mb-3'
                    />
                    <Button loading={submitLoading} type='submit' label='Add tax' />
                </form>
            }
        </Drawer>
    )
}

export default AddTax