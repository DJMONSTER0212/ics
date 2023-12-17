import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import { useForm, useWatch } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/payments/admin/settings/PageLinks';
import Toggle from '@/components/panel/design/Toggle';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { Controller } from 'react-hook-form';
import SelectInput from '@/components/panel/design/Select';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for payout days
    let payoutDays = [
        { value: 'sunday', label: 'Sunday' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thrusday', label: 'Thrusday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
    ]
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues: settings.admin.payout });
    const enablePayout = useWatch({ control, name: 'enablePayout' })
    const applyTds = useWatch({ control, name: 'applyTds' })
    const applyCommission = useWatch({ control, name: 'applyCommission' })
    // For settings submit
    const settingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/payments/admin/settings/payout`, {
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
                        title: 'Payment settings',
                        url: '/panel/admin/payments/settings/payout'
                    },
                    {
                        title: 'Payout',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}

            {/* // Action [Page links] */}
            <PageLinks activePage='payout' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(settingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='Payout settings' className='mb-3' />
                <Toggle
                    control={control}
                    name='enablePayout'
                    label='Enable payouts'
                    defaultValue={false}
                />
                <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Enabling payout will make payout automatically on selected day.</p>
                {enablePayout &&
                    <>
                        <Controller
                            name='payoutDay'
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value == null) {
                                        return "Payout day is required"
                                    }
                                    return true
                                }
                            }}
                            render={({ field }) => {
                                return <SelectInput
                                    options={payoutDays}
                                    className="mb-3"
                                    value={payoutDays.filter((el) => el.value == field.value)}
                                    label='Payout day'
                                    isSearchable={false}
                                    onChange={(e) => field.onChange(e.value)}
                                    required={true}
                                />
                            }}
                        />
                        {errors.payoutDay && <Error error={errors.payoutDay.message} className='mb-3 py-1 text-base' />}
                    </>
                }
                <TitleDevider title='TDS settings' className='mb-3' />
                <Toggle
                    control={control}
                    name='applyTds'
                    label='Apply TDS'
                    defaultValue={false}
                />
                <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Commission price will be reduced from payout of every vendor.</p>
                {applyTds &&
                    <>
                        <Input type='number' step=".01" name='tdsPrice' register={register} validationOptions={{ required: 'TDS price is required', validate: (value) => Number(value) < 36 ? true : 'TDS price should be less than 35' }} label='TDS price [In %]' placeholder='Ex: 4' className='mb-3' />
                        {errors.tdsPrice && <Error error={errors.tdsPrice.message} className='mb-3 py-1 text-base' />}
                        <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after TDS price.</span></p>
                    </>
                }
                <TitleDevider title='Commission settings' className='mb-3' />
                <Toggle
                    control={control}
                    name='applyCommission'
                    label='Apply commission rates'
                    defaultValue={false}
                />
                <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Commission price will be reduced from payout of every vendor.</p>
                {applyCommission &&
                    <>
                        <Input type='number' step=".01" name='commissionPrice' register={register} validationOptions={{ required: 'Commission price is required', validate: (value) => Number(value) < 36 ? true : 'Commission price should be less than 35' }} label='Commission price [In %]' placeholder='Ex: 4' className='mb-3' />
                        {errors.commissionPrice && <Error error={errors.commissionPrice.message} className='mb-3 py-1 text-base' />}
                        <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after commission price.</span></p>
                    </>
                }
                <Button type='submit' loading={submitLoading} variant='primary' label='Update commission settings' />
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
    const settings = await settingsModel.findOne().lean();
    return {
        props: {
            settings: JSON.parse(JSON.stringify(settings))
        },
    }
}