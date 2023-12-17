import React, { useState, useRef, useEffect } from 'react'
import Table from '@/components/panel/design/table/Table'
import Button from '@/components/panel/design/Button'
import Action from '@/components/panel/design/table/Action'
import Error from '@/components/panel/design/Error'
import { useSession } from 'next-auth/react'
import Success from '@/components/panel/design/Success'
import { useRouter } from 'next/router';
import Unauth from '@/components/panel/design/Unauth'
import AddPayment from '@/components/panel/pageComponents/payments/admin/AddPayment'
import EditPayment from '@/components/panel/pageComponents/payments/admin/EditPayment'
import DeletePayment from '@/components/panel/pageComponents/payments/admin/DeletePayment'
import PageTitle from '@/components/panel/design/PageTitle'
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import PageLinks from '@/components/panel/pageComponents/payments/admin/Pagelinks'
import Image from 'next/image'
import moment from 'moment'
import Link from 'next/link'

const Payments = ({ settings }) => {
    const router = useRouter();
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Payment details',
            accessor: 'src',
            Cell: ({ value, row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        <p className="text-xs bg-gray-300 dark:bg-black-400/40 px-1.5 py-0.5 w-fit rounded-sm text-black-500 dark:text-white">{value != 'other' ? value.charAt(0).toUpperCase() + value.slice(1) : row.original.srcDesc} {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)} payment</p>
                        {(row.original.status == 'successful' && value == 'razorpay' || value == 'upi') && <div className="flex flex-col">
                            <p className="text-xs text-gray-600 dark:text-gray-400">{value == 'razorpay' ? 'Payment ID' : value == 'upi' && 'Ref. No.'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{value == 'razorpay' ? row.original.razorpay.paymentId : value == 'upi' && row.original.upi.refNo}</p>
                        </div>}
                    </div>)
            },
            disableSortBy: true,
        },
        {
            Header: 'Booking Id',
            accessor: 'paid',
            Cell: ({ value, row }) => {
                return <div className="flex flex-col gap-1">
                    <p className="w-fit text-xs bg-gray-300 dark:bg-black-400/40 px-1 py-0.5 rounded-sm text-black-500 dark:text-white">{row.original.paidFor == 'villa' ? 'Villa Booking Id' : 'Hotel Booking Id'}</p>
                    <p className="text-base text-gray-600 dark:text-gray-400">{row.original.paidFor == 'villa' ? row.original.villaBookingId : row.original.hotelBookingId}</p>
                </div>
            },
            disableSortBy: true,
        },
        {
            Header: 'Paid for',
            accessor: 'paidFor', // Image, Name, Location
            Cell: ({ value, row }) => {
                return value == 'villa' ?
                    <Link href={`/panel/admin/villas/${row.original.villa._id}/general`} passHref className="flex items-center gap-x-3">
                        <Image className="rounded-md" src={row.original.villa.images[0]} width='75' height='45' alt="x" />
                        <div>
                            <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{row.original.villa.name}</h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{row.original.villa.location.name}</p>
                        </div>
                    </Link> :
                    'Hotel'
            },
            disableSortBy: true,
        },
        {
            Header: 'Price',
            accessor: 'range',
            Cell: ({ value, row }) => {
                return <div className="flex flex-col items-start gap-x-2 gap-y-1">
                    <p className="text-xs bg-gray-300 dark:bg-black-400/40 px-1 py-0.5 rounded-sm text-black-500 dark:text-white">{value.charAt(0).toUpperCase() + value.slice(1)} payment</p>
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{settings.website.currencySymbol} {row.original.price}</h2>
                </div>
            },
            disableSortBy: true,
        },
        {
            Header: 'Status and date',
            accessor: 'status',
            Cell: ({ value, row }) => (
                <div className="flex flex-col gap-1">
                    <p className='text-base font-medium text-black-500 dark:text-white'>{value.charAt(0).toUpperCase() + value.slice(1)}</p>
                    <p className='text-sm text-black-500 dark:text-white'>{value == 'successful' ? moment(row.original.paymentDate).format('DD MMM YYYY') : moment(row.original.createdAt).format('DD MMM YYYY')}</p>
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
    const [url, setUrl] = useState('/api/panel/payments/admin?')
    // Search options
    const searchOptions = [
        {
            name: 'Payment',
            value: 'paymentId',
            placeholder: 'Enter payment Id , ref no.....'
        },
        {
            name: 'Booking Id',
            value: 'bookingId',
            placeholder: 'Enter booking Id...'
        },
        {
            name: 'User',
            value: 'userId',
            placeholder: 'Enter name, email...'
        },
        {
            name: 'Villa',
            value: 'villaId',
            placeholder: 'Enter villa name...'
        },
    ]
    // To refetch the table
    const handleReFetch = () => {
        if (ref.current) {
            ref.current.reFetch();
        }
    };

    // For current action type [all, blocked, etc] >>>>>>>>>>>>>>>>
    const [paymentType, setPaymentType] = useState('all')
    const updatePaymentType = (paymentType) => {
        //  To change payment fetch url for table
        setUrl(`/api/panel/payments/admin?paymentType=${paymentType}&`)
        setPaymentType(paymentType)
        setGlobalMessage('') // Clear any global Error/Success message
    }

    // For add payment >>>>>>>>>>>>>>>>
    const [addPaymentDrawer, setAddPaymentDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add payment onclick
    const onClickAddPayment = () => {
        setAddMessage('');
        setAddPaymentDrawer(!addPaymentDrawer)
    }

    // For edit payment >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editPaymentDrawer, setEditPaymentDrawer] = useState(false)
    const [editPaymentId, setEditPaymentId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditPaymentId(id)
        setEditPaymentDrawer(true)
        setEditMessage({ message: '', type: '' })
    }

    // For delete Payment >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deletePaymentDrawer, setDeletePaymentDrawer] = useState(false)
    const [deletePaymentId, setDeletePaymentId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeletePaymentId(id)
        setDeletePaymentDrawer(true)
    }

    // Auth >>>>>>>>>>
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
                    title='Payments'
                    className='py-5'
                />
                {/* // Action */}
                <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
                    <PageLinks
                        activePage={paymentType}
                        settings={settings}
                        updatePaymentType={updatePaymentType}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={onClickAddPayment} className='w-auto text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </div>
                {/* // Messages */}
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
                {/* // Payments Table */}
                <Table columns={columns} url={url} ref={ref} searchOptions={searchOptions} query={router.query} key={router.asPath}></Table>
            </div>
            {/* // Add Payment Drawer */}
            <AddPayment
                addPaymentDrawer={addPaymentDrawer}
                setAddPaymentDrawer={setAddPaymentDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                settings={settings}
                reFetch={handleReFetch}
            />
            {/* // Edit Payment */}
            <EditPayment
                editPaymentDrawer={editPaymentDrawer}
                setEditPaymentDrawer={setEditPaymentDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editPaymentId={editPaymentId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
                settings={settings}
            />
            {/* // Delete Payment */}
            <DeletePayment
                deletePaymentDrawer={deletePaymentDrawer}
                setDeletePaymentDrawer={setDeletePaymentDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deletePaymentId={deletePaymentId}
                session={session}
            />
        </>
    )
}


// Layout
Payments.layout = 'panelLayout';
export default Payments

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