import React, { useState, useRef } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Table from '@/components/panel/design/table/Table';
import Action from '@/components/panel/design/table/Action';
import Unauth from '@/components/panel/design/Unauth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import PageTitle from '@/components/panel/design/PageTitle';
import DeleteBanner from '@/components/panel/pageComponents/promotions/admin/homepage-banners/DeleteBanner';
import AddBanner from '@/components/panel/pageComponents/promotions/admin/homepage-banners/AddBanner';
import EditBanner from '@/components/panel/pageComponents/promotions/admin/homepage-banners/EditBanner';

const Banners = () => {
    const { data: session, status } = useSession() // Next Auth
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' }) // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Banner',
            accessor: 'title',
            Cell: ({ row, value }) => {
                return <div className='flex gap-5 items-center'>
                    <Image className="rounded-md" src={row.original.image} width='100' height='40' alt="x" />
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
                        onClick: () => { deleteFetch(row.original._id, row.original.title) }
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
    const [url, setUrl] = useState(`/api/panel/promotions/admin/homepage-banners?`)

    // For edit banner >>>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editBannerDrawer, setEditBannerDrawer] = useState(false)
    const [editBannerId, setEditBannerId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditBannerId(id)
        setEditBannerDrawer(true)
    }

    // For add banner >>>>>>>>>>>>>>>>>
    const [addBannerDrawer, setAddBannerDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add banner onclick
    const onClickAddBanner = () => {
        setAddMessage('');
        setAddBannerDrawer(!addBannerDrawer)
    }

    // For delete banner >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteBannerDrawer, setDeleteBannerDrawer] = useState(false)
    const [deleteBannerId, setDeleteBannerId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteBannerId(id)
        setDeleteBannerDrawer(true)
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
                {/* Title section */}
                <PageTitle
                    breadcrumbs={[
                        {
                            title: 'Promotions',
                            url: '/panel/admin/promotions/homepage-banners'
                        },
                        {
                            title: 'Homepage banners',
                        }
                    ]}
                    className='py-5'
                />
                {/* // Messages */}
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
                {/* // Properties Table */}
                <Table columns={columns} url={url} ref={ref} placeholder='Search by title...'>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={() => { setAddBannerDrawer(!addBannerDrawer); setAddMessage('') }} className='w-auto text-sm py-2' labelClassName='hidden sm:hidden lg:block' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </Table>
            </div>
            {/* // Edit banner Drawer */}
            <EditBanner
                editBannerDrawer={editBannerDrawer}
                setEditBannerDrawer={setEditBannerDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editBannerId={editBannerId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
            />
            {/* // Add banner Drawer */}
            <AddBanner
                addBannerDrawer={addBannerDrawer}
                setAddBannerDrawer={setAddBannerDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                reFetch={handleReFetch}
            />
            {/* // Delete banner drawer */}
            <DeleteBanner
                deleteBannerDrawer={deleteBannerDrawer}
                setDeleteBannerDrawer={setDeleteBannerDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteBannerId={deleteBannerId}
                session={session}
            />
        </>
    )
}

// Layout
Banners.layout = 'panelLayout';
export default Banners