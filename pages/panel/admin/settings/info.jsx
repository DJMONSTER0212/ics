import React, { useState, useContext } from 'react'
import { SettingsContext } from '@/conf/context/SettingsContext';
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import { useForm, Controller } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/setting/admin/PageLinks';
import Textarea from '@/components/panel/design/Textarea';
import dynamic from 'next/dynamic'
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = () => {
    const { data: session, status } = useSession(); // Next auth
    // Ckeditor
    const CKEditorWrapper = dynamic(() => import("@/components/panel/design/CKEditorWrapper"), { ssr: false });
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const { settings, setSettings } = useContext(SettingsContext) // To update setting context
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control } = useForm({ defaultValues: settings.website.info });
    // For settings submit
    const websiteSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/info`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To update setting context
            let info = responseData.updatedFields['website.info'];
            setSettings({
                ...settings,
                website: {
                    ...settings.website,
                    info: {
                        'inquiryMail': info.inquiryMail,
                        'inquiryPhone': info.inquiryPhone,
                        'inquiryPhone2': info.inquiryPhone2,
                        'address': info.address,
                        'footerPara': info.footerPara,
                    }
                }
            })
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
                        title: 'Information',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}

            {/* // Action [Page links] */}
            <PageLinks activePage='info' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(websiteSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='Information' className='mb-3' />
                <Input type='text' name='inquiryMail' register={register} optional={true} label='Inquiry mail' placeholder='Ex: support@tnitservices.com' className='mb-3' />
                <Input type='text' name='inquiryPhone' register={register} optional={true} label='Inquiry phone number' placeholder='Ex: +918652290747' className='mb-3' />
                <Input type='text' name='inquiryPhone2' register={register} optional={true} label='Inquiry phone number 2' placeholder='Ex: +918652290747' className='mb-3' />
                <Input type='text' name='whatsappPhone' register={register} optional={true} label='Whatsapp number' placeholder='Ex: +918652290747' className='mb-3' />
                <Textarea rows={5} name='address' register={register} optional={true} label='Address' placeholder='Ex: G-141, B Wing, Express Zone, Western Express Highway, Goregaon East, Mumbai - 400063' className='mb-3' />
                <Controller
                    name="footerPara"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <CKEditorWrapper control={control} className='mb-3' name="footerPara" label='Footer introduction' placeholder='Write here.....' />}
                />
                <Button type='submit' loading={submitLoading} variant='primary' label='Update information' />
            </form>
        </div>
    )
}

// Layout
Index.layout = 'panelLayout';
export default Index