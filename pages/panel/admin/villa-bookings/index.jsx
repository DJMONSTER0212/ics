import React, { useState, useRef } from 'react'
import Table from '@/components/panel/design/table/Table'
import Button from '@/components/panel/design/Button'
import Action from '@/components/panel/design/table/Action'
import Error from '@/components/panel/design/Error'
import { useSession } from 'next-auth/react'
import Success from '@/components/panel/design/Success'
import { useRouter } from 'next/router';
import Unauth from '@/components/panel/design/Unauth'
import AddVillaBooking from '@/components/panel/pageComponents/villa-bookings/admin/AddVillaBooking'
import EditVillaBooking from '@/components/panel/pageComponents/villa-bookings/admin/EditVillaBooking'
import DeleteVillaBooking from '@/components/panel/pageComponents/villa-bookings/admin/DeleteVillaBooking'
import PageTitle from '@/components/panel/design/PageTitle'
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import PageLinks from '@/components/panel/pageComponents/villa-bookings/admin/Pagelinks'
import Image from 'next/image'
import moment from 'moment'
import Link from 'next/link'

const VillaBookings = ({ settings }) => {
    const router = useRouter();
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Main guest',
            accessor: 'mainGuestInfo',
            Cell: ({ value, row }) => {
                return <div className="flex flex-col items-start gap-x-2">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value.name}</h2>
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.mainGuestInfo.email}</p>
                </div>
            },
        },
        {
            Header: 'Villa',
            accessor: 'villa', // Image, Name, Location
            Cell: ({ value, row }) => {
                return <Link href={`/panel/admin/villas/${row.original.villa._id}/general`} passHref className="flex items-center gap-x-3">
                    <Image className="rounded-md" src={row.original.villa.images[0]} width='70' height='45' alt="x" />
                    <div>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value.name}</h2>
                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.villa.location.name}</p>
                    </div>
                </Link>
            },
            disableSortBy: true,
        },
        {
            Header: 'Source',
            accessor: 'src',
            Cell: ({ value, row }) => {
                return <div className="flex flex-col gap-1 items-start gap-x-2">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value.charAt(0).toUpperCase() + value.slice(1)}</h2>
                    {value == 'other' && <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.srcDesc}</p>}
                </div>
            },
            disableSortBy: true,
        },
        {
            Header: 'Stay',
            accessor: 'checkIn',
            Cell: ({ value, row }) => {
                return <div className="flex flex-col items-start gap-x-2">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{moment(value).format('DD MMM YYYY')}</h2>
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">To {moment(row.original.checkOut).format('DD MMM YYYY')}</p>
                </div>
            },
            disableSortBy: true,
        },
        {
            Header: 'Guest',
            accessor: 'guests',
            Cell: ({ value }) => value.adults + 'A, ' + value.childs + 'C, ' + value.pets + 'P',
            disableSortBy: true,
        },
        {
            Header: 'Booked for',
            accessor: 'invoicePricing',
            Cell: ({ value, row }) => value.totalNights + 'N, ' + settings.website.currencySymbol + ' ' + value.priceToBePaid.full,
            disableSortBy: true,
        },
        {
            Header: 'Status and date',
            accessor: 'status',
            Cell: ({ value, row }) => (
                <div className="flex flex-col gap-1">
                    <p className='text-sm font-medium text-black-500 dark:text-white'>{value.charAt(0).toUpperCase() + value.slice(1)}</p>
                    <p className='text-sm text-black-500 dark:text-white'>{moment(row.original.createdAt).format('DD MMM YYYY')}</p>
                </div>
            ),
            disableSortBy: true,
        },
        {
            Header: '',
            accessor: 'Action',
            disableSortBy: true,
            Cell: ({ row }) => {
                const actionItems = [
                    {
                        name: 'Edit',
                        onClick: () => { editFetch(row.original._id) }
                    },
                    {
                        name: 'Trash',
                        onClick: () => { deleteFetch(row.original._id) }
                    }
                ]
                return <Action items={actionItems} />
            },
        },
    ])
    // API Url
    const [url, setUrl] = useState('/api/panel/villa-bookings/admin?')
    // Search options
    const searchOptions = [
        {
            name: 'Guest',
            value: 'mainGuestInfo',
            placeholder: 'Enter guest name, email or number...'
        },
        {
            name: 'Booking Id',
            value: 'bookingId',
            placeholder: 'Enter booking Id...'
        }
    ]
    // To refetch the table
    const handleReFetch = () => {
        if (ref.current) {
            ref.current.reFetch();
        }
    };

    // For current action type [all, blocked, etc] >>>>>>>>>>>>>>>>
    const [villaBookingType, setVillaBookingType] = useState('all')
    const updateVillaBookingType = (villaBookingType) => {
        //  To change villaBooking fetch url for table
        setUrl(`/api/panel/villa-bookings/admin?villaBookingType=${villaBookingType}&`)
        setVillaBookingType(villaBookingType)
        setGlobalMessage('') // Clear any global Error/Success message
    }

    // For add villaBooking >>>>>>>>>>>>>>>>
    const [addVillaBookingDrawer, setAddVillaBookingDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add villaBooking onclick
    const onClickAddVillaBooking = () => {
        setAddMessage('');
        setAddVillaBookingDrawer(!addVillaBookingDrawer)
    }

    // For edit villaBooking >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editVillaBookingDrawer, setEditVillaBookingDrawer] = useState(false)
    const [editVillaBookingId, setEditVillaBookingId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditVillaBookingId(id)
        setEditVillaBookingDrawer(true)
    }

    // For delete villaBooking >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteVillaBookingDrawer, setDeleteVillaBookingDrawer] = useState(false)
    const [deleteVillaBookingId, setDeleteVillaBookingId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteVillaBookingId(id)
        setDeleteVillaBookingDrawer(true)
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
                    title='Villa Bookings'
                    className='py-5'
                />
                {/* // Action */}
                <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
                    <PageLinks
                        activePage={villaBookingType}
                        settings={settings}
                        updateVillaBookingType={updateVillaBookingType}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={onClickAddVillaBooking} className='w-auto text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </div>
                {/* // Messages */}
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
                {/* // VillaBookings Table */}
                <Table columns={columns} url={url} ref={ref} searchOptions={searchOptions} query={router.query} key={router.asPath}></Table>
            </div>
            {/* // Add VillaBooking Drawer */}
            <AddVillaBooking
                addVillaBookingDrawer={addVillaBookingDrawer}
                setAddVillaBookingDrawer={setAddVillaBookingDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                settings={settings}
                reFetch={handleReFetch}
            />
            {/* // Edit VillaBooking */}
            <EditVillaBooking
                editVillaBookingDrawer={editVillaBookingDrawer}
                setEditVillaBookingDrawer={setEditVillaBookingDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editVillaBookingId={editVillaBookingId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
                settings={settings}
            />
            {/* // Delete VillaBooking */}
            <DeleteVillaBooking
                deleteVillaBookingDrawer={deleteVillaBookingDrawer}
                setDeleteVillaBookingDrawer={setDeleteVillaBookingDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteVillaBookingId={deleteVillaBookingId}
                session={session}
            />
        </>
    )
}


// Layout
VillaBookings.layout = 'panelLayout';
export default VillaBookings

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