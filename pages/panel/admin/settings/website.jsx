import React, { useState, useContext } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import { useForm, useWatch } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/setting/admin/PageLinks';
import ImageUpload from '@/components/panel/design/ImageUpload'
import { SettingsContext } from '@/conf/context/SettingsContext';
import { Controller } from 'react-hook-form';
import SelectInput from '@/components/panel/design/Select';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = () => {
    const { data: session, status } = useSession(); // Next auth
    const { settings, setSettings } = useContext(SettingsContext) // To update setting context
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for select fields [Currency code]
    const currencySymbols = [
        { value: '₹', label: '₹' },
        { value: '$', label: '$' },
    ]
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues: settings.website });
    const lightLogo = useWatch({ control, name: 'lightLogo' })
    const darkLogo = useWatch({ control, name: 'darkLogo' })
    const emailLogo = useWatch({ control, name: 'emailLogo' })
    const fevicon = useWatch({ control, name: 'fevicon' })

    // For vendor settings submit
    const websiteSettingSubmit = async (data) => {
        setSubmitLoading(true)
        // Send light logo image
        if (typeof data.lightLogo != String) {
            data.lightLogo = data.lightLogo[0]
        }
        // Send dark logo image
        if (typeof data.darkLogo != String) {
            data.darkLogo = data.darkLogo[0]
        }
        // Send fevicon image
        if (typeof data.fevicon != String) {
            data.fevicon = data.fevicon[0]
        }
        // Send email image
        if (typeof data.emailLogo != String) {
            data.emailLogo = data.emailLogo[0]
        }
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/website`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To update setting context
            setSettings({
                ...settings,
                website: {
                    'name': responseData.updatedFields['website.name'],
                    'companyName': responseData.updatedFields['website.companyName'],
                    'currencySymbol': responseData.updatedFields['website.currencySymbol'],
                    'lightLogo': responseData.updatedFields['website.lightLogo'],
                    'darkLogo': responseData.updatedFields['website.darkLogo'],
                    'emailLogo': responseData.updatedFields['website.emailLogo'],
                    'fevicon': responseData.updatedFields['website.fevicon'],
                }
            })
            // Set updated value of images to form so images don't get reupload 
            setValue('lightLogo', responseData.updatedFields['website.lightLogo'])
            setValue('darkLogo', responseData.updatedFields['website.darkLogo'])
            setValue('emailLogo', responseData.updatedFields['website.emailLogo'])
            setValue('fevicon', responseData.updatedFields['website.fevicon'])
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
                        title: 'Website',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}

            {/* // Action [Page links] */}
            <PageLinks activePage='website' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(websiteSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='Website details' className='mb-3' />
                <ImageUpload
                    images={lightLogo}
                    register={register}
                    name='lightLogo'
                    label='Logo for light mode'
                    className='mb-3'
                    optional={true}
                    imageGridClassNames='w-auto bg-white p-3'
                />
                <ImageUpload
                    images={darkLogo}
                    register={register}
                    name='darkLogo'
                    label='Logo for dark mode'
                    className='mb-3'
                    optional={true}
                    imageGridClassNames='w-auto bg-black-400 p-3'
                />
                <ImageUpload
                    images={emailLogo}
                    register={register}
                    name='emailLogo'
                    label='Logo for email [In JPG format]'
                    className='mb-3'
                    optional={true}
                    imageGridClassNames='w-auto bg-black-400 p-3'
                />
                <ImageUpload
                    images={fevicon}
                    register={register}
                    name='fevicon'
                    label='Fevicon'
                    className='mb-3'
                    optional={true}
                    imageGridClassNames='w-16 h-16 border border-gray-300 rounded-md'
                />
                <Input type='text' name='name' register={register} validationOptions={{ required: 'Website name is required' }} label='Website name' placeholder='Ex: TNIT Hotel Management System' className='mb-3' />
                {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                <Input type='text' name='companyName' register={register} validationOptions={{ required: 'Company name is required' }} label='Company name' placeholder='Ex: TNIT' className='mb-3' />
                {errors.companyName && <Error error={errors.companyName.message} className='mb-3 py-1 text-base' />}
                <Controller
                    name='currencySymbol'
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
                            options={currencySymbols}
                            className="mb-3"
                            value={currencySymbols.filter((el) => el.value == field.value)}
                            label='Currency code'
                            isSearchable={false}
                            onChange={(e) => field.onChange(e.value)}
                            required={true}
                        />
                    }}
                />
                {errors.currencySymbol && <Error error={errors.currencySymbol.message} className='mb-3 py-1 text-base' />}
                <Button type='submit' loading={submitLoading} variant='primary' label='Update website settings' />
            </form>
        </div>
    )
}

// Layout
Index.layout = 'panelLayout';
export default Index