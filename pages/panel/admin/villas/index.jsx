import React, { useState, useRef } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Image from 'next/image';
import Table from '@/components/panel/design/table/Table';
import Action from '@/components/panel/design/table/Action';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Unauth from '@/components/panel/design/Unauth';
import { useSession } from 'next-auth/react';
import AddVilla from '@/components/panel/pageComponents/villas/admin/AddVilla';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/PageLinks';
import DeleteVilla from '@/components/panel/pageComponents/villas/admin/DeleteVilla';

const Villas = ({ settings }) => {
    const { data: session, status } = useSession() // Next Auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const [villaType, setVillaType] = useState('all')
    const ref = useRef() // To get child component function (From table component reFetch)
    // For table >>>>>>>>>>>>>>>>>
    var columns = [
        {
            Header: 'Villa',
            accessor: 'name', // Image, Name, Location
            Cell: ({ value, row }) => {
                return <div className="flex items-center gap-x-3">
                    <Image className="rounded-md" src={row.original.images[0]} width='70' height='45' alt="x" />
                    <div>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value}</h2>
                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.location.name}</p>
                    </div>
                </div>
            },
            disableSortBy: true,
        },
        // Conditionally add fields
        ...(settings.tnit.multiVendorAllowed ? [{
            Header: 'User',
            accessor: 'user',
            Cell: ({ value, row }) => {
                return <Link href={`/panel/admin/users?searchOption=email&search=${row.original.user.email}`}>
                    <div className="flex items-center gap-x-2">
                        <Image className="object-cover w-8 h-8 rounded-full" src={row.original.user.image} width='35' height='35' alt="x" />
                        <div>
                            <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value.name}</h2>
                            <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.user.email}</p>
                        </div>
                    </div>
                </Link>
            },
            disableSortBy: true,
        }] : []),
        // Conditionally add fields
        ...(!settings.tnit.multiVendorAllowed ? [{
            Header: 'Address',
            accessor: 'address',
            disableSortBy: true,
        }] : []),
        {
            Header: 'Host',
            accessor: 'hostInfo',
            Cell: ({ value }) => {
                return <div className="flex flex-col gap-x-2">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value.name}</h2>
                    <a href={`tel:${value.phone}`} className="text-xs font-normal text-gray-600 dark:text-gray-400">{value.phone}</a>
                </div>
            },
            disableSortBy: true,
        },
        {
            Header: 'Booking allowed',
            accessor: 'bookingAllowed',
            Cell: ({ value }) => !value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Not allowed</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">Allowed</p>,
            disableSortBy: true,
        },
        // Conditionally add fields
        ...(!settings.tnit.multiVendorAllowed ? [{
            Header: 'Reviews allowed',
            accessor: 'reviewsAllowed',
            Cell: ({ value }) => !value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Not allowed</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">Allowed</p>,
            disableSortBy: true,
        }] : []),
        // Conditionally add fields
        ...(settings.tnit.multiVendorAllowed ? [{
            Header: 'Blocked',
            accessor: 'block',
            Cell: ({ value }) => value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Blocked</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">Not blocked</p>,
            disableSortBy: true,
        }] : []),
        // Conditionally add fields
        ...(settings.tnit.multiVendorAllowed ? [{
            Header: 'Verified',
            accessor: 'verification.verified',
            Cell: ({ row, value }) => value ? <Link href={`/panel/admin/villas/${row.original._id}/verification`} className="text-base font-medium w-fit text-green-600 flex gap-2 items-center">Verified <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 bi bi-patch-check-fill" viewBox="0 0 16 16"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" /></svg></Link> : row.original.verification.submitForVerification ? <Link href={`http://localhost:3000/panel/admin/villas/${row.original._id}/verification`} className="text-base font-medium w-fit text-red-500 dark:text-red-300 flex gap-2 items-center">Pending</Link> : <Link href={`http://localhost:3000/panel/admin/villas/${row.original._id}/verification`} className="text-base font-medium w-fit text-orange-400 dark:text-red-300 flex gap-2 items-center">Not yet</Link>,
            disableSortBy: true,
        }] : []),
        {
            Header: '',
            accessor: 'Action',
            disableSortBy: true,
            Cell: ({ row }) => {
                const actionItems = [
                    {
                        name: 'Edit',
                        url: `/panel/admin/villas/${row.original._id}/general`
                    },
                    {
                        name: 'Trash',
                        onClick: () => { deleteFetch(row.original._id) }
                    }
                ]
                return <Action items={actionItems} />
            },
        },
    ]
    // API Url to fetch villas
    const [url, setUrl] = useState(`/api/panel/villas/admin?villaType=${villaType}&`)
    // Search options
    const searchOptions = [
        {
            name: 'Name',
            value: 'name',
            placeholder: 'Enter villa name...'
        },
        {
            name: 'Location',
            value: 'location',
            placeholder: 'Enter villa location...'
        },
        {
            name: 'Host',
            value: 'host',
            placeholder: 'Enter host name, email or phone no...'
        },
        {
            name: 'User',
            value: 'user',
            placeholder: 'Enter user name or email...'
        },
    ]
    // To refetch the table
    const handleReFetch = () => {
        if (ref.current) {
            ref.current.reFetch();
        }
    };

    // For add villa >>>>>>>>>>>>>>>>
    const [addVillaDrawer, setAddVillaDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add villa onclick
    const onClickAddVilla = () => {
        setAddMessage('');
        setAddVillaDrawer(!addVillaDrawer)
    }

    // For delete Villa >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteVillaDrawer, setDeleteVillaDrawer] = useState(false)
    const [deleteVillaId, setDeleteVillaId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteVillaId(id)
        setDeleteVillaDrawer(true)
    }

    // To update property type and fetch url
    const updateVillaType = (villaType) => {
        setUrl(`/api/panel/villas/admin?villaType=${villaType}&`)
        setVillaType(villaType)
    }

    // Auth >>>>>>>>>>>>>>>>
    if (status === "loading") {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }

    return (
        <>
            <div className='px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen'>
                {/* Title section */}
                <PageTitle
                    title={'Villas'}
                    className='py-5'
                />
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {/* // Action */}
                <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
                    <PageLinks
                        villaType={villaType}
                        updateVillaType={updateVillaType}
                        settings={settings}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={onClickAddVilla} className='w-auto text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </div>
                {/* // Villas Table */}
                <Table columns={columns} url={url} ref={ref} searchOptions={searchOptions} query={router.query} key={router.asPath}></Table>
            </div>
            {/* // Add villa */}
            <AddVilla
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                addVillaDrawer={addVillaDrawer}
                setAddVillaDrawer={setAddVillaDrawer}
                settings={settings}
                reFetch={handleReFetch}
            />
            {/* // Delete Villa */}
            <DeleteVilla
                deleteVillaDrawer={deleteVillaDrawer}
                setDeleteVillaDrawer={setDeleteVillaDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteVillaId={deleteVillaId}
                session={session}
            />
        </>
    )
}

// Layout
Villas.layout = 'panelLayout';
export default Villas

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