import React, { useState, useRef } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Table from '@/components/panel/design/table/Table';
import Action from '@/components/panel/design/table/Action';
import Unauth from '@/components/panel/design/Unauth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import PageTitle from '@/components/panel/design/PageTitle';
import AddLocation from '@/components/panel/pageComponents/locations/AddLocation';
import EditLocation from '@/components/panel/pageComponents/locations/EditLocation';
import DeleteLocation from '@/components/panel/pageComponents/locations/DeleteLocation';

const Locations = () => {
    const { data: session, status } = useSession() // Next Auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' }) // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Location',
            accessor: 'name',
            Cell: ({ row, value }) => {
                return <div className='flex gap-5 items-center'>
                    <Image className="rounded-md" src={row.original.image} width='45' height='45' alt="x" />
                    <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value}</h2>
                </div>
            },
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
                        onClick: () => { deleteFetch(row.original._id, row.original.name) }
                    },
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
    const [url, setUrl] = useState(`/api/panel/locations/admin?`)

    // For edit location >>>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editLocationDrawer, setEditLocationDrawer] = useState(false)
    const [editLocationId, setEditLocationId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditLocationId(id)
        setEditLocationDrawer(true)
    }

    // For add location >>>>>>>>>>>>>>>>>
    const [addLocationDrawer, setAddLocationDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add location onclick
    const onClickAddLocation = () => {
        setAddMessage('');
        setAddLocationDrawer(!addLocationDrawer)
    }

    // For delete location >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteLocationDrawer, setDeleteLocationDrawer] = useState(false)
    const [deleteLocationId, setDeleteLocationId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteLocationId(id)
        setDeleteLocationDrawer(true)
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
                <PageTitle title={'Locations'} className='py-5' />
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {/* // Properties Table */}
                <Table columns={columns} url={url} ref={ref} placeholder='Search by name...'>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={() => { setAddLocationDrawer(!addLocationDrawer); setAddMessage('') }} className='w-auto text-sm py-2' labelClassName='hidden sm:hidden lg:block' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </Table>
            </div>
            {/* // Edit location Drawer */}
            <EditLocation
                editLocationDrawer={editLocationDrawer}
                setEditLocationDrawer={setEditLocationDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editLocationId={editLocationId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
            />
            {/* // Add location Drawer */}
            <AddLocation
                addLocationDrawer={addLocationDrawer}
                setAddLocationDrawer={setAddLocationDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                reFetch={handleReFetch}
            />
            {/* // Delete location drawer */}
            <DeleteLocation
                deleteLocationDrawer={deleteLocationDrawer}
                setDeleteLocationDrawer={setDeleteLocationDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteLocationId={deleteLocationId}
                session={session}
            />
        </>
    )
}

// Layout
Locations.layout = 'panelLayout';
export default Locations