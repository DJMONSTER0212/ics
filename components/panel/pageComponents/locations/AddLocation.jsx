import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import Error from '@/components/panel/design/Error'
import { useForm, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'
import TitleDevider from '../../design/TitleDevider'

const AddLocation = ({ addLocationDrawer, setAddLocationDrawer, addMessage, setAddMessage, reFetch }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For add location >>>>>>>>>>>>>>>>
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
        const response = await fetch(`/api/panel/locations/admin`, {
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
        <Drawer title={'Add Location'} drawer={addLocationDrawer} setDrawer={setAddLocationDrawer}>
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
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Location name is required' }} label='Location name' placeholder='Ex: Jaipur' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <TitleDevider title='SEO details' className='mb-3' />
                    <Input type='text' name='title' maxLength='55' register={register} label='Title' placeholder='Ex: Best villas in jaipur..' className='mb-3' />
                    <Input type='text' name='metaDesc' maxLength='150' register={register} label='Meta description' placeholder='Ex: Your one stop destination.' className='mb-3' />
                    <Button loading={submitLoading} type='submit' label='Add location' />
                </form>
            }
        </Drawer>
    )
}

export default AddLocation