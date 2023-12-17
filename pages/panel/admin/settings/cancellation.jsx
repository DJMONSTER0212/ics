import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import { useForm, useWatch } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/setting/admin/PageLinks';
import Toggle from '@/components/panel/design/Toggle';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import CancellationRules from '@/components/panel/pageComponents/setting/admin/CancellationRules';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For cancellation settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues: settings.admin.cancellation });
    const letOwnerManageCancellation = useWatch({ control, name: 'letOwnerManageCancellation' })
    // For settings submit
    const settingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/cancellation`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // Update settings
            settings.admin.cancellation.letOwnerManageCancellation = data.letOwnerManageCancellation;
        }
        setSubmitLoading(false)
    }
    // Auth >>>>>>>>>>
    if (status === "loading") {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }
    return (
        <div className="px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen">
            {/* Title section */}
            <PageTitle
                breadcrumbs={[
                    {
                        title: 'Settings',
                        url: '/panel/admin/settings/website'
                    },
                    {
                        title: 'Cancellation',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {/* // Action [Page links] */}
            <PageLinks activePage='cancellation' settings={settings} />
            <div className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                {/* // Edit form */}
                <form onSubmit={handleSubmit(settingSubmit)} encType='multipart/form-data'>
                    <TitleDevider title='Cancellation settings' className='mb-3' />
                    {settings.tnit.multiVendorAllowed &&
                        <>
                            <Toggle
                                control={control}
                                name='letOwnerManageCancellation'
                                label='Let property owner manage cancellations rules for bookings '
                            />
                            <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>This will give ability of setting cancellation rules for a booking to a property owner</p>
                        </>
                    }
                    {!letOwnerManageCancellation &&
                        <>
                            <Toggle
                                control={control}
                                name='allowCancellation'
                                label='Allow cancellation'
                                className='mb-3'
                            />
                        </>
                    }
                    <Button type='submit' loading={submitLoading} variant='primary' label='Update cancellation settings' />
                </form>
                {/* // Cancellation rules */}
                {!settings.admin.cancellation.letOwnerManageCancellation && <CancellationRules
                    globalMessage={globalMessage}
                    setGlobalMessage={setGlobalMessage}
                />
                }
            </div>
        </div>
    )
}

// Layout
Index.layout = 'panelLayout';
export default Index

// Passing props to layout
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