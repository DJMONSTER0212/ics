import React, { useState, useEffect } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import { useForm, useWatch } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import Toggle from '@/components/panel/design/Toggle';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [villa, setVilla] = useState({})

    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit promotions settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
    // For promotions settings submit
    const settingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${router.query.id}/promotions`, {
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

    // To Fetch promotions settings >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/promotions`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Set villa values in react hook form format
                if (responseData.data.promotion && Object.keys(responseData.data.promotion).length > 0) {
                    Object.entries(responseData.data.promotion).forEach(([name, value]) => setValue(name, value));
                }
            } else {
                setGlobalMessage({ message: responseData.error, type: 'error' })
            }
            setLoading(false)
        }
        if (router.query.id) {
            fetchVilla(router.query.id);
        }
    }, [router.query.id, setValue])
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
                loading={loading}
                breadcrumbs={[
                    {
                        title: 'Villas',
                        url: '/panel/admin/villas/'
                    },
                    {
                        title: villa.name || 'General settings',
                        url: `/panel/admin/villas/${router.query.id}/general`
                    },
                    {
                        title: 'Promotions'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}

            {loading ? <div className='animate-pulse'>
                <div className='flex gap-5 justify-between items-center bg-white dark:bg-dimBlack py-5'>
                    <div className="flex gap-5 items-center overflow-scroll whitespace-nowrap no-scrollbar">
                        <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                    </div>
                </div>
                <div className='w-full bg-gray-50 dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                    <div className="flex gap-5 items-center mb-5">
                        <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                        <div className="bg-gray-200 dark:bg-black-400 h-1 w-full rounded-md"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-5 w-12 rounded-full"></div>
                    </div>
                    <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                </div>
            </div> : Object.keys(villa).length > 0 &&
            <>
                {/* // Action [Page links] */}
                <PageLinks activePage='promotions' villaId={router.query.id} settings={settings} />
                <div className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                    {/* // Edit form */}
                    <form onSubmit={handleSubmit(settingSubmit)} encType='multipart/form-data'>
                        <TitleDevider title='Promotions settings' className='mb-3' />
                        <Toggle
                            control={control}
                            name='bestRated'
                            label='Mark as best rated'
                            defaultValue={false}
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Best rated properties will have a best rated tag.</p>
                        <Toggle
                            control={control}
                            name='new'
                            label='Mark as new'
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>New will have a best new tag.</p>
                        <Button type='submit' loading={submitLoading} variant='primary' label='Update promotion settings' />
                    </form>
                </div>
            </>
            }
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