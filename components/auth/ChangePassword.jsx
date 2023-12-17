import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signIn } from "next-auth/react";
import Error from '@/components/website/design/Error';
import Success from '@/components/website/design/Success';
import Button from '../website/design/Button';
import Input from '../website/design/Input';
import { useForm } from "react-hook-form";

const ChnagePassword = ({ email }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter() // Next router
    const [signInWithGoogle, setSignInWithGoogle] = useState(false)
    const [error, setError] = useState("An OTP has been sent to your email.") // To show errors
    const [success, setSuccess] = useState() // To show success messages
    const [redirect, setRedirect] = useState(false) // To hide form during redirect
    const [verifySubmitLoading, setVerifySubmitLoading] = useState(false)
    const [resendOtpLoading, setResendOtpLoading] = useState()
    // To handle verification request
    const onSubmit = async (data) => {
        setVerifySubmitLoading(true)
        const response = await fetch('/api/auth/change-password/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp: data.otp, email, password: data.password, cpassword: data.cpassword })
        })
        const responseData = await response.json();

        if (responseData.error) {
            setSuccess(null);
            setError(responseData.error)
        } else {
            setError(null)
            setRedirect(true)
            setSuccess('Your password has been successfully changed. Redirecting to sign in page.');
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
                        <div className='flex flex-col xs:flex-row gap-x-6 w-full'>
                            <div className="grid w-full">
                                <Input name='password' label='Password' type='password' validationOptions={{ required: 'Passowrd is required' }} placeholder='•••••••••' register={register} className="w-full mb-3" />
                                {errors.password && <Error error={errors.password.message} className='mb-3 py-1 text-base' />}
                            </div>
                            <div className="grid w-full">
                                <Input name='cpassword' label='Confirm Password' type='password' validationOptions={{ required: 'Confirm password is required' }} placeholder='•••••••••' register={register} className="w-full mb-3" />
                                {errors.cpassword && <Error error={errors.cpassword.message} className='mb-3 py-1 text-base' />}
                            </div>
                        </div>
                        {/* // Submit >>>> */}
                        <Button type={'submit'} loading={verifySubmitLoading} className='h-full bg-black-500 text-white hover:bg-black-500/90' variant='primary' label={'Change password'} />
                        {/* // New account >>>> */}
                        <p className="mt-3 text-base font-medium text-black-500">New here? <Link href="/panel/register" className="text-primary-500 hover:underline">Create account</Link></p>
                    </div>
                }
            </form>
        </>
    )
}

export default ChnagePassword