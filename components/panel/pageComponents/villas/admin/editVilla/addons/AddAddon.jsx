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

const AddAddon = ({ addMessage, setAddMessage, addAddonDrawer, setAddAddonDrawer, fetchAddons, settings, villa }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For add Addon >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, getValues, clearErrors, formState: { errors } } = useForm()

    // Add Form handler
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/addons`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setAddMessage({ message: responseData.error, type: 'error' })
        } else {
            setAddMessage({ message: responseData.success, type: 'success' })
            await fetchAddons(villa._id) // To refetch updated data
            reset() // To reset form
        }
        setSubmitLoading(false)
    }
    return (
        <Drawer title={'Add Addon'} drawer={addAddonDrawer} setDrawer={setAddAddonDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {addMessage.type == 'error' && <Error error={addMessage.message} />}
                        {addMessage.type == 'success' && <Success success={addMessage.message} />}
                        {/* // Addon details >>>>>>>>>>>>> */}
                        <TitleDevider title='Addon details' className='mb-3' />
                        <Input type='text' name='name' register={register} validationOptions={{ required: 'Addon name is required' }} label='Addon name' placeholder='Ex: All meals' className='mb-3' />
                        {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                        <Textarea rows={5} maxLength="100" name='shortDesc' register={register} optional={true} label='Short Description' placeholder='Food package includes lunch and dinner' className='mb-3' />
                        <Input type='number' name='price' register={register} validationOptions={{ required: 'Price is required' }} label='Price' placeholder='Ex: 999' className='mb-3' />
                        {errors.price && <Error error={errors.price.message} className='mb-3 py-1 text-base' />}
                        <Button loading={submitLoading} type='submit' label='Add addon' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default AddAddon