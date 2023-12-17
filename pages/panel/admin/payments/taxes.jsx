import React, { useState, useRef } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Table from '@/components/panel/design/table/Table';
import Action from '@/components/panel/design/table/Action';
import Unauth from '@/components/panel/design/Unauth';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/panel/design/PageTitle';
import PageLinks from '@/components/panel/pageComponents/payments/admin/taxes/PageLinks';
import AddTax from '@/components/panel/pageComponents/payments/admin/taxes/AddTax';
import EditTax from '@/components/panel/pageComponents/payments/admin/taxes/EditTax';
import DeleteTax from '@/components/panel/pageComponents/payments/admin/taxes/DeleteTax';

const Amenities = () => {
    const { data: session, status } = useSession() // Next Auth
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const [taxType, setTaxType] = useState('all')
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Tax',
            accessor: 'name',
            disableSortBy: true,
        },
        {
            Header: 'Price',
            accessor: 'price',
            disableSortBy: true,
        },
        {
            Header: 'Applied on villas',
            accessor: 'applyOnVillas',
            Cell: ({ value }) => value ? <p className="text-base font-medium w-fit text-green-600 flex gap-2 items-center">Applied <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 bi bi-patch-check-fill" viewBox="0 0 16 16"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" /></svg></p> : <p className="text-base font-medium w-fit text-red-500 dark:text-red-300 flex gap-2 items-center">Not applied</p>,

            disableSortBy: true,
        },
        {
            Header: 'Applied on hotels',
            accessor: 'applyOnHotels',
            Cell: ({ value }) => value ? <p className="text-base font-medium w-fit text-green-600 flex gap-2 items-center">Applied <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 bi bi-patch-check-fill" viewBox="0 0 16 16"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" /></svg></p> : <p className="text-base font-medium w-fit text-red-500 dark:text-red-300 flex gap-2 items-center">Not applied</p>,

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
    const [url, setUrl] = useState(`/api/panel/payments/admin/taxes?taxType=${taxType}&`)
    // To update tax type and fetch url
    const updateTaxType = (taxType) => {
        setUrl(`/api/panel/payments/admin/taxes?taxType=${taxType}&`)
        setTaxType(taxType)
    }

    // For edit tax >>>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editTaxDrawer, setEditTaxDrawer] = useState(false)
    const [editTaxId, setEditTaxId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditTaxId(id)
        setEditTaxDrawer(true)
    }

    // For add tax >>>>>>>>>>>>>>>>>
    const [addTaxDrawer, setAddTaxDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add tax onclick
    const onClickAddTax = () => {
        setAddMessage('');
        setAddTaxDrawer(!addTaxDrawer)
    }

    // For delete tax >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteTaxDrawer, setDeleteTaxDrawer] = useState(false)
    const [deleteTaxId, setDeleteTaxId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteTaxId(id)
        setDeleteTaxDrawer(true)
    }

    // Auth >>>>>>>>>>>>>>>>>
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
                {/* Title section */}
                <PageTitle
                    title='Taxes'
                    className='py-5'
                />
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {/* // Action */}
                <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-dimBlack mb-5'>
                    <PageLinks
                        taxType={taxType}
                        updateTaxType={updateTaxType}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={() => { setAddTaxDrawer(!addTaxDrawer); setAddMessage('') }} className='w-auto text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </div>
                {/* // Properties Table */}
                <Table columns={columns} url={url} ref={ref} placeholder='Search by name...' />
            </div>
            {/* // Edit tax Drawer */}
            <EditTax
                editTaxDrawer={editTaxDrawer}
                setEditTaxDrawer={setEditTaxDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editTaxId={editTaxId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
            />
            {/* // Add tax Drawer */}
            <AddTax
                addTaxDrawer={addTaxDrawer}
                setAddTaxDrawer={setAddTaxDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                reFetch={handleReFetch}
            />
            {/* // Delete tax drawer */}
            <DeleteTax
                deleteTaxDrawer={deleteTaxDrawer}
                setDeleteTaxDrawer={setDeleteTaxDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteTaxId={deleteTaxId}
                session={session}
            />
        </>
    )
}

// Layout
Amenities.layout = 'panelLayout';
export default Amenities

export async function getStaticProps(context) {
    return {
        props: {
            title: 'Amenities'
        },
    }
}
