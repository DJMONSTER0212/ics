import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Toggle from '@/components/panel/design/Toggle'

const EditTax = ({ editTaxDrawer, setEditTaxDrawer, editMessage, setEditMessage, reFetch, editTaxId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit tax >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm()
    // Edit form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/payments/admin/taxes/${data._id}`, {
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
        }
        setSubmitLoading(false)
    }

    // Fetch edit tax info >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setEditTaxDrawer(true)
        const response = await fetch(`/api/panel/payments/admin/taxes/${id}`);
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            // Set value to form
            Object.entries(responseData.data).forEach(([name, value]) => setValue(name, value));
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditTaxDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
    }, [clearErrors, reset, setEditTaxDrawer, setEditMessage, setValue, setGlobalMessage])

    // To fetch tax >>>>>>>>>>>>>>>>>
    useEffect(() => {
        if (editTaxId) {
            editFetch(editTaxId)
        }
    }, [editTaxId, editFetch])

    return (
        <Drawer title={'Edit Tax'} drawer={editTaxDrawer} setDrawer={setEditTaxDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {editMessage.type == 'error' && <Error error={editMessage.message} />}
                    {editMessage.type == 'success' && <Success success={editMessage.message} />}
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Tax name is required' }} label='Tax name' placeholder='Ex: GST' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <Input type='number' step=".01" name='price' register={register} validationOptions={{ required: 'Tax price is required', validate: (value) => (Number(value) >= 0 && Number(value) < 36) ? true : 'Tax price should be grater than 0 and less than 35' }} label='Tax price [In %]' placeholder='Ex: 4' className='mb-3' />
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
                    <Button loading={submitLoading} type='submit' label='Update tax' />
                </form>
            }
        </Drawer>
    )
}

export default EditTax