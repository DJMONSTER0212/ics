import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signIn } from "next-auth/react";
import Error from '@/components/website/design/Error';
import Success from '@/components/website/design/Success';
import Button from '../website/design/Button';
import Input from '../website/design/Input';
import { useForm } from "react-hook-form";

const VerifyEmail = ({ email }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter() // Next router
    const [signInWithGoogle, setSignInWithGoogle] = useState(false)
    const [error, setError] = useState("Your account isn't verified. An OTP has been sent to your email.") // To show errors
    const [success, setSuccess] = useState() // To show success messages
    const [redirect, setRedirect] = useState(false) // To hide form during redirect
    const [verifySubmitLoading, setVerifySubmitLoading] = useState(false)
    const [resendOtpLoading, setResendOtpLoading] = useState()
    // To handle verification request
    const onSubmit = async (data) => {
        setVerifySubmitLoading(true)
        const response = await fetch('/api/auth/verifyemail/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp: data.otp, email })
        })
        const responseData = await response.json();

        if (responseData.error) {
            setSuccess(null);
            setError(responseData.error)
        } else {
            setError(null)
            setRedirect(true)
            setSuccess('Your account has been successfully verified. Redirecting to sign in page.');
            setTimeout(() => {
                router.push('/auth/signin');
            }, 3000)
        }
        setVerifySubmitLoading(false)
    };

    // To handle resend otp request
    const resendOtp = async () => {
        setResendOtpLoading(true)
        const response = await fetch('/api/auth/resendOtp/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
        const responseData = await response.json();

        if (responseData.error) {
            setError(responseData.error)
            setResendOtpLoading('Failed')
            setSuccess(null)
        } else {
            setError(null)
            setSuccess('OTP has been sent successfully.');
            setResendOtpLoading(false)
        }
    }

    return (
        <>
            <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                {/* Error  */}
                {error && <Error error={error} className='mb-3' />}
                {/* Success  */}
                {success && <Success success={success} className='mb-3' />}
                {!redirect &&
                    <div>
                        <Input name='otp' label='Enter OTP' type='number' placeholder='123456' register={register} validationOptions={{ required: 'OTP is required' }} className='mb-3' />
                        {errors.otp && <Error error={errors.otp.message} className='mb-3 py-1 text-base' />}
                        <p className="float-right mb-3 text-base font-medium text-black-500">{resendOtpLoading ? 'Sending OTP...' : resendOtpLoading == 'Failed' ? 'OTP send failed!' : resendOtpLoading == null ? 'Did not recieved OTP?' : 'OTP sent.'}<span onClick={() => { resendOtp() }} className="text-primary-500 hover:underline cursor-pointer"> Resend</span></p>
                        {/* // Submit >>>> */}
                        <Button type={'submit'} loading={verifySubmitLoading} className='h-full bg-black-500 text-white hover:bg-black-500/90' variant='primary' label={'Verify account'} />
                        {/* // Devider >>>> */}
                        <div className="flex items-center justify-center w-full relative">
                            <hr className="w-64 h-px my-5 bg-black-200 border-0" />
                            <span className="absolute px-3 font-medium text-black-500 -translate-x-1/2 bg-white left-1/2">or</span>
                        </div>
                        {/* // Google >>>> */}
                        <Button type={'button'} variant='secondary-icon' label={signInWithGoogle ? 'Signing with Google ••••' : 'Sign in with Google'} onClick={() => { signIn('google', { callbackUrl: '/' }); setSignInWithGoogle(true); }} icon='<svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>' />
                        {/* // New account >>>> */}
                        <p className="mt-3 text-base font-medium text-black-500">New here? <Link href="/panel/register" className="text-primary-500 hover:underline">Create account</Link></p>
                    </div>
                }
            </form>
        </>
    )
}

export default VerifyEmail