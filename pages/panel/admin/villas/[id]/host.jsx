import React, { useEffect, useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import { useForm } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For edit villa >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    // For edit submit >>>>>>>>>>>>>>>>>
    const editSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Sending images array
        data.hostInfo = JSON.stringify(data.hostInfo)
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/host`, {
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
    // To Fetch villa host info >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/host`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Set villa details in react hook form format
                const villaDetails = { ...responseData.data }
                Object.entries(villaDetails).forEach(([name, value]) => setValue(name, value));
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
                        title: villa.name,
                        url: `/panel/admin/villas/${router.query.id}/general`
                    },
                    {
                        title: 'Host'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {loading ?
                <div className='animate-pulse'>
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
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                    </div>
                </div> : Object.keys(villa).length > 0 &&
                <>
                    {/* // Action [Page links] */}
                    <PageLinks activePage='host' villaId={router.query.id} settings={settings} />
                    {/* // Edit form */}
                    <form onSubmit={handleSubmit(editSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        <TitleDevider title='Host details' className='mb-3' />
                        <Input type='text' name='hostInfo.name' register={register} validationOptions={{ required: 'Host name is required' }} label='Host name' placeholder='Ex: John doe' className='mb-3' />
                        {errors.hostInfo?.name && <Error error={errors.hostInfo?.name.message} className='mb-3 py-1 text-base' />}
                        <Input type='text' name='hostInfo.phone' register={register} validationOptions={{ required: 'Host phone number is required' }} label='Host phone number' placeholder='Ex: +91-0123456789' className='mb-3' />
                        {errors.hostInfo?.phone && <Error error={errors.hostInfo?.phone.message} className='mb-3 py-1 text-base' />}
                        <Input type='email' name='hostInfo.email' register={register} label='Host email' placeholder='Ex: host@your.com' className='mb-3' />
                        <Button type='submit' loading={submitLoading} variant='primary' label='Update host information' />
                    </form>
                </>
            }
        </div>
    )
}

// Layout
Villa.layout = 'panelLayout';
export default Villa

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