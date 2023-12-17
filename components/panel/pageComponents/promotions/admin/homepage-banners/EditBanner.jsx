import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'

const EditBanner = ({ editBannerDrawer, setEditBannerDrawer, editMessage, setEditMessage, reFetch, editBannerId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit banner >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm()
    const image = useWatch({ control, name: 'image' });
    const ctaUrl = useWatch({ control, name: 'ctaUrl' });
    // Edit form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        data.image = data.image[0]
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/promotions/admin/homepage-banners/${data._id}`, {
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

    // Fetch edit banner info >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setEditBannerDrawer(true)
        const response = await fetch(`/api/panel/promotions/admin/homepage-banners/${id}`);
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
            setEditBannerDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
    }, [clearErrors, reset, setEditBannerDrawer, setEditMessage, setValue, setGlobalMessage])

    // To fetch banner
    useEffect(() => {
        if (editBannerId) {
            editFetch(editBannerId)
        }
    }, [editBannerId, editFetch])

    return (
        <Drawer title={'Edit Banner'} drawer={editBannerDrawer} setDrawer={setEditBannerDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {editMessage.type == 'error' && <Error error={editMessage.message} />}
                    {editMessage.type == 'success' && <Success success={editMessage.message} />}
                    <ImageUpload
                        images={image}
                        register={register}
                        errors={errors}
                        name='image'
                        label='Banner image'
                        imageSize='1280px x 500px'
                        imageGridClassNames='w-[100px] h-[55px]'
                    />
                    <Input type='text' name='title' register={register} validationOptions={{ required: 'Banner title is required' }} label='Banner name' placeholder='Ex: Jaipur' className='my-3' />
                    {errors.title && <Error error={errors.title.message} className='mb-3 py-1 text-base' />}
                    <Input type='text' name='ctaUrl' register={register} label='CTA Url' placeholder='Ex: https://example.com' className='my-3' />
                    {ctaUrl &&
                        <>
                            <Input type='text' name='ctaName' register={register} validationOptions={{ required: 'CTA name is required' }} label='CTA name' placeholder='Ex: Book now' className='my-3' />
                            {errors.ctaName && <Error error={errors.ctaName.message} className='mb-3 py-1 text-base' />}
                        </>
                    }
                    <Button loading={submitLoading} type='submit' label='Update banner' />
                </form>
            }
        </Drawer>
    )
}

export default EditBanner