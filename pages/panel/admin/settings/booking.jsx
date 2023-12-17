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
import Input from '@/components/panel/design/Input';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, formState: { errors } } = useForm({ defaultValues: settings.admin.booking });
    const letOwnerManageMinimumPriceToBook = useWatch({ control, name: 'letOwnerManageMinimumPriceToBook' });
    // For settings submit
    const websiteSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/booking`, {
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
                        title: 'Booking',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}

            {/* // Action [Page links] */}
            <PageLinks activePage='booking' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(websiteSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='Bookings settings' className='mb-3' />
                <Toggle
                    control={control}
                    name='enableBookingsVilla'
                    label='Allow bookings on villas'
                />
                <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Allowing bookings on villas will activate bookings on villas.</p>
                <Toggle
                    control={control}
                    name='enableBookingsHotel'
                    label='Allow bookings on hotels'
                    className='mb-3'
                />
                <TitleDevider title='Minimun price for booking settings' className='mb-3' />
                {settings.tnit.multiVendorAllowed &&
                    <>
                        <Toggle
                            control={control}
                            name='letOwnerManageMinimumPriceToBook'
                            label='Let property owner manage minimum price for bookings '
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>This will give ability of setting minimum required price for a booking to a property owner</p>
                    </>
                }
                {!letOwnerManageMinimumPriceToBook &&
                    <>
                        <Input type='number' name='minimumPriceToBook' register={register} validationOptions={{ required: 'Minimum price for a booking is required.', validate: (value => (Number(value) >= 1 && Number(value) <= 100) ? true : 'Price should be between 1% to 100%') }} label='Minimum price for a booking [In %]' placeholder='Ex: 50' className='mb-3' />
                        {errors.minimumPriceToBook && <Error error={errors.minimumPriceToBook.message} className='mb-3 py-1 text-base' />}
                        <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after minimum price amount.</span></p>
                    </>
                }
                <TitleDevider title='Check In & Check Out time' className='mb-3' />
                <Input type='text' name='checkInTime' register={register} validationOptions={{ required: 'Check In time is required.' }} label='Check In time' placeholder='Ex: 11:00 AM' className='mb-3' />
                {errors.checkInTime && <Error error={errors.checkInTime.message} className='mb-3 py-1 text-base' />}
                <Input type='text' name='checkOutTime' register={register} validationOptions={{ required: 'Check Out time is required.' }} label='Check Out time' placeholder='Ex: 02:00 PM' className='mb-3' />
                {errors.checkOutTime && <Error error={errors.checkOutTime.message} className='mb-3 py-1 text-base' />}
                <Button type='submit' loading={submitLoading} variant='primary' label='Update booking settings' />
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