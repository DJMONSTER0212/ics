import React, { useState } from 'react';
import '@splidejs/react-splide/css';
import Button from '@/components/website/design/Button';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import Input from '@/components/website/design/Input';
import ImageUpload from '@/components/website/design/ImageUpload'
import { useForm, useWatch } from 'react-hook-form'
import { signOut } from 'next-auth/react';
import usersModel from "@/models/users.model";
import connectDB from "@/conf/database/dbConfig";
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next"
import Error from '@/components/website/design/Error';
import Success from '@/components/website/design/Success';
import settingsModel from "@/models/settings.model";

const Account = ({ user }) => {
  const [message, setMessage] = useState({ message: '', type: '' })
  // For submit button loading >>>>>>>>>>>>>>>>>
  const [submitLoading, setSubmitLoading] = useState(false)
  // For edit user >>>>>>>>>>>>>>>>
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob?.slice(0, 10),
      anniversary: user.anniversary?.slice(0, 10),
      image: user.image
    }
  })
  const editImageSrc = useWatch({ control, name: 'image' })

  // Edit form handler >>>>>>>>>>>>>>>>
  const editFormSubmit = async (data) => {
    setSubmitLoading(true)
    data.image = data.image[0]
    const formData = new FormData()
    for (var key in data) {
      formData.append(key, data[key]);
    }
    const response = await fetch(`/api/website/user/account`, {
      method: "POST",
      body: formData
    })
    const responseData = await response.json()
    if (responseData.error) {
      setMessage({ message: responseData.error, type: 'error' })
    } else {
      setMessage({ message: responseData.success, type: 'success' })
      // Set new image to the form
      setValue('image', responseData.newImage)
    }
    setSubmitLoading(false)
  }

  return (
    <div className="section-lg pt-20">
      {/* // Main section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-5 lg:gap-x-10 my-0 md:my-5">
        <div className="hidden md:block h-fit p-2 md:col-span-1 lg:col-span-1 w-full bg-white border border-gray-300 rounded-md md:sticky md:top-20">
          {/* // Menu */}
          <Link href='/user/account' className="rounded-md bg-black-500 flex items-center text-sm text-white font-regular py-1.5 px-3">
            Account settings
          </Link>
          <Link href='/user/bookings' className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
            Bookings
          </Link>
          <p onClick={() => { signOut({ callbackUrl: '/' }) }} className="cursor-pointer rounded-md hover:bg-red-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
            Logout
          </p>
        </div>
        <div className="md:col-span-2 lg:col-span-3 rounded-md">
          <div className="mb-5">
            <h1 className='text-2xl text-black-500 font-bold'>Account settings</h1>
            <p className='text-base text-black-300 font-normal'>These informations are used for billing.</p>
          </div>
          <div className="bg-white rounded-md p-5">
            <form onSubmit={handleSubmit(editFormSubmit)} encType='multipart/form-data' className="grid gap-4 grid-cols-1">
              {message.type == 'error' && <Error error={message.message} />}
              {message.type == 'success' && <Success success={message.message} />}
              <ImageUpload
                images={editImageSrc}
                register={register}
                name='image'
                label='Profile picture'
                className='mb-3'
                imageGridClassNames='mb-0 w-[75px] h-[75px] '
                optional={true}
              />
              <div className="grid grid-cols-1">
                <Input type='text' register={register} name='name' label='Full name' validationOptions={{ required: 'Full name is required' }} placeholder='John doe' />
                {errors.name && <Error error={errors.name.message} className='mb-0 mt-1 py-1 text-base' />}
              </div>
              <div className="grid gap-4 grid-cols-1 xs:grid-cols-2">
                <div className="flex flex-col">
                  <Input type='email' register={register} name='email' label='Email' validationOptions={{ required: 'Email is required' }} placeholder='yourmail@example.com' />
                  {errors.email && <Error error={errors.email.message} className='py-1 text-base mb-0 mt-1' />}
                </div>
                <div className="flex flex-col">
                  <Input type='number' register={register} optional={true} name='phone' label='Phone number' placeholder='1234567890' />
                </div>
              </div>
              <div className="grid gap-4 grid-cols-1 xs:grid-cols-2">
                <Input type='date' register={register} optional={true} name='dob' label='Date of birth' />
                <Input type='date' register={register} optional={true} name='anniversary' label='Date of anniversary' />
              </div>
              <div className="grid gap-4 grid-cols-1">
                <Button type='submit' label='Update details' loading={submitLoading} className='h-full bg-black-500 text-white hover:bg-black-500/90' />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Layout
Account.layout = 'websiteLayout'
export default Account;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  // Check session >>>>>>>>>>>>>>
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/user/account',
        permanent: false,
      },
    }
  }
  connectDB();
  // Fetch user >>>>>>>>>>>>>>s
  const user = await usersModel.findOne({ _id: session?.user._id }).select({ name: 1, image: 1, email: 1, phone: 1, dob: 1, anniversary: 1 }).lean();
  // Fetch settings
  const fetchSettings = await settingsModel.findOne().select({website:1}).lean();
  const settings = JSON.parse(JSON.stringify(fetchSettings));
  // Get domain name
  const { req } = context;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const domainName = `${protocol}://${req.headers.host}`;
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      seo: {
        title: `${user.name} | ${settings.website?.name}`,
        desc: settings.website?.seoInfo?.metaDesc,
        fevicon: settings.website?.fevicon,
        image: settings.website?.lightLogo,
        url: domainName,
      }
    },
  }
}