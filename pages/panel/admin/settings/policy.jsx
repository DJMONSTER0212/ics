import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import { useForm, Controller } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/setting/admin/PageLinks';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import dynamic from 'next/dynamic'
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    // Ckeditor
    const CKEditorWrapper = dynamic(() => import("@/components/panel/design/CKEditorWrapper"), { ssr: false });
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control } = useForm({ defaultValues: settings.policy });
    // For settings submit
    const websiteSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/policy`, {
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
                        title: 'Policies',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}

            {/* // Action [Page links] */}
            <PageLinks activePage='policy' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(websiteSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='Policies' className='mb-3' />
                <Controller
                    name="refundPolicy"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <CKEditorWrapper control={control} className='mb-3' name="refundPolicy" label='Refund policy' placeholder='Write your policy here.....' />}
                />
                <Controller
                    name="privacyPolicy"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <CKEditorWrapper control={control} className='mb-3' name="privacyPolicy" label='Privacy policy' placeholder='Write your policy here.....' />}
                />
                <Controller
                    name="TermAndConditions"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <CKEditorWrapper control={control} className='mb-3' name="TermAndConditions" label='Terms & Condtions' placeholder='Write your policy here.....' />}
                />
                <Button type='submit' loading={submitLoading} variant='primary' label='Update policies' />
            </form>
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
    const fetchSettings = await settingsModel.findOne().lean();
    const settings = JSON.parse(JSON.stringify(fetchSettings));
    return {
        props: {
            settings
        },
    }
}