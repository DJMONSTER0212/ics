import React, { useState, useRef } from 'react'
import Table from '@/components/panel/design/table/Table'
import Button from '@/components/panel/design/Button'
import Action from '@/components/panel/design/table/Action'
import Error from '@/components/panel/design/Error'
import { useSession } from 'next-auth/react'
import Success from '@/components/panel/design/Success'
import { useRouter } from 'next/router';
import Unauth from '@/components/panel/design/Unauth'
import AddCoupon from '@/components/panel/pageComponents/promotions/admin/coupons/AddCoupon'
import EditCoupon from '@/components/panel/pageComponents/promotions/admin/coupons/EditCoupon'
import DeleteCoupon from '@/components/panel/pageComponents/promotions/admin/coupons/DeleteCoupon'
import PageTitle from '@/components/panel/design/PageTitle'
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import PageLinks from '@/components/panel/pageComponents/promotions/admin/coupons/Pagelinks'

const Coupons = ({ settings }) => {
    const router = useRouter();
    const { data: session, status } = useSession(); // Next auth
    const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
    const ref = useRef() // To get child component function (From table component reFetch)

    // For table >>>>>>>>>>>>>>>>
    const [columns, setColumns] = useState([
        {
            Header: 'Coupon',
            accessor: 'couponCode',
        },
        {
            Header: 'Valid for',
            accessor: 'type',
            Cell: ({ value }) => value == 'regular' ? <p className="test-base text-black-500">Everyone</p> : <p className="test-base text-black-500">A user</p>,
            disableSortBy: true,
        },
        {
            Header: 'Valid on',
            accessor: 'validOn',
            Cell: ({ value }) => value == 'all' ? <p className="test-base text-black-500">All properties</p> : value == 'villa' ? <p className="test-base text-black-500">A villa</p> : <p className="test-base text-black-500">A hotel</p>,
            disableSortBy: true,
        },
        {
            Header: 'Discount',
            accessor: 'priceType',
            Cell: ({ value, row }) => <p className="text-sm text-black-500">{value == 'upto' ? row.original.price + '% upto ' + row.original.maxPrice + ' ' + settings.admin.gateway.currencyCode : 'Flat ' + row.original.price + (row.original.priceIn == 'percentage' ? '%' : ' ' + settings.admin.gateway.currencyCode)}</p>,
            disableSortBy: true,
        },
        {
            Header: 'Max uses',
            accessor: 'maxUses',
            disableSortBy: true,
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => !value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Not active</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">Active</p>,
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
    const [url, setUrl] = useState('/api/panel/promotions/admin/coupons?')
    // Search options
    const searchOptions = [
        {
            name: 'Code',
            value: 'couponeCode',
            placeholder: 'Enter coupon code...'
        }
    ]
    // To refetch the table
    const handleReFetch = () => {
        if (ref.current) {
            ref.current.reFetch();
        }
    };

    // For current action type [all, blocked, etc] >>>>>>>>>>>>>>>>
    const [couponType, setCouponType] = useState('all')
    const updateCouponType = (couponType) => {
        //  To change coupon fetch url for table
        setUrl(`/api/panel/promotions/admin/coupons?couponType=${couponType}&`)
        setCouponType(couponType)
        setGlobalMessage('') // Clear any global Error/Success message
    }

    // For add coupon >>>>>>>>>>>>>>>>
    const [addCouponDrawer, setAddCouponDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add coupon onclick
    const onClickAddCoupon = () => {
        setAddMessage('');
        setAddCouponDrawer(!addCouponDrawer)
    }

    // For edit coupon >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editCouponDrawer, setEditCouponDrawer] = useState(false)
    const [editCouponId, setEditCouponId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditCouponId(id)
        setEditCouponDrawer(true)
    }

    // For delete coupon >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteCouponDrawer, setDeleteCouponDrawer] = useState(false)
    const [deleteCouponId, setDeleteCouponId] = useState()
    // Delete fetch
    const deleteFetch = (id) => {
        setDeleteCouponId(id)
        setDeleteCouponDrawer(true)
    }

    // Auth >>>>>>>>
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
                            title: 'Coupons',
                        }
                    ]}
                    className='py-5'
                />
                {/* // Action */}
                <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
                    <PageLinks
                        activePage={couponType}
                        settings={settings}
                        updateCouponType={updateCouponType}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant='primary-icon' onClick={onClickAddCoupon} className='w-auto text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
                        {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
                    </div>
                </div>
                {/* // Messages */}
                {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
                {/* // Coupons Table */}
                <Table columns={columns} url={url} ref={ref} searchOptions={searchOptions} query={router.query} key={router.asPath}></Table>
            </div>
            {/* // Add Coupon Drawer */}
            <AddCoupon
                addCouponDrawer={addCouponDrawer}
                setAddCouponDrawer={setAddCouponDrawer}
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                settings={settings}
                reFetch={handleReFetch}
            />
            {/* // Edit Coupon */}
            <EditCoupon
                editCouponDrawer={editCouponDrawer}
                setEditCouponDrawer={setEditCouponDrawer}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editCouponId={editCouponId}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                session={session}
                settings={settings}
            />
            {/* // Delete Coupon */}
            <DeleteCoupon
                deleteCouponDrawer={deleteCouponDrawer}
                setDeleteCouponDrawer={setDeleteCouponDrawer}
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                setGlobalMessage={setGlobalMessage}
                reFetch={handleReFetch}
                deleteFetch={deleteFetch}
                deleteCouponId={deleteCouponId}
                session={session}
            />
        </>
    )
}


// Layout
Coupons.layout = 'panelLayout';
export default Coupons

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