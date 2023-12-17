import React, { useState, useContext } from 'react'
import { SettingsContext } from '@/conf/context/SettingsContext';
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import { useForm } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/setting/admin/PageLinks';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Index = () => {
    const { data: session, status } = useSession(); // Next auth
    const { settings, setSettings } = useContext(SettingsContext) // To update setting context
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For website settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit } = useForm({ defaultValues: settings.website.seoInfo });
    // For settings submit
    const websiteSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/admin/seo`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To update setting context
            let seoInfo = responseData.updatedFields['website.seoInfo'];
            setSettings({
                ...settings,
                website: {
                    ...settings.website,
                    seoInfo: {
                        'title': seoInfo.title,
                        'metaDesc': seoInfo.metaDesc,
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
                        title: 'SEO',
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {/* // Action [Page links] */}
            <PageLinks activePage='seo' settings={settings} />
            {/* // Edit form */}
            <form onSubmit={handleSubmit(websiteSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                <TitleDevider title='SEO details' className='mb-3' />
                <Input type='text' name='title' maxLength='55' register={register} label='Title' placeholder='Ex: Royal hotels' className='mb-3' />
                <Input type='text' name='metaDesc' maxLength='150' register={register} label='Meta description' placeholder='Ex: Your one stop destination.' className='mb-3' />
                <Button type='submit' loading={submitLoading} variant='primary' label='Update SEO settings' />
            </form>
        </div>
    )
}

// Layout
Index.layout = 'panelLayout';
export default Index
