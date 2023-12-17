import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'

const EditAmenity = ({ editAmenityDrawer, setEditAmenityDrawer, editMessage, setEditMessage, reFetch, editAmenityId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit amenity >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm()
    const image = useWatch({ control, name: 'image' });

    // Edit form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        data.image = data.image[0]
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/amenities/admin/${data._id}`, {
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

    // Fetch edit amenity info >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setEditAmenityDrawer(true)
        const response = await fetch(`/api/panel/amenities/admin/${id}`);
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
            setEditAmenityDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
    }, [clearErrors, reset, setEditAmenityDrawer, setEditMessage, setValue, setGlobalMessage])

    // To fetch amenity
    useEffect(() => {
        if (editAmenityId) {
            editFetch(editAmenityId)
        }
    }, [editAmenityId, editFetch])

    return (
        <Drawer title={'Edit Amenity'} drawer={editAmenityDrawer} setDrawer={setEditAmenityDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {editMessage.type == 'error' && <Error error={editMessage.message} />}
                    {editMessage.type == 'success' && <Success success={editMessage.message} />}
                    <ImageUpload
                        images={image}
                        register={register}
                        name='image'
                        label='Image'
                        className='mb-3'
                        optional={true}
                    />
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Amenity name is required' }} label='Amenity name' placeholder='Ex: WiFi' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <Button loading={submitLoading} type='submit' label='Update amenity' />
                </form>
            }
        </Drawer>
    )
}

export default EditAmenity