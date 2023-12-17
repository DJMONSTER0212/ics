import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import { useForm, useWatch } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/setting/admin/PageLinks';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import Toggle from '@/components/panel/design/Toggle';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control } = useForm({ defaultValues: settings.admin.property });
    const letOwnerManageReviews = useWatch({ control, name: 'letOwnerManageReviews' });
    // For settings submit
    const websiteSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/property`, {
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
                        title: 'Property',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {/* // Action [Page links] */}
            <PageLinks activePage='property' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(websiteSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                {settings.tnit.multiVendorAllowed &&
                    <>
                        <TitleDevider title='Verification settings' className='mb-3' />
                        <Toggle
                            control={control}
                            name='autoVerifyVilla'
                            label='Auto verify villas'
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Allowing auto verification for villas will make villas live instantly if they are not blocked or booking is allowed.</p>
                        <Toggle
                            control={control}
                            name='autoVerifyHotel'
                            label='Auto verify hotels'
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Allowing auto verification for hotels will make hotels live instantly if they are not blocked or booking is allowed.</p>
                    </>
                }
                <TitleDevider title='Reviews settings [Common for both villas and hotels]' className='mb-3' />
                {settings.tnit.multiVendorAllowed &&
                    <>
                        <Toggle
                            control={control}
                            name='letOwnerManageReviews'
                            label='Let property owner manage reviews '
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>This will give ability of enable or disable a review on property to a property owner</p>
                    </>
                }
                {!letOwnerManageReviews &&
                    <>
                        <Toggle
                            control={control}
                            name='reviewsAllowed'
                            label='Allow reviews on all properties'
                            className='mb-3'
                        />
                    </>
                }
                <Toggle
                    control={control}
                    name='onlyUsersWithBookingAllowed'
                    label='Only allow reviews by users who had previous bookings'
                    className='mb-3'
                />
                <Button type='submit' loading={submitLoading} variant='primary' label='Update property settings' />
            </form>
        </div >
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
    const fetchSettings = await settingsModel.findOne().lean();
    const settings = JSON.parse(JSON.stringify(fetchSettings));
    return {
        props: {
            settings
        },
    }
}