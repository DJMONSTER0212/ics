import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'

const AddBanner = ({ addBannerDrawer, setAddBannerDrawer, addMessage, setAddMessage, reFetch }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For add banner >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm()
    const image = useWatch({ control, name: 'image' });
    const ctaUrl = useWatch({ control: control, name: 'ctaUrl' })

    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        data.image = data.image[0]
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/promotions/admin/homepage-banners`, {
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
        <Drawer title={'Add Banner'} drawer={addBannerDrawer} setDrawer={setAddBannerDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {addMessage.type == 'error' && <Error error={addMessage.message} />}
                    {addMessage.type == 'success' && <Success success={addMessage.message} />}
                    <ImageUpload
                        images={image}
                        register={register}
                        name='image'
                        label='Banner image'
                        className='mb-3'
                        errors={errors}
                        imageSize='1280px x 500px'
                        imageGridClassNames='w-[100px] h-[55px]'
                        validationOptions={{ required: 'Banner image is required' }}
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
                    <Button loading={submitLoading} type='submit' label='Add banner' />
                </form>
            }
        </Drawer>
    )
}

export default AddBanner