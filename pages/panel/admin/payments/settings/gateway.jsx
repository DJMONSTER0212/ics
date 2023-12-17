import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import { useForm, useWatch } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/payments/admin/settings/PageLinks';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { Controller } from 'react-hook-form';
import SelectInput from '@/components/panel/design/Select';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for select fields [Currency code]
    const currencyCodes = [
        { value: 'INR', label: 'INR' },
    ]
    // Values for payment gateways
    const gateways = [
        { value: 'razorpay', label: 'Razorpay' },
    ]
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues: settings.admin.gateway });
    const gatewayName = useWatch({ control, name: 'gatewayName' })
    // For settings submit
    const settingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/payments/admin/settings/gateway`, {
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
                        title: 'Payment gateway',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {/* // Action [Page links] */}
            <PageLinks activePage='gateway' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(settingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='Payment gateway settings [Razorpay]' className='mb-3' />
                <Controller
                    name='currencyCode'
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                                return "Currency code is required"
                            }
                            return true
                        }
                    }}
                    render={({ field }) => {
                        return <SelectInput
                            options={currencyCodes}
                            className="mb-3"
                            value={currencyCodes.filter((el) => el.value == field.value)}
                            label='Currency code'
                            isSearchable={false}
                            onChange={(e) => field.onChange(e.value)}
                            required={true}
                        />
                    }}
                />
                {errors.currencyCode && <Error error={errors.currencyCode.message} className='mb-3 py-1 text-base' />}
                <Controller
                    name='gatewayName'
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                                return "Payment gateway is required"
                            }
                            return true
                        }
                    }}
                    render={({ field }) => {
                        return <SelectInput
                            options={gateways}
                            className="mb-3"
                            value={gateways.filter((el) => el.value == field.value)}
                            label='Payment gateway'
                            isSearchable={false}
                            onChange={(e) => field.onChange(e.value)}
                            required={true}
                        />
                    }}
                />
                {errors.gatewayName && <Error error={errors.gatewayName.message} className='mb-3 py-1 text-base' />}
                {gatewayName == 'razorpay' &&
                    <>
                        <Input type='text' name='publicApiKey' register={register} label='Public API key' validationOptions={{ required: 'Public API key is required' }} placeholder='Ex: 4dJdkiSi8wfkSyyq86Ko' className='mb-3' />
                        {errors.publicApiKey && <Error error={errors.publicApiKey.message} className='mb-3 py-1 text-base' />}
                        <Input type='text' name='privateApiKey' register={register} label='Private API key' validationOptions={{ required: 'Private API key is required' }} placeholder='Ex: 4dJdkiSi8wfkSyyq86Ko' className='mb-3' />
                        {errors.privateApiKey && <Error error={errors.privateApiKey.message} className='mb-3 py-1 text-base' />}
                    </>
                }
                <Button type='submit' loading={submitLoading} variant='primary' label='Update payment gateway settings' />
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