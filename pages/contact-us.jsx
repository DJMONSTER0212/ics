import React, { useState, useContext, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link';
import Input from '@/components/website/design/Input';
import Image from 'next/image';
import Error from '@/components/panel/design/Error';
import Button from '@/components/website/design/Button';
import Textarea from '@/components/website/design/Textarea';
import { SettingsContext } from '@/conf/context/SettingsContext'
import Success from '@/components/website/design/Success';
import ReCAPTCHA from "react-google-recaptcha"
import Head from 'next/head';
import settingsModel from "@/models/settings.model";
import connectDB from "@/conf/database/dbConfig";

const Contact = ({ CAPTCHA_SITE_KEY }) => {
    const { settings } = useContext(SettingsContext);
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For form >>>>>>>>>>>>>>>>
    const captchaRef = useRef(null)
    const [message, setMessage] = useState({ type: '', message: '' })
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm()
    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        // Captcha
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
        formData.append('captcha', token)
        if (!token) {
            setMessage({ message: 'Please check captcha', type: 'error' });
            window.scrollTo(0, 0)
            setSubmitLoading(false)
            return;
        }
        const response = await fetch(`/api/website/contacts/`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setMessage({ message: responseData.error, type: 'error' })
        } else {
            setMessage({ message: responseData.success, type: 'success' })
            window.scrollTo(0, 0)
            reset() // To reset form
            // To re fetch data on table
        }
        setSubmitLoading(false)
    }
    return (
        <div className="pt-36 pb-20 bg-white">
            <div className='section-lg grid grid-cols-1 md:grid-cols-3 gap-20 items-start relative'>
                <div className='flex flex-col md:col-span-2'>
                    <h2 className="text-2xl xs:text-3xl lg:text-4xl text-black-500 font-semibold">Contact Us</h2>
                    <p className='text-base text-black-400 mt-3'>Have questions or feedback? We{"'"}re here to help. Contact our friendly team today for prompt assistance and support. Your satisfaction is our top priority.</p>
                    <div className="mt-10">
                        {message.type == 'error' && <Error error={message.message} />}
                        {message.type == 'success' && <Success success={message.message} />}
                        <form onSubmit={handleSubmit(addFormSubmit)} encType='multipart/form-data'>
                            <Input type='text' name='name' register={register} validationOptions={{ required: 'Full name is required' }} label='Full name' placeholder='Ex: John Doe' className='mb-3' />
                            {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                            <Input type='text' name='email' register={register} label='Email' validationOptions={{ required: 'Email is required' }} placeholder='Ex: john@example.com' className='mb-3' />
                            {errors.email && <Error error={errors.email.message} className='mb-3 py-1 text-base' />}
                            <Input type='text' name='phone' optional={true} register={register} label='Phone number' validationOptions={{ required: 'Phone number is required' }} placeholder='Ex: +91-0123456789' className='mb-3' />
                            <Input type='text' name='bookingId' optional={true} register={register} label='Booking ID' placeholder='Ex: xdigssa53...' className='mb-3' />
                            <Textarea name='message' rows={5} register={register} label='Message' optional={true} placeholder='Write your message here...' className='mb-3' />
                            <ReCAPTCHA
                                sitekey={CAPTCHA_SITE_KEY}
                                ref={captchaRef}
                                style={{ marginBottom: '10px' }}
                            />
                            <Button loading={submitLoading} label='Submit' className='h-full bg-black-500 text-white hover:bg-black-500/90' />
                        </form>
                    </div>
                </div>
                <div className='bg-primary-500 px-10 py-12 rounded-lg sticky top-20 w-full'>
                    <div className='mt-0'>
                        <h2 className='text-xl font-medium text-white '>Find us at:</h2>
                        <p className='text-base text-white'>{settings.website?.info?.address}</p>
                    </div>
                    <div className="w-full flex flex-col gap-1 mt-5">
                        <Link href={`mailto:${settings.website?.info?.inquiryMail}`} className="text-lg font-medium text-white">Email us at:</Link>
                        <Link href={`mailto:${settings.website?.info?.inquiryMail}`} className='text-base font-normal text-white'>{settings.website?.info?.inquiryMail}</Link>
                    </div>
                    <div className="w-full flex flex-col gap-1 mt-5">
                        <Link href={`tel:${settings.website?.info?.inquiryPhone}`} className="text-lg font-medium text-white">Call us at:</Link>
                        <Link href={`tel:${settings.website?.info?.inquiryPhone}`} className='text-base font-normal text-white'>{settings.website?.info?.inquiryPhone}</Link>
                    </div>
                    <div className="w-full flex flex-col gap-1 mt-5">
                        <Link href={`tel:${settings.website?.info?.inquiryPhone2}`} className="text-lg font-medium text-white">Call us at:</Link>
                        <Link href={`tel:${settings.website?.info?.inquiryPhone2}`} className='text-base font-normal text-white'>{settings.website?.info?.inquiryPhone2}</Link>
                    </div>
                    <div className="flex gap-3 items-center mt-5">
                        {settings.website?.social?.instagram && <Link href={settings.website?.social?.instagram} passHref><Image src='/website/images/instagram-white.svg' alt='Instgram' width={30} height={30}></Image></Link>}
                        {settings.website?.social?.facebook && <Link href={settings.website?.social?.facebook} passHref><Image src='/website/images/facebook-white.svg' alt='Facebook' width={30} height={30}></Image></Link>}
                        {settings.website?.social?.x && <Link href={settings.website?.social?.x} passHref><Image src='/website/images/twitter-white.svg' alt='X' width={30} height={30}></Image></Link>}
                        {settings.website?.social?.youtube && <Link href={settings.website?.social?.youtube} passHref><Image src='/website/images/youtube-white.svg' alt='Youtube' width={30} height={30}></Image></Link>}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Layout
Contact.layout = 'websiteLayout'

export default Contact;

export async function getServerSideProps(context) {
    connectDB();
    const settings = await settingsModel.findOne().lean();
    // Get domain name
    const { req } = context;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domainName = `${protocol}://${req.headers.host}`;
    return {
        props: {
            CAPTCHA_SITE_KEY: process.env.CAPTCHA_SITE_KEY,
            seo: {
                title: `Contact Us | ${settings.website?.name}`,
                desc: `Contact our friendly team today for prompt assistance and support. Your satisfaction is our top priority.`,
                fevicon: settings.website?.fevicon,
                image: settings.website?.lightLogo,
                url: domainName,
            }
        },
    }
}