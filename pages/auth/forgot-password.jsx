import React, { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getCsrfToken } from "next-auth/react"
import ChangePassword from '@/components/auth/ChangePassword';
import Error from '@/components/website/design/Error';
import Sidebar from '@/components/auth/sidebar/Sidebar'
import Button from '@/components/website/design/Button';
import Input from '@/components/website/design/Input';
import { useForm } from "react-hook-form";
import { useSession } from 'next-auth/react';
import { SettingsContext } from '@/conf/context/SettingsContext';
import Image from 'next/image';

const Login = ({ csrfToken }) => {
    const { settings } = useContext(SettingsContext);
    const router = useRouter(); // Next router
    const { status } = useSession() // Next Auth
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [error, setError] = useState('') // To show errors
    const [verificationRequired, setVerificationRequired] = useState(false) // To check verification status
    const [verificationMethod, setVerificationMethod] = useState('')
    const [signInSubmitLoading, setSignInSubmitLoading] = useState(false)
    // To handle sign in request
    const onSubmit = async (data) => {
        setSignInSubmitLoading(true)
        const loginFetch = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const login = await loginFetch.json();
        if (login.error) {
            switch (login.error) {
                case 'Please verify your email using otp':
                    setVerificationRequired(true)
                    setVerificationMethod('otp')
                    break;
                default: setError(login.error)
                    break;
            }
        } else {
            if (router.query.callbackUrl) {
                setError()
                router.push(router.query.callbackUrl)
            } else {
                router.push('/auth/callback')
            }
        }
        setSignInSubmitLoading(false)
    };

    // Auth
    if (status === "authenticated") {
        router.push('/auth/callback')
    } else {
        return (
            <>
                <div className='h-full min-h-screen w-full p-2 lg:flex items-stretch justify-between bg-white'>
                    {/* // Form >>>> */}
                    <div className='bg-white p-5 md:p-10 w-full lg:mr-[50%]'>
                        <div className='w-full lg:max-w-[90%] xl:max-w-[80%] m-auto '>
                            <Link href={'/'} passHref className="text-primary-500 hover:underline flex items-center gap-1 mb-7"><span className="block text-primary-500 hover:underline" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/></svg>' }}></span>Go back to website</Link>
                            {/* // Logo >>>> */}
                            <Image src={settings.website.lightLogo} alt='Logo' height={50} width={200} className='block max-h-12 w-auto max-w-full mb-7' />
                            <h1 className='text-3xl font-bold text-black-500'>Forgot password</h1>
                            <p className='text-lg text-black-500 mt-1'>Enter your details to change your password</p>
                            {/* // Hide when user is not verified */}
                            {!verificationRequired &&
                                <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                                    {/* Error  */}
                                    {error && <Error error={error} className='mb-3' />}
                                    {/* // CSRF Token */}
                                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                                    {/* // Email */}
                                    <Input name='email' register={register} label='Email address' type='email' validationOptions={{ required: 'Email is required' }} placeholder='john.doe@company.com' className='mb-3' />
                                    {errors.email && <Error error={errors.email.message} className='mb-3 py-1 text-base' />}
                                    {/* // Submit >>>> */}
                                    <Button type={'submit'} loading={signInSubmitLoading} variant='primary' label={'Send OTP'} className='h-full bg-black-500 text-white hover:bg-black-500/90' />
                                    {/* // New account >>>> */}
                                    <p className="mt-3 text-base font-medium text-black-500">New here? <Link href={`/auth/register`} className="text-primary-500 hover:underline">Create account</Link></p>
                                </form>
                            }
                            {/* If verification method is OTP Based */}
                            {verificationRequired && verificationMethod == 'otp' && <ChangePassword email={getValues('email')} />}
                        </div>
                    </div>
                    {/* // Sidearea >>>> */}
                    <Sidebar />
                </div>
            </>
        )
    }
}


export default Login

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}