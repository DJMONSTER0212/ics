import React, { useState, useRef } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Table from '@/components/panel/design/table/Table';
import Action from '@/components/panel/design/table/Action';
import Unauth from '@/components/panel/design/Unauth';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/panel/design/PageTitle';
import AddAmenity from '@/components/panel/pageComponents/amenities/AddAmenity';
import Image from 'next/image';
import EditAmenity from '@/components/panel/pageComponents/amenities/EditAmenity';
import DeleteAmenity from '@/components/panel/pageComponents/amenities/DeleteAmenity';

const Amenities = () => {
    const { data: session, status } = useSession() // Next Auth
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Amenity',
            accessor: 'name',
            Cell: ({ row, value }) => {
                return <div className='flex gap-5 items-center'>
                    <Image src={row.original.image} alt={value} width={25} height={25} />
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
    const [url, setUrl] = useState(`/api/panel/amenities/admin?`)

    // For edit amenity >>>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editAmenityDrawer, setEditAmenityDrawer] = useState(false)
    const [editAmenityId, setEditAmenityId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditAmenityId(id)
        setEditAmenityDrawer(true)
    }

    // For add amenity >>>>>>>>>>>>>>>>>
    const [addAmenityDrawer, setAddAmenityDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add amenity onclick
    const onClickAddAmenity = () => {
        setAddMessage('');
        setAddAmenityDrawer(!addAmenityDrawer)
    }

    // For delete amenity >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteAmenityDrawer, setDeleteAmenityDrawer] = useState(false)
    const [deleteAmenityId, setDeleteAmenityId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteAmenityId(id)
        setDeleteAmenityDrawer(true)
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
                {/* // Page title */}
                <PageTitle title={'Amenities'} className='py-5' />
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {/* // Properties Table */}
                <Table columns={columns} url={url} ref={ref} placeholder='Search by name...'>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={onClickAddAmenity} className='w-auto text-sm py-2' labelClassName='hidden sm:hidden lg:block' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </Table>
            </div>
            {/* // Edit amenity Drawer */}
            <EditAmenity
                editAmenityDrawer={editAmenityDrawer}
                setEditAmenityDrawer={setEditAmenityDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editAmenityId={editAmenityId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
            />
            {/* // Add amenity Drawer */}
            <AddAmenity
                addAmenityDrawer={addAmenityDrawer}
                setAddAmenityDrawer={setAddAmenityDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                reFetch={handleReFetch}
            />
            {/* // Delete amenity drawer */}
            <DeleteAmenity
                deleteAmenityDrawer={deleteAmenityDrawer}
                setDeleteAmenityDrawer={setDeleteAmenityDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteAmenityId={deleteAmenityId}
                session={session}
            />
        </>
    )
}

// Layout
Amenities.layout = 'panelLayout';
export default Amenities