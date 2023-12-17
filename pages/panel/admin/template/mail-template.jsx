import React, { useState, useEffect } from 'react'
import Button from '@/components/panel/design/Button'
import Image from 'next/image'
import { otpMailTemplates } from '@/conf/mail/templates/otpMailTemplate'
import { linkMailTemplates } from '@/conf/mail/templates/linkMailTemplate'
import Unauth from '@/components/panel/design/Unauth';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/panel/design/PageTitle'
import Error from '@/components/panel/design/Error'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const Template = () => {
    const { data: session, status } = useSession() // Next Auth
    const [globalMessage, setGlobalMessage] = useState({ type: '', message: '' }) // Global Error/Success Message
    const [templateType, setTemplateType] = useState('otp')
    const [templates, setTemplates] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedMailTemplate, setSelectedMailTemplate] = useState({})
    const [reFetch, setReFetch] = useState(false)

    // To set default template >>>>>>>>>>>>>>>>
    const setDefaultTemplate = async (templateId) => {
        setLoading(true)
        const response = await fetch('/api/panel/templates/admin/mail-template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ templateType, templateId })
        })
        const responseData = await response.json();
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setReFetch(!reFetch)
        }
        setLoading(false)
    }

    // To fetch templates >>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await fetch('/api/panel/settings/admin/');
            const responseData = await response.json();
            switch (templateType) {
                case 'otp':
                    setTemplates(otpMailTemplates)
                    setSelectedMailTemplate(responseData.login.otpMailTemplate)
                    break;
                case 'link':
                    setTemplates(linkMailTemplates)
                    setSelectedMailTemplate(responseData.login.linkMailTemplate)
                    break;
                default:
                    setTemplates(otpMailTemplates)
                    setSelectedMailTemplate(responseData.login.otpMailTemplate)
                    break;
            }
            setLoading(false)
        }
        fetchData()
    }, [templateType, reFetch])

    // Auth >>>>>>>>>>>>>>>>
    if (status === "loading") {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }

    return (
        <div className='px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen'>
            {/* Title section */}
            <PageTitle title={'Mail templates'} className='py-5' />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {/* // Action */}
            <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
                <Tabs>
                    <TabButton onClick={() => setTemplateType('otp')} label='OTP Templates' activeTab={templateType} tabName='otp' />
                    <TabButton onClick={() => setTemplateType('link')} label='Link Templates' activeTab={templateType} tabName='link' />
                </Tabs>
            </div>
            {/* // Templates */}
            {loading ?
                <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10'>
                    <div className='bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md flex flex-col'>
                        <div className="w-full rounded-t-md min-h-[200px] max-h-[259px] bg-gray-200 dark:bg-black-400"></div>
                        <div className='px-2 py-2 flex flex-col justify-between h-max flex-grow-1' style={{ flexGrow: 1 }}>
                            <div className="w-full rounded-md min-h-[15px] bg-gray-200 dark:bg-black-400"></div>
                            <div className="w-full rounded-md min-h-[10px] bg-gray-200 dark:bg-black-400 mt-3"></div>
                            <div className="w-full text-base rounded-md py-2 mt-2 min-h-[40px] bg-gray-200 dark:bg-black-400"></div>
                        </div>
                    </div>
                    <div className='bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md flex flex-col'>
                        <div className="w-full rounded-t-md min-h-[200px] max-h-[259px] bg-gray-200 dark:bg-black-400"></div>
                        <div className='px-2 py-2 flex flex-col justify-between h-max flex-grow-1' style={{ flexGrow: 1 }}>
                            <div className="w-full rounded-md min-h-[15px] bg-gray-200 dark:bg-black-400"></div>
                            <div className="w-full rounded-md min-h-[10px] bg-gray-200 dark:bg-black-400 mt-3"></div>
                            <div className="w-full text-base rounded-md py-2 mt-2 min-h-[40px] bg-gray-200 dark:bg-black-400"></div>
                        </div>
                    </div>
                    <div className='bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md flex flex-col'>
                        <div className="w-full rounded-t-md min-h-[200px] max-h-[259px] bg-gray-200 dark:bg-black-400"></div>
                        <div className='px-2 py-2 flex flex-col justify-between h-max flex-grow-1' style={{ flexGrow: 1 }}>
                            <div className="w-full rounded-md min-h-[15px] bg-gray-200 dark:bg-black-400"></div>
                            <div className="w-full rounded-md min-h-[10px] bg-gray-200 dark:bg-black-400 mt-3"></div>
                            <div className="w-full text-base rounded-md py-2 mt-2 min-h-[40px] bg-gray-200 dark:bg-black-400"></div>
                        </div>
                    </div>
                    <div className='bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md flex flex-col'>
                        <div className="w-full rounded-t-md min-h-[200px] max-h-[259px] bg-gray-200 dark:bg-black-400"></div>
                        <div className='px-2 py-2 flex flex-col justify-between h-max flex-grow-1' style={{ flexGrow: 1 }}>
                            <div className="w-full rounded-md min-h-[15px] bg-gray-200 dark:bg-black-400"></div>
                            <div className="w-full rounded-md min-h-[10px] bg-gray-200 dark:bg-black-400 mt-3"></div>
                            <div className="w-full text-base rounded-md py-2 mt-2 min-h-[40px] bg-gray-200 dark:bg-black-400"></div>
                        </div>
                    </div>
                </div>
                :
                <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10'>
                    {templates.map((template, index) => (
                        <div key={index} className='bg-white dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md flex flex-col'>
                            <Image src={template.image} alt='Image' width={404} height={259} className='w-full rounded-t-md max-h-[259px]' />
                            <div className='px-2 py-2 flex flex-col justify-between h-max flex-grow-1' style={{ flexGrow: 1 }}>
                                <div>
                                    <p className='text-black-500 dark:text-white text-lg font-medium'>{template.name}</p>
                                    <p className='text-black-300 dark:text-black-200 text-base font-normal my-1 line-clamp-3'>{template.desc}</p>
                                </div>
                                {selectedMailTemplate == template.id ?
                                    <Button variant='primary-icon' disabled={true} className='w-full text-base py-2 mt-2' label='Selected' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'} /> :
                                    <Button variant='secondary-icon' onClick={() => setDefaultTemplate(template.id)} className='w-full text-base py-2 mt-2' label='Select template' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                                }
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

// Layout
Template.layout = 'panelLayout';
export default Template