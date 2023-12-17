import React, { useEffect, useState } from 'react'
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import AddAddon from '@/components/panel/pageComponents/villas/admin/editVilla/addons/AddAddon';
import EditAddon from '@/components/panel/pageComponents/villas/admin/editVilla/addons/EditAddon';
import Addons from '@/components/panel/pageComponents/villas/admin/editVilla/addons/Addons';
import DeleteAddon from '@/components/panel/pageComponents/villas/admin/editVilla/addons/DeleteAddon';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})
    const [addons, setAddons] = useState({})

    // For edit addon >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editAddonDrawer, setEditAddonDrawer] = useState(false)
    const [editAddonId, setEditAddonId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditAddonId(id)
        setEditAddonDrawer(true)
    }

    // For add addon >>>>>>>>>>>>>>>>
    const [addAddonDrawer, setAddAddonDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add addon onclick
    const onClickAddAddon = () => {
        setAddMessage('');
        setAddAddonDrawer(!addAddonDrawer)
    }

    // For delete addon >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteAddonDrawer, setDeleteAddonDrawer] = useState(false)
    const [deleteAddonId, setDeleteAddonId] = useState()
    const [deleteAddonName, setDeleteAddonName] = useState()

    // Delete fetch
    const deleteFetch = (id, name) => {
        setDeleteAddonId(id)
        setDeleteAddonName(name)
        setDeleteAddonDrawer(true)
    }

    // To fetch addons >>>>>>>>>>>>>>>>>
    const fetchAddons = async (villaId) => {
        const response = await fetch(`/api/panel/villas/admin/${villaId}/addons`);
        const responseData = await response.json();
        if (responseData.data) {
            setAddons(responseData.data)  // Set data in addon
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        }
    }

    // To Fetch villa addons >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/general`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                await fetchAddons(responseData.data._id) // Fetch addons
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
    return (
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
                        title: 'Addons'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {loading ?
                <div className='animate-pulse'>
                    <div className='flex gap-5 justify-between items-center bg-white dark:bg-black-600 mb-5'>
                        <div className="flex gap-5 items-center overflow-scroll whitespace-nowrap no-scrollbar">
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                        <div className="bg-gray-200 dark:bg-black-400 h-1 w-full rounded-md"></div>
                        <div className="bg-gray-200 dark:bg-black-400 h-10 w-36 rounded-md"></div>
                    </div>
                    <div className='animate-pulse grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 mt-5'>
                        <div className="flex flex-col justify-between w-full bg-gray-50 dark:bg-black-500 rounded-md py-2 px-4">
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 mt-3">
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between w-full bg-gray-50 dark:bg-black-500 rounded-md py-2 px-4">
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 mt-3">
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between w-full bg-gray-50 dark:bg-black-500 rounded-md py-2 px-4">
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 mt-3">
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between w-full bg-gray-50 dark:bg-black-500 rounded-md py-2 px-4">
                            <div className="grid grid-cols-1 gap-1">
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                                <div className="flex gap-2 items-center justify-between">
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                    <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 mt-3">
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div> :
                <>
                    {/* // Action [Page links] */}
                    <PageLinks activePage='addons' settings={settings} villaId={router.query.id} />
                    <div className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md'>
                        {/* // Pricing for sepcific days */}
                        <Addons
                            onClickAddAddon={onClickAddAddon}
                            addons={addons}
                            editFetch={editFetch}
                            deleteFetch={deleteFetch}
                            settings={settings}
                        />
                    </div>
                    {/* // Add addon drawer */}
                    <AddAddon
                        addAddonDrawer={addAddonDrawer}
                        setAddAddonDrawer={setAddAddonDrawer}
                        addMessage={addMessage}
                        setAddMessage={setAddMessage}
                        settings={settings}
                        villa={villa}
                        fetchAddons={fetchAddons}
                    />
                    {/* // Edit addon drawer */}
                    <EditAddon
                        editAddonDrawer={editAddonDrawer}
                        setEditAddonDrawer={setEditAddonDrawer}
                        editMessage={editMessage}
                        setEditMessage={setEditMessage}
                        settings={settings}
                        villa={villa}
                        fetchAddons={fetchAddons}
                        setGlobalMessage={setGlobalMessage}
                        editAddonId={editAddonId}
                    />
                    {/* // Delete addon drawer */}
                    <DeleteAddon
                        deleteAddonDrawer={deleteAddonDrawer}
                        setDeleteAddonDrawer={setDeleteAddonDrawer}
                        deleteMessage={deleteMessage}
                        setDeleteMessage={setDeleteMessage}
                        settings={settings}
                        villa={villa}
                        fetchAddons={fetchAddons}
                        setGlobalMessage={setGlobalMessage}
                        deleteAddonId={deleteAddonId}
                        deleteAddonName={deleteAddonName}
                    />
                </>
            }
        </div>
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