import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'

const AddAmenity = ({ addAmenityDrawer, setAddAmenityDrawer, addMessage, setAddMessage, reFetch }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For add amenity >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm()
    const image = useWatch({ control, name: 'image' });
    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        data.image = data.image[0]
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/amenities/admin`, {
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
        <Drawer title={'Add Amenity'} drawer={addAmenityDrawer} setDrawer={setAddAmenityDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {addMessage.type == 'error' && <Error error={addMessage.message} />}
                    {addMessage.type == 'success' && <Success success={addMessage.message} />}
                    <ImageUpload
                        images={image}
                        register={register}
                        name='image'
                        label='Image'
                        className='mb-3'
                        errors={errors}
                        validationOptions={{ required: 'Image is required.' }}
                    />
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Amenity name is required' }} label='Amenity name' placeholder='Ex: WiFi' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <Button loading={submitLoading} type='submit' label='Add amenity' />
                </form>
            }
        </Drawer>
    )
}

export default AddAmenity