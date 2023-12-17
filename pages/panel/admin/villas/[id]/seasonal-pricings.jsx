import React, { useEffect, useState } from 'react'
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import AddSeasonalPricing from '@/components/panel/pageComponents/villas/admin/editVilla/AddSeasonalPricing';
import EditSeasonalPricing from '@/components/panel/pageComponents/villas/admin/editVilla/EditSeasonalPricing';
import DaySeasonalPricings from '@/components/panel/pageComponents/villas/admin/editVilla/DaySeasonalPricings';
import DateSeasonalPricings from '@/components/panel/pageComponents/villas/admin/editVilla/DateSeasonalPricings';
import DeleteSeasonalPricing from '@/components/panel/pageComponents/villas/admin/editVilla/DeleteSeasonalPricing';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})
    const [seasonalPricings, setSeasonalPricings] = useState({})

    // For edit seasonal pricing >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editSeasonalPricingDrawer, setEditSeasonalPricingDrawer] = useState(false)
    const [editSeasonalPricingId, setEditSeasonalPricingId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditSeasonalPricingId(id)
        setEditSeasonalPricingDrawer(true)
    }

    // For add seasonal pricing >>>>>>>>>>>>>>>>
    const [addSeasonalPricingDrawer, setAddSeasonalPricingDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add seasonal pricing onclick
    const onClickAddSeasonalPricing = () => {
        setAddMessage('');
        setAddSeasonalPricingDrawer(!addSeasonalPricingDrawer)
    }

    // For delete seasonal pricing >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteSeasonalPricingDrawer, setDeleteSeasonalPricingDrawer] = useState(false)
    const [deleteSeasonalPricingId, setDeleteSeasonalPricingId] = useState()
    const [deleteSeasonalPricingName, setDeleteSeasonalPricingName] = useState()

    // Delete fetch
    const deleteFetch = (id, name) => {
        setDeleteSeasonalPricingId(id)
        setDeleteSeasonalPricingName(name)
        setDeleteSeasonalPricingDrawer(true)
    }

    // To fetch seasonal pricings >>>>>>>>>>>>>>>>>
    const fetchSeasonalPricings = async (villaId) => {
        const response = await fetch(`/api/panel/villas/admin/${villaId}/seasonal-pricings`);
        const responseData = await response.json();
        if (responseData.data) {
            setSeasonalPricings(responseData.data)  // Set data in seasonal pricing
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        }
    }

    // To Fetch villa seasonal pricings >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/general`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                await fetchSeasonalPricings(responseData.data._id) // Fetch seasonal pricings
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
                        title: 'Seasonal pricings'
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
                    <PageLinks activePage='seasonalPricings' settings={settings} villaId={router.query.id} />
                    <div className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md'>
                        {/* // Pricing for sepcific days */}
                        <DaySeasonalPricings
                            onClickAddSeasonalPricing={onClickAddSeasonalPricing}
                            seasonalPricings={seasonalPricings}
                            editFetch={editFetch}
                            deleteFetch={deleteFetch}
                            settings={settings}
                        />
                        {/* // Pricing for dates */}
                        <DateSeasonalPricings
                            onClickAddSeasonalPricing={onClickAddSeasonalPricing}
                            seasonalPricings={seasonalPricings}
                            editFetch={editFetch}
                            deleteFetch={deleteFetch}
                            settings={settings}
                        />
                    </div>
                    {/* // Add seasonal pricing drawer */}
                    <AddSeasonalPricing
                        addSeasonalPricingDrawer={addSeasonalPricingDrawer}
                        setAddSeasonalPricingDrawer={setAddSeasonalPricingDrawer}
                        addMessage={addMessage}
                        setAddMessage={setAddMessage}
                        settings={settings}
                        villa={villa}
                        fetchSeasonalPricings={fetchSeasonalPricings}
                    />
                    {/* // Edit seasonal pricing drawer */}
                    <EditSeasonalPricing
                        editSeasonalPricingDrawer={editSeasonalPricingDrawer}
                        setEditSeasonalPricingDrawer={setEditSeasonalPricingDrawer}
                        editMessage={editMessage}
                        setEditMessage={setEditMessage}
                        settings={settings}
                        villa={villa}
                        fetchSeasonalPricings={fetchSeasonalPricings}
                        setGlobalMessage={setGlobalMessage}
                        editSeasonalPricingId={editSeasonalPricingId}
                    />
                    {/* // Delete seasonal pricing drawer */}
                    <DeleteSeasonalPricing
                        deleteSeasonalPricingDrawer={deleteSeasonalPricingDrawer}
                        setDeleteSeasonalPricingDrawer={setDeleteSeasonalPricingDrawer}
                        deleteMessage={deleteMessage}
                        setDeleteMessage={setDeleteMessage}
                        settings={settings}
                        villa={villa}
                        fetchSeasonalPricings={fetchSeasonalPricings}
                        setGlobalMessage={setGlobalMessage}
                        deleteSeasonalPricingId={deleteSeasonalPricingId}
                        deleteSeasonalPricingName={deleteSeasonalPricingName}
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