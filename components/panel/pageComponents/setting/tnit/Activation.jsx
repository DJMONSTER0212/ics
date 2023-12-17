import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Toggle from '@/components/panel/design/Toggle';
import { useForm } from 'react-hook-form'

const Activation = ({ settings }) => {
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For Activation Settings >>>>>>>>>>>>>>>>>
    const { handleSubmit, control } = useForm({ defaultValues: settings.tnit });
    const [message, setMessage] = useState('') // Global Error/Success Message
    // For activation settings submit
    const activationSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/tnit/activation`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setMessage({ message: responseData.error, type: 'error' })
        } else {
            setMessage({ message: responseData.success, type: 'success' })
            settings.tnit = data; // To update settings object with updated imformation
        }
        setSubmitLoading(false)
    }
    return (
        <form onSubmit={handleSubmit(activationSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
            {message.type == 'error' && <Error className='mb-3' error={message.message} />}
            {message.type == 'success' && <Success className='mb-3' success={message.message} />}
            <Toggle
                label="Activate website"
                name="activateWebsite"
                control={control}
                defaultValue={false}
                labelClassName='text-red-500'
            />
            <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Activating the website will make the frontend live {'[Main website]'}.</p>
            <Button loading={submitLoading} type='submit' variant='primary' label='Update activation settings' />
        </form>
    )
}

export default Activation