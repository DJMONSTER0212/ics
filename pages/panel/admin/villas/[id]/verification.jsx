import React, { useEffect, useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Toggle from '@/components/panel/design/Toggle';
import Input from '@/components/panel/design/Input';
import { useForm } from 'react-hook-form'
import TitleDevider from '@/components/panel/design/TitleDevider';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})

    // For fubmit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit villa >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, getValues, clearErrors, formState: { errors } } = useForm()
    const [rejectRequest, setRejectRequest] = useState(false)

    // For edit submit >>>>>>>>>>>>>>>>>
    const editSubmit = async (data) => {
        setSubmitLoading(true)
        console.log(data)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/verification`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // Update villa info to updated info
            const outputObject = {};
            for (const key in responseData.updatedFields) {
                const nestedKeys = key.split('.');
                let currentObj = outputObject;

                for (let i = 0; i < nestedKeys.length; i++) {
                    const nestedKey = nestedKeys[i];
                    if (!currentObj[nestedKey]) {
                        currentObj[nestedKey] = {};
                    }
                    if (i === nestedKeys.length - 1) {
                        currentObj[nestedKey] = responseData.updatedFields[key];
                    }
                    currentObj = currentObj[nestedKey];
                }
            }
            setVilla({ ...villa, verification: outputObject.verification })
        }
        setSubmitLoading(false)
    }
    // To Fetch property details >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/verification`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Set villa details in react hook form format
                const villaDetails = { ...responseData.data }
                Object.entries(villaDetails.verification).forEach(([name, value]) => setValue(name, value));
            } else {
                setGlobalMessage({ message: responseData.error, type: 'error' })
            }
            setLoading(false)
        }
        if (router.query.id) {
            fetchVilla(router.query.id);
        }
    }, [router.query.id, setValue])
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
                loading={loading}
                breadcrumbs={[
                    {
                        title: 'Villas',
                        url: '/panel/admin/villas/'
                    },
                    {
                        title: villa.name || 'General settings',
                        url: `/panel/admin/villas/${router.query.id}/general`
                    },
                    {
                        title: 'Verification'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {loading ?
                <div className='animate-pulse'>
                    <div className='flex gap-5 justify-between items-center bg-white dark:bg-dimBlack py-5'>
                        <div className="flex gap-5 items-center overflow-scroll whitespace-nowrap no-scrollbar">
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        </div>
                    </div>
                    <div className='w-full bg-gray-50 dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        <div className="flex gap-5 items-center mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-1 w-full rounded-md"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-3 mb-5">
                                <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                            </div>
                            <div className="bg-gray-200 dark:bg-black-400 h-5 w-12 rounded-full"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                    </div>
                </div> : Object.keys(villa).length > 0 &&
                <>
                    {/* // Action [Page links] */}
                    <PageLinks activePage='verification' villaId={router.query.id} settings={settings} />
                    {/* // Edit form */}
                    <form onSubmit={handleSubmit(editSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        <TitleDevider title='Verification details' className='mb-3' />
                        {/* // If property is verified */}
                        {villa.verification.verified &&
                            <>
                                {villa.verification.verificationDocument && <div className="mb-3 bg-white dark:bg-black-600 rounded-md flex flex-col lg:flex-row items-center pl-4 pr-2 py-2">
                                    <h2 className='text-base text-green-500 dark:text-green-300 font-medium text-center lg:text-left'>Property documents</h2>
                                    <div className="flex-1"></div>
                                    <a href={villa.verification.verificationDocument} download={true}><Button type='button' variant='primary-icon' className='text-sm py-2 px-3 bg-green-500 w-full lg:w-fit mt-3 lg:mt-0' labelClassName='whitespace-nowrap' label='Download document' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/></svg>'} /></a>
                                </div>}
                                < Toggle
                                    label={`Verify ${villa.name}`}
                                    name="verified"
                                    control={control}
                                    defaultValue={false}
                                />
                                <p className={`mb-3 text-base text-black-300 dark:text-white font-normal`}>Verifying villa will allow user to list this villa for booking on website.</p>
                                <Button type='submit' loading={submitLoading} variant='primary' label='Update verified status' />
                            </>
                        }
                        {/* // If property is not verified and not submitted for verification */}
                        {!villa.verification.verified && !villa.verification.submitForVerification &&
                            <>
                                <p className={`mb-3 text-base text-white font-normal bg-red-500 dark:bg-red-500 py-2 px-4 rounded-md`}>The villa owner has not submitted a verification request yet. But you can still verify villa.</p>
                                < Toggle
                                    label={`Verify ${villa.name}`}
                                    name="verified"
                                    control={control}
                                    defaultValue={false}
                                />
                                <p className={`mb-3 text-base text-black-300 dark:text-white font-normal`}>Verifying villa will allow user to list this villa for booking on website.</p>
                                <Button type='submit' loading={submitLoading} variant='primary' label='Update verified status' />
                            </>
                        }
                        {/* // If property is not verified and submitted for verification */}
                        {!villa.verification.verified && villa.verification.submitForVerification &&
                            <>
                                <div className="mb-3 bg-white dark:bg-black-600 rounded-md flex flex-col lg:flex-row items-center px-4 py-2">
                                    <span className='w-7 h-7 text-green-500 dark:text-green-300 lg:mr-3' dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16"><path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/></svg>` }}></span>
                                    <h2 className='text-base text-green-500 dark:text-green-300 font-medium text-center lg:text-left'>Owner has submitted verification request for {'"' + villa.name + '"'}</h2>
                                    <div className="flex-1"></div>
                                    <a href={villa.verification.verificationDocument} download={true}><Button type='button' variant='primary-icon' className='text-sm py-2 px-3 bg-green-500 w-full lg:w-fit mt-3 lg:mt-0' labelClassName='whitespace-nowrap' label='Download document' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/></svg>'} /></a>
                                </div>
                                {rejectRequest ? <>
                                    <Input type='text' name='verificationFailReason' register={register} validationOptions={{ required: 'Rejection reason is required' }} label='Rejection reason' placeholder='Ex: Fake documents' className='mb-3' />
                                    {errors.verificationFailReason && <Error error={errors.verificationFailReason.message} className='mb-3 py-1 text-base' />}
                                    <Button type='submit' onClick={() => { setValue('verified', false) }} loading={submitLoading} variant='primary' label={`Reject verification request`} />
                                </> :
                                    <Button type='submit' onClick={() => { setValue('verificationFailReason', ''); setValue('verified', true) }} loading={submitLoading} variant='primary' label={`Verify ${villa.name} `} />
                                }
                                <p onClick={() => setRejectRequest(!rejectRequest)} className='mt-3 text-base text-primary-500 dark:text-primary-400 font-medium text-center cursor-pointer'>{rejectRequest ? `Want to verify ${villa.name}` : `Don't want to verify ${villa.name}?`}</p>
                            </>
                        }
                    </form>
                </>
            }
        </div>
    )
}

// Layout
Villa.layout = 'panelLayout';
export default Villa

// Passing props to layout
export async function getServerSideProps(context) {
    // Connect to DB
    await connectDB();
    // Fetch settings
    const settings = await settingsModel.findOne().lean();
    return {
        props: {
            settings: JSON.parse(JSON.stringify(settings))
        },
    }
}