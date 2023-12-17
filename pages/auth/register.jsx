import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { signIn } from "next-auth/react"
import Sidebar from '@/components/auth/sidebar/Sidebar'
import VerifyOtp from '@/components/auth/VerifyOtp';
import VerifyLink from '@/components/auth/VerifyLink';
import Error from '@/components/website/design/Error';
import Success from '@/components/website/design/Success';
import Button from '@/components/website/design/Button'
import Input from '@/components/website/design/Input'
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import { SettingsContext } from '@/conf/context/SettingsContext';

const Register = () => {
  const { settings } = useContext(SettingsContext);
  const router = useRouter(); // Next router
  const { status } = useSession() // Next Auth
  const [error, setError] = useState() // To show errors
  const [success, setSuccess] = useState() // To show success message
  const [signInWithGoogle, setSignInWithGoogle] = useState(false)
  const [verificationRequired, setVerificationRequired] = useState(false) // To check verification status
  const [verificationMethod, setVerificationMethod] = useState()
  const [registerSubmitLoading, setRegisterSubmitLoading] = useState(false)

  // Form state
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  // To handle sign in request
  const onSubmit = async (data) => {
    setRegisterSubmitLoading(true)
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    if (responseData.error) {
      setError(responseData.error)
    } else {
      switch (responseData.verificationMethod) {
        case 'link':
          setVerificationRequired(true)
          setVerificationMethod('link')
          break;
        case 'otp':
          setVerificationRequired(true)
          setVerificationMethod('otp')
          break;
        default: setError(login.error)
          break;
      }
    }
    setRegisterSubmitLoading(false)
  };

  // Auth
  if (status === "authenticated") {
    router.push('/auth/callback')
  } else {
    return (
      <>
        <div className='h-full min-h-screen w-full p-2 lg:flex items-stretch justify-between bg-white'>
          {/* // Sidearea >>>> */}
          <Sidebar />
          {/* // Form >>>> */}
          <div className='bg-white p-5 md:p-10 w-full lg:mr-[50%]'>
            <div className='w-full lg:max-w-[90%] xl:max-w-[80%] m-auto '>
              <Link href={'/'} passHref className="text-primary-500 hover:underline flex items-center gap-1 mb-7"><span className="block text-primary-500 hover:underline" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/></svg>' }}></span>Go back to website</Link>
              {/* // Logo >>>> */}
              <Image src={settings.website.lightLogo} alt='Logo' height={50} width={200} className='block max-h-12 w-auto max-w-full mb-7' />
              <h1 className='text-3xl font-bold text-black-500'>Register now</h1>
              <p className='text-lg text-black-500 mt-1'>Sign Up for Unparalleled Luxury Experiences</p>
              {!verificationRequired &&
                <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                  {/* Error  */}
                  {error && <Error error={error} className='mb-3' />}
                  {/* Success  */}
                  {success && <Success success={success} className='mb-3' />}
                  <Input name='name' label='Full name' type='name' validationOptions={{ required: 'Full name is required' }} placeholder='John doe' register={register} className="w-full mb-3" />
                  {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                  <Input name='email' label='Email address' type='email' validationOptions={{ required: 'Email is required' }} placeholder='john.doe@company.com' register={register} className="w-full mb-3" />
                  {errors.email && <Error error={errors.email.message} className='mb-3 py-1 text-base' />}
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
                  <Button type={'submit'} loading={registerSubmitLoading} className='h-full bg-black-500 text-white hover:bg-black-500/90' variant='primary' label={'Sign up'} />
                  {/* // Devider >>>> */}
                  <div className="flex items-center justify-center w-full relative">
                    <hr className="w-64 h-px my-5 bg-black-200 border-0 dark:border-gray-600" />
                    <span className="absolute px-3 font-medium text-black-500 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-black-500">or</span>
                  </div>
                  {/* // Google >>>> */}
                  <Button type={'button'} variant='secondary-icon' label={signInWithGoogle ? 'Signing with Google ••••' : 'Sign up with Google'} onClick={() => { signIn('google', { callbackUrl: '/' }); setSignInWithGoogle(true); }} icon='<svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>' />
                  {/* // New account >>>> */}
                  <p className="mt-3 text-base font-medium text-black-500 dark:text-white">Already have account? <Link href="/auth/signin" className="text-primary-500 hover:underline dark:text-primary-300">Sign in</Link></p>
                </form>
              }
              {/* If verification method is OTP Based */}
              {verificationRequired && verificationMethod == 'otp' && <VerifyOtp email={getValues('email')} />}
              {/* // If verification method is Link Based */}
              {verificationRequired && verificationMethod == 'link' && <VerifyLink email={getValues('email')} />}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Register