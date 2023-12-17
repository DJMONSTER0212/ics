import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Loader from '@/components/panel/design/Loader';
import Drawer from '@/components/panel/design/Drawer';
import { useForm, useWatch, Controller } from 'react-hook-form'
import Input from '@/components/panel/design/Input';
import Textarea from '@/components/panel/design/Textarea';
import TitleDevider from '@/components/panel/design/TitleDevider';

const EditAddon = ({ editMessage, setEditMessage, editAddonDrawer, setEditAddonDrawer, fetchAddons, settings, villa, setGlobalMessage, editAddonId }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For Edit addon >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, getValues, clearErrors, formState: { errors } } = useForm()

    // Edit Form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/addons/${editAddonId}`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setEditMessage({ message: responseData.error, type: 'error' })
        } else {
            setEditMessage({ message: responseData.success, type: 'success' })
            await fetchAddons(villa._id) // To refetch updated data
        }
        setSubmitLoading(false)
    }

    // To fetch addon >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/addons/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            // Set value to form
            Object.entries(responseData.data).forEach(([name, value]) => setValue(name, value)); // Set value to form
            // Set user role
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditAddonDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditAddonDrawer, setEditMessage, setValue, setGlobalMessage, villa._id])
    // To fetch addon
    useEffect(() => {
        if (editAddonId) {
            editFetch(editAddonId)
        }
    }, [editAddonId, editFetch])


    return (
        <Drawer title={'Edit Addon'} drawer={editAddonDrawer} setDrawer={setEditAddonDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {editMessage.type == 'error' && <Error error={editMessage.message} />}
                        {editMessage.type == 'success' && <Success success={editMessage.message} />}
                        {/* // Addon details >>>>>>>>>>>>> */}
                        <TitleDevider title='Addon details' className='mb-3' />
                        <Input type='text' name='name' register={register} validationOptions={{ required: 'Addon name is required' }} label='Addon name' placeholder='Ex: Royal hills' className='mb-3' />
                        {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                        <Textarea rows={5} name='shortDesc' maxLength="100" register={register} optional={true} label='Short Description' placeholder='Food package includes lunch and dinner' className='mb-3' />
                        <Input type='number' name='price' register={register} validationOptions={{ required: 'Price is required' }} label='Price' placeholder='Ex: 999' className='mb-3' />
                        {errors.price && <Error error={errors.price.message} className='mb-3 py-1 text-base' />}
                        <Button loading={submitLoading} type='submit' label='Update addon' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default EditAddon