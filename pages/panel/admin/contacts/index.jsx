import React, { useState, useRef } from 'react'
import Table from '@/components/panel/design/table/Table'
import Action from '@/components/panel/design/table/Action'
import Error from '@/components/panel/design/Error'
import { useSession } from 'next-auth/react'
import Success from '@/components/panel/design/Success'
import { useRouter } from 'next/router';
import Unauth from '@/components/panel/design/Unauth'
import DeleteContact from '@/components/panel/pageComponents/contacts/admin/DeleteContact'
import EditContact from '@/components/panel/pageComponents/contacts/admin/EditContact'
import PageTitle from '@/components/panel/design/PageTitle'
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import PageLinks from '@/components/panel/pageComponents/contacts/admin/Pagelinks'
import moment from 'moment'

const Contacts = ({ settings }) => {
    const router = useRouter();
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Name',
            accessor: 'name',
            disableSortBy: true,
        },
        {
            Header: 'Info',
            accessor: 'email',
            Cell: ({ value, row }) => {
                return <div>
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value}</h2>
                    <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.phone}</p>
                </div>
            },
            disableSortBy: true,
        },
        {
            Header: 'Booking ID',
            accessor: 'bookingId',
            Cell: ({ value }) => !value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Not provided</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">{value}</p>,
            disableSortBy: true,
        },
        {
            Header: 'Replied',
            accessor: 'replied',
            Cell: ({ value }) => !value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Not replied</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">Yes</p>,
            disableSortBy: true,
        },
        {
            Header: 'Date',
            accessor: 'createdAt',
            Cell: ({ value }) => moment(value).format('DD MMM YYYY'),
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
    // To refetch the table
    const handleReFetch = () => {
        if (ref.current) {
            ref.current.reFetch();
        }
    };
    // API Url
    const [url, setUrl] = useState('/api/panel/contacts/admin?')
    // Search options
    const searchOptions = [
        {
            name: 'Name',
            value: 'name',
            placeholder: 'Enter name...'
        },
        {
            name: 'Number',
            value: 'phone',
            placeholder: 'Enter phone number...'
        },
        {
            name: 'Email',
            value: 'email',
            placeholder: 'Enter email...'
        }
    ]

    // For current action type [all, blocked, etc] >>>>>>>>>>>>>>>>
    const [contactType, setContactType] = useState('all')
    const updateContactType = (contactType) => {
        //  To change contact fetch url for table
        setUrl(`/api/panel/contacts/admin?contactType=${contactType}&`)
        setContactType(contactType)
        setGlobalMessage('') // Clear any global Error/Success message
    }

    // For edit contact >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editContactDrawer, setEditContactDrawer] = useState(false)
    const [editContactId, setEditContactId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditContactId(id)
        setEditContactDrawer(true)
    }

    // For delete contact >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteContactDrawer, setDeleteContactDrawer] = useState(false)
    const [deleteContactId, setDeleteContactId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteContactId(id)
        setDeleteContactDrawer(true)
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
                    title='Contacts'
                    className='py-5'
                />
                {/* // Action */}
                <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
                    <PageLinks
                        activePage={contactType}
                        settings={settings}
                        updateContactType={updateContactType}
                    />
                </div>
                {/* // Messages */}
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
                {/* // Contacts Table */}
                <Table columns={columns} url={url} ref={ref} searchOptions={searchOptions} query={router.query} key={router.asPath}></Table>
            </div>
            {/* // Delete Contact */}
            <DeleteContact
                deleteContactDrawer={deleteContactDrawer}
                setDeleteContactDrawer={setDeleteContactDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteContactId={deleteContactId}
                session={session}
            />
            {/* // Edit Contact */}
            <EditContact
                editContactDrawer={editContactDrawer}
                setEditContactDrawer={setEditContactDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editContactId={editContactId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
                settings={settings}
            />
        </>
    )
}


// Layout
Contacts.layout = 'panelLayout';
export default Contacts

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