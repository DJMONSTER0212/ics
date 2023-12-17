import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'
import TitleDevider from '../../design/TitleDevider'

const EditLocation = ({ editLocationDrawer, setEditLocationDrawer, editMessage, setEditMessage, reFetch, editLocationId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit location >>>>>>>>>>>>>>>>
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
        const response = await fetch(`/api/panel/locations/admin/${data._id}`, {
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

    // Fetch edit location info >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setEditLocationDrawer(true)
        const response = await fetch(`/api/panel/locations/admin/${id}`);
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            // Set value to form
            if (responseData.data.seoInfo) {
                Object.entries(responseData.data.seoInfo).forEach(([name, value]) => setValue(name, value));
                delete responseData.data.seoInfo;
            }
            Object.entries(responseData.data).forEach(([name, value]) => setValue(name, value));
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditLocationDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
    }, [clearErrors, reset, setEditLocationDrawer, setEditMessage, setValue, setGlobalMessage])

    // To fetch location
    useEffect(() => {
        if (editLocationId) {
            editFetch(editLocationId)
        }
    }, [editLocationId, editFetch])

    return (
        <Drawer title={'Edit Location'} drawer={editLocationDrawer} setDrawer={setEditLocationDrawer}>
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
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Location name is required' }} label='Location name' placeholder='Ex: Jaipur' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <TitleDevider title='SEO details' className='mb-3' />
                    <Input type='text' name='title' maxLength='55' register={register} label='Title' placeholder='Ex: Best villas in jaipur..' className='mb-3' />
                    <Input type='text' name='metaDesc' maxLength='150' register={register} label='Meta description' placeholder='Ex: Your one stop destination.' className='mb-3' />
                    <Button loading={submitLoading} type='submit' label='Update location' />
                </form>
            }
        </Drawer>
    )
}

export default EditLocation