import React, { useEffect, useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import { useForm, Controller } from 'react-hook-form'
import SelectInput from '@/components/panel/design/Select';
import { components } from 'react-select';
import Image from 'next/image';
import TitleDevider from '@/components/panel/design/TitleDevider';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})

    // For fubmit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for select fields [Admin/Vendor search]
    const loadAdmins = async (inputValue, callback) => {
        const response = await fetch(`/api/panel/users/admin/search?adminVendor=true&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options;
    };

    // For edit villa >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, getValues, clearErrors, formState: { errors } } = useForm()
    const [selectedAdmin, setSelectedAdmin] = useState()

    // For edit submit >>>>>>>>>>>>>>>>>
    const editSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/ownership`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            // Set current page title to new title
            setVilla({ ...villa, name: data.name })
            // Update images
            responseData.newImages && setValue('images', responseData.newImages)
            setGlobalMessage({ message: responseData.success, type: 'success' })
        }
        setSubmitLoading(false)
    }
    // To Fetch property details >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/ownership`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Set villa values in react hook form format
                if (Object.keys(responseData.data).length > 0) {
                    const villaDetails = { ...responseData.data }
                    // Set selected admin/vendor in react select format and update selected value in form of id of userId
                    setSelectedAdmin({ value: villaDetails.user._id, label: villaDetails.user.name, email: villaDetails.user.email, image: villaDetails.user.image })
                    villaDetails.userId = villaDetails.user._id;
                    // Set value to form
                    Object.entries(villaDetails).forEach(([name, value]) => setValue(name, value));
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
                        title: 'Ownership'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {loading ?
                <div className='animate-pulse'>
                    <div className='w-full mt-5 bg-gray-50 dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                    </div>
                </div> : Object.keys(villa).length > 0 &&
                <>
                    {/* // Action [Page links] */}
                    <PageLinks activePage='ownership' villaId={router.query.id} settings={settings} />
                    {/* // Edit form */}
                    <form onSubmit={handleSubmit(editSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        {/* // Villa details >>>>>>>>>>>>> */}
                        <TitleDevider title='Ownership details' className='mb-3' />
                        {settings.tnit.multiVendorAllowed &&
                            <>
                                <Controller
                                    name='userId'
                                    control={control}
                                    rules={{ validate: (value) => !value ? 'Vendor/Admin is required.' : null }}
                                    render={({ field }) => {
                                        return <SelectInput
                                            AsyncSelectOn={true}
                                            className="mb-3"
                                            cacheOptions
                                            // defaultValue={{ value: field.value, label: field.value }}
                                            defaultOptions
                                            value={selectedAdmin}
                                            onChange={(e) => { field.onChange(e.value); setSelectedAdmin({ value: e.value, label: e.label, email: e.email }) }}
                                            loadOptions={loadAdmins}
                                            label="Select vendor/admin"
                                            placeholder='Search here...'
                                            noOptionsMessage={() => 'Type to see vendor/admin..'}
                                            isSearchable={true}
                                            components={{
                                                Option: ({ data, ...props }) => {
                                                    return (
                                                        <components.Option {...props}>
                                                            <div className="flex items-center gap-x-3">
                                                                <Image className="rounded-md" src={data.image} width='45' height='45' alt="x" />
                                                                <div>
                                                                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                                                                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{data.email}</p>
                                                                </div>
                                                            </div>
                                                        </components.Option>
                                                    );
                                                }
                                            }}
                                        />
                                    }}
                                />
                                {errors.userId && <Error error={errors.userId.message} className='mb-3 py-1 text-base' />}
                                <p className={`mb-3 text-base primary-400 text-red-500 dark:text-red-400 font-normal`}> <span className='font-medium'>Note:</span> Transferring ownership will remove all addons from the villa.</p>
                            </>
                        }
                        <Button type='submit' loading={submitLoading} variant='primary' label='Transfer ownership' />
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