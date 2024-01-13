import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LineChart from '@/components/panel/design/LineChart';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';
import axios from "axios"
import { useRouter } from 'next/router';

const Index = () => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [chartData, setChartData] = useState([]);
    const [chartLabels, setChartlabels] = useState([]);
    const [todaysGuest, setTodaysGuest] = useState([])
    const [currDate, setCurrDate] = useState(new Date().toDateString())
    const [yesDate, setYesDate] = useState(new Date().toDateString())
    const [newPayments,setNewPayments] = useState(0)
    const [newBookings,setNewBookings] = useState(0)
    const [newContacts,setNewContacts] = useState(0)

    const getData = async () => {
        try {
            const res = await axios.get('/api/dashboard/graph')
            setChartData(res.data.chartData);
            setChartlabels(res.data.chartLabels);

            const temp = await axios.get('/api/dashboard/bookings');
            setTodaysGuest(temp.data);
            // console.log(todaysGuest)

            const activities = await axios.get('/api/dashboard/activities');
            console.log(activities.data)
            setNewBookings(activities.data.newBookings)
            setNewPayments(activities.data.newPayments)
            setNewContacts(activities.data.newContacts);


        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getData();
        const temp = new Date();
        temp.setDate(temp.getDate() - 1);
        setYesDate(temp.toDateString());
        // getTodaysGuest();
    }, [])

    // Auth >>>>>>>>>>
    if (status === "loading" || chartData.length == 0 || chartLabels.length == 0) {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }
    const options = {
        scales: {
            x: {
                display: false, // hide x-axis labels
            },
            y: {
                display: false, // hide y-axis labels
            },
        },
    };


    return (
        <div className="px-4 sm:px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-black-500 h-auto min-h-screen">
            <div className="bg-white dark:bg-black-500">
                {/* // Monthly revenue report */}
                <div className="mt-0">
                    <h2 className={`text-base font-semibold text-black-500 dark:text-white flex gap-2 items-center line-clamp-1`}>Monthly revenue report</h2>
                    <div className="mt-3 bg-orange-100 rounded-md w-full overflow-hidden p-2 h-72 lg:h-80">
                        <LineChart data={chartData} labels={chartLabels} />
                    </div>
                </div>
                {/* // Quick links */}
                <div className="mt-5">
                    <h2 className={`text-base font-semibold text-black-500 dark:text-white flex gap-2 items-center line-clamp-1`}>Quick links</h2>
                    <div className="mt-3 bg-red-100/50 dark:bg-red-100/20 rounded-md w-full overflow-hidden p-2">
                        <div className="grid gap-2 grid-cols-1 max-h-[50vh] overflow-auto">
                            <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2.5  hover:bg-white/80 dark:hover:bg-black-500/40 flex items-center gap-x-2 justify-between rounded-md">
                                <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Villa Bookings </h2>
                                <p onClick={() => router.push("/panel/admin/villa-bookings")} className="text-[14px] text-primary-500 dark:text-primary-600 flex cursor-pointer items-center gap-2">Open <span dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/></svg>' }}></span></p>
                            </div>
                            <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2.5  hover:bg-white/80 dark:hover:bg-black-500/40 flex items-center gap-x-2 justify-between rounded-md">
                                <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Villas</h2>
                                <p onClick={() => router.push("/panel/admin/villas")} className="text-[14px] text-primary-500 dark:text-primary-600 flex items-center cursor-pointer gap-2">Open <span dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/></svg>' }}></span></p>
                            </div>
                            <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2.5  hover:bg-white/80 dark:hover:bg-black-500/40 flex items-center gap-x-2 justify-between rounded-md">
                                <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Payments</h2>
                                <p onClick={() => router.push("/panel/admin/payments")} className="text-[14px] text-primary-500 dark:text-primary-600 flex items-center cursor-pointer gap-2">Open <span dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/></svg>' }}></span></p>
                            </div>
                            <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2.5  hover:bg-white/80 dark:hover:bg-black-500/40 flex items-center gap-x-2 justify-between rounded-md">
                                <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Settings</h2>
                                <p onClick={() => router.push("/panel/admin/settings/website")} className="text-[14px] text-primary-500 dark:text-primary-600 flex items-center gap-2 cursor-pointer" >Open <span dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/></svg>' }}></span></p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* // Recover portal */}
                {/* <div className="mt-5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className={`text-base font-semibold text-black-500 dark:text-white flex gap-2 items-center line-clamp-1`}>Property recover portal</h2>
                        <p className="text-[14px] text-primary-500 dark:text-primary-600 flex items-center gap-2">See all <span dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/></svg>' }}></span></p>
                    </div>
                    <div className="mt-3 grid gap-2 grid-cols-1 max-h-[50vh] overflow-auto bg-indigo-100/50 dark:bg-indigo-100/20 rounded-md w-full p-2">
                        <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2 cursor-pointer hover:bg-white/50 dark:hover:bg-black-500/40 rounded-md">
                            <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row xs:items-center md:items-start gap-x-2 xs:justify-between">
                                <div className="flex gap-2 items-center">
                                    <Image className="aspect-video rounded-sm" src='/panel/images/newProperty.webp' width='75' height='75' alt="x" />
                                    <div className='flex-1'>
                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Redstone villa, Jaipur</h2>
                                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">Deleted by <span className='font-medium text-black-500 dark:text-white'>Mohit Kumawat</span></p>
                                    </div>
                                </div>
                                <Button variant='secondary-icon' label='Recover now' className='w-auto text-sm py-2 gap-1.5 px-2 min-h-[35.2px] bg-indigo-200/20 hover:bg-indigo-200/30' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>'} />
                            </div>
                        </div>
                        <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2 cursor-pointer hover:bg-white/50 dark:hover:bg-black-500/40 rounded-md">
                            <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row xs:items-center md:items-start gap-x-2 xs:justify-between">
                                <div className="flex gap-2 items-center">
                                    <Image className="aspect-video rounded-sm" src='/panel/images/newProperty.webp' width='75' height='75' alt="x" />
                                    <div className='flex-1'>
                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Redstone villa, Jaipur</h2>
                                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">Deleted by <span className='font-medium text-black-500 dark:text-white'>Mohit Kumawat</span></p>
                                    </div>
                                </div>
                                <Button variant='secondary-icon' label='Recover now' className='w-auto text-sm py-2 gap-1.5 px-2 min-h-[35.2px] bg-indigo-200/20 hover:bg-indigo-200/30' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>'} />
                            </div>
                        </div>
                        <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2 cursor-pointer hover:bg-white/50 dark:hover:bg-black-500/40 rounded-md">
                            <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row xs:items-center md:items-start gap-x-2 xs:justify-between">
                                <div className="flex gap-2 items-center">
                                    <Image className="aspect-video rounded-sm" src='/panel/images/newProperty.webp' width='75' height='75' alt="x" />
                                    <div className='flex-1'>
                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Redstone villa, Jaipur</h2>
                                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">Deleted by <span className='font-medium text-black-500 dark:text-white'>Mohit Kumawat</span></p>
                                    </div>
                                </div>
                                <Button variant='secondary-icon' label='Recover now' className='w-auto text-sm py-2 gap-1.5 px-2 min-h-[35.2px] bg-indigo-200/20 hover:bg-indigo-200/30' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>'} />
                            </div>
                        </div>
                        <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2 cursor-pointer hover:bg-white/50 dark:hover:bg-black-500/40 rounded-md">
                            <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row xs:items-center md:items-start gap-x-2 xs:justify-between">
                                <div className="flex gap-2 items-center">
                                    <Image className="aspect-video rounded-sm" src='/panel/images/newProperty.webp' width='75' height='75' alt="x" />
                                    <div className='flex-1'>
                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Redstone villa, Jaipur</h2>
                                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">Deleted by <span className='font-medium text-black-500 dark:text-white'>Mohit Kumawat</span></p>
                                    </div>
                                </div>
                                <Button variant='secondary-icon' label='Recover now' className='w-auto text-sm py-2 gap-1.5 px-2 min-h-[35.2px] bg-indigo-200/20 hover:bg-indigo-200/30' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>'} />
                            </div>
                        </div>
                        <div className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2 cursor-pointer hover:bg-white/50 dark:hover:bg-black-500/40 rounded-md">
                            <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row xs:items-center md:items-start gap-x-2 xs:justify-between">
                                <div className="flex gap-2 items-center">
                                    <Image className="aspect-video rounded-sm" src='/panel/images/newProperty.webp' width='75' height='75' alt="x" />
                                    <div className='flex-1'>
                                        <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">Redstone villa, Jaipur</h2>
                                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">Deleted by <span className='font-medium text-black-500 dark:text-white'>Mohit Kumawat</span></p>
                                    </div>
                                </div>
                                <Button variant='secondary-icon' label='Recover now' className='w-auto text-sm py-2 gap-1.5 px-2 min-h-[35.2px] bg-indigo-200/20 hover:bg-indigo-200/30' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>'} />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="bg-white dark:bg-black-500">
                {/* // Today's guests */}
                <div className="mt-0">
                    <h2 className={`text-base font-semibold text-black-500 dark:text-white flex gap-2 items-center line-clamp-1`}>Today{"'"}s guests</h2>
                    <div className="mt-3 grid gap-2 grid-cols-1 max-h-[65vh] overflow-auto bg-primary-100/50 dark:bg-primary-100/20 rounded-md w-full p-2">
                        {todaysGuest.map((guest) => (
                            <div key={guest._id} className="bg-white/90 dark:bg-black-500/20 py-1.5 px-2 cursor-pointer hover:bg-white/50 dark:hover:bg-black-500/40 rounded-md">
                                <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row xs:items-center md:items-start gap-x-2 xs:justify-between">
                                    <div className="flex gap-2">
                                        <Image className="object-cover w-8 h-8 rounded-full" src='/panel/images/newUser.webp' width='35' height='35' alt="x" />
                                        <div className='flex-1'>
                                            <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{guest?.mainGuestInfo?.name}</h2>
                                            <p className="text-xs font-normal text-gray-600 dark:text-gray-400">Living in <span className='font-medium text-black-500 dark:text-white'>{guest.villaId.name}</span></p>
                                        </div>
                                    </div>``
                                    <div className="mt-0.5 xs:mt-0 flex xs:flex-col items-center xs:items-start justify-between xs:justify-start gap-0.5">
                                        {(currDate == new Date(guest.checkIn).toDateString()) && (
                                            <><p className="text-base font-medium text-yellow-500 dark:text-yellow-600">Check in today</p></>
                                        )}
                                        {(currDate == new Date(guest.checkOut).toDateString()) && (
                                            <>
                                                <p className="text-base font-medium text-red-500 dark:text-red-600">Check out today</p>

                                            </>
                                        )}
                                        {(yesDate == new Date(guest.checkOut).toDateString()) && (
                                            <>
                                                <p className="text-base font-medium text-red-500 dark:text-red-600">Checked out</p>
                                                <p className="text-sm xs:text-xs text-black-500 dark:text-white">On {`${new Date(guest.checkOut).toDateString()}`}</p>
                                            </>
                                        )}
                                        {}
                                    </div>
                                </div>
                                <div className='flex flex-row items-center justify-between gap-0.5 mt-1'>
                                    <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">Stay details</h2>
                                    <p className="text-sm text-black-500 dark:text-black-200">{`${new Date(guest.checkIn).toDateString()}`} To {`${new Date(guest.checkOut).toDateString()}`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* // Cards */}
                <div className="mt-5">
                    <h2 className={`text-base font-semibold text-black-500 dark:text-white flex gap-2 items-center line-clamp-1`}>Today{"'"}s activities</h2>
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
                        <div className="rounded-md bg-yellow-100 dark:bg-yellow-300 p-3 flex flex-col justify-between">
                            <h2 className='text-2xl xs:text-3xl font-bold text-black-500 line-clamp-1'>{newContacts}</h2>
                            <p className='text-base xs:text-lg font-medium text-black-500'>New contacts</p>
                        </div>
                        <div className="rounded-md bg-red-100 dark:bg-red-300 p-3 flex flex-col justify-between">
                            <h2 className='text-3xl font-bold text-black-500 line-clamp-1'>{newPayments}</h2>
                            <p className='text-base xs:text-lg font-medium text-white-500'>New payments</p>
                        </div>
                        <div className="rounded-md bg-green-100 dark:bg-green-300 p-3 flex flex-col justify-between">
                            <h2 className='text-3xl font-bold text-black-500 line-clamp-1'>{newBookings}</h2>
                            <p className='text-base xs:text-lg font-medium text-black-500'>New bookings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Layout
Index.layout = 'panelLayout';
export default Index
