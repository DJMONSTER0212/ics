import React, { useEffect, useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import SelectInput from '@/components/panel/design/Select';
import { components } from 'react-select';
import TitleDevider from '@/components/panel/design/TitleDevider';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const {
        asPath,        // the value: "/question/how-do-you-get-the-current-url-in-nextjs/"
        pathname,   // the value: "/question/[slug]"
    } = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})
    const [myIcal, setMyIcal] = useState("");

    // For fubmit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For edit villa >>>>>>>>>>>>>>>>>
    const [editiCalSelectValue, setEditiCalSelectValue] = useState()

    // For edit submit >>>>>>>>>>>>>>>>>
    const editSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true)
        const formData = new FormData()
        // Sending iCal links array
        let icalLinks = JSON.stringify(editiCalSelectValue.map((link) => link.value))
        // Adding data to formdata
        formData.append('icalLinks', icalLinks);
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/ical`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            router.reload();
        }
        setSubmitLoading(false)
    }
    // To Fetch property details >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/ical`);
            const responseData = await response.json();
            // console.log(asPath, pathname)
            const base_url = process.env.NEXT_PUBLIC_BASE_URI;

            setMyIcal(`${base_url}api/ical/${id}`)
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Convert iCal links in react select form
                const icalLinks = responseData.data.icalLinks.map((link) => ({
                    value: link,
                    label: link
                }));
                setEditiCalSelectValue(icalLinks) // Set data in iCal links
            } else {
                setGlobalMessage({ message: responseData.error, type: 'error' })
            }
            setLoading(false)
        }
        if (router.query.id) {
            fetchVilla(router.query.id);
        }
    }, [router.query.id])
    // Auth >>>>>>>>>>
    if (status === "loading") {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }
    const onCopy = () => {
        navigator.clipboard.writeText(myIcal);
        toast.success("Link Copied To Clipboard")
    };
    return (
        <>
            <ToastContainer theme="dark" />
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
                            title: villa.name,
                            url: `/panel/admin/villas/${router.query.id}/general`
                        },
                        {
                            title: 'iCal links'
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
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 w-full rounded-md mb-3 grid gap-1 p-1">
                                <div className="bg-gray-300 dark:bg-black-500 h-10 w-full rounded-md"></div>
                                <div className="bg-gray-300 dark:bg-black-500 h-10 w-full rounded-md"></div>
                                <div className="bg-gray-300 dark:bg-black-500 h-10 w-full rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                            </div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                    </div> : Object.keys(villa).length > 0 &&
                    <>
                        {/* // Action [Page links] */}
                        <PageLinks activePage='ical' villaId={router.query.id} settings={settings} />
                        <div className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                            {/* // Edit form */}
                            <TitleDevider title='iCal links' className='mb-3' />
                            <form onSubmit={editSubmit} encType='multipart/form-data'>
                                <SelectInput
                                    CreatableSelectOn={true}
                                    className="mb-3"
                                    cacheOptions
                                    defaultOptions={true}
                                    value={editiCalSelectValue}
                                    onChange={(values) => { setEditiCalSelectValue(values) }}
                                    label="Manage iCal links"
                                    placeholder='Type to create iCal link..'
                                    noOptionsMessage={() => 'Type to create iCal link..'}
                                    isSearchable={true}
                                    isMulti={true}
                                    components={{
                                        Option: ({ data, ...props }) => {
                                            return (
                                                <components.Option {...props}>
                                                    <>
                                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                                                    </>
                                                </components.Option>
                                            );
                                        },
                                        MultiValue: (props) => {
                                            const { data, removeProps } = props;
                                            return (
                                                <components.MultiValue {...props} className='w-full bg-gray-200 dark:bg-black-400 rounded-md px-2 py-1'>
                                                    <div className="flex items-center justify-between">
                                                        <components.MultiValueLabel>
                                                            <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.value}</h2>
                                                        </components.MultiValueLabel>
                                                        <span {...removeProps} className='bg-red-200 hover:bg-red-300 rounded-md w-8 h-8 p-2 text-red-800 cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>' }}></span>
                                                    </div>
                                                </components.MultiValue>
                                            );
                                        },
                                        MultiValueRemove: () => { },
                                        ClearIndicator: () => { }
                                    }}
                                />
                                <Button type='submit' loading={submitLoading} variant='primary' label='Update iCal links' />
                            </form>
                            <h4 className='mt-2'>Your Ical Link</h4>
                            <hr />
                            <div className='my-1 p-2 pl-3 border-indigo-700'>
                                <p>{myIcal}</p>
                            </div>
                            <button className='px-6 py-2.5 text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 w-full rounded-md text-lg ' type={"button"} onClick={onCopy} variant='primary' label='Click here to copy your link' >Click here to copy Your link</button>
                        </div>
                    </>
                }
            </div>
        </>
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