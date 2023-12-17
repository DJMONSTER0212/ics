import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Toggle from '@/components/panel/design/Toggle';
import { useForm } from 'react-hook-form'
import PageTitle from '@/components/panel/design/PageTitle';
import PageLinks from '@/components/panel/pageComponents/setting/tnit/PageLinks';
import connectDB from '@/conf/database/dbConfig';
import settingsModel from '@/models/settings.model'

const Settings = ({ settings }) => {
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For Activation Settings >>>>>>>>>>>>>>>>>
    const { handleSubmit, control } = useForm({ defaultValues: settings.tnit });
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
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
        }
        setSubmitLoading(false)
    }
    return (
        <div className="px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen">
            {/* // Page title */}
            <PageTitle
                breadcrumbs={[
                    {
                        title: 'Settings',
                        url: '/panel/tnit/settings'
                    },
                    {
                        title: 'Activation settings',
                    }
                ]}
                className='py-5'
            />
            {/* // Action [Page links] */}
            <PageLinks activePage='activation' settings={settings} />
            <form onSubmit={handleSubmit(activationSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                {globalMessage.type == 'error' && <Error className='mb-3' error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success className='mb-3' success={globalMessage.message} />}
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
        </div>
    )
}

// Layout
Settings.layout = 'panelLayout';
export default Settings

// Passing props
export async function getServerSideProps(context) {
    // Connect to DB
    await connectDB();
    // Fetch settings
    const settings = await settingsModel.findOne().lean();
    return {
        props: {
            settings: JSON.parse(JSON.stringify(settings))
        },
    }
}