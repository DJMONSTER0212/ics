import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'
import { useForm } from 'react-hook-form'

const DeleteVillaBooking = ({ deleteMessage, setDeleteMessage, deleteVillaBookingDrawer, setDeleteVillaBookingDrawer, deleteVillaBookingId, reFetch, setGlobalMessage, session }) => {
    // To store Booking info after fetching Booking >>>>>>>>>>>>>>>>
    const [villaBooking, setVillaBooking] = useState({})

    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For delete Booking >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({ defaultValues: { adminId: '' } });

    // Delete Booking submit handler >>>>>>>>>>>>>>>>
    const deleteVillaBookingSubmit = async (data) => {
        setSubmitLoading(true)
        // To delete Booking
        const response = await fetch(`/api/panel/villa-bookings/admin/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: villaBooking._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteVillaBookingDrawer(false)
        }
        setSubmitLoading(false)
    }

    // Fetch Booking info >>>>>>>>>>>>>>>>
    const villaBookingFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteVillaBookingDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/villa-bookings/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No Booking found', type: 'error' });
            }
            setVillaBooking(responseData.data);
            reset() // Reset form
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteVillaBookingDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteVillaBookingDrawer, setDeleteMessage, setGlobalMessage, reset])
    // To fetch Booking info
    useEffect(() => {
        if (deleteVillaBookingId) {
            villaBookingFetch(deleteVillaBookingId)
        }
    }, [deleteVillaBookingId, villaBookingFetch])

    return (
        <Drawer title={`Delete Booking`} drawer={deleteVillaBookingDrawer} setDrawer={setDeleteVillaBookingDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> : villaBooking.mainGuestInfo &&
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete Booking */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you want to delete <span className='font-medium'>{villaBooking.mainGuestInfo.name}{"'"}s booking. </span>?</p>
                    <form onSubmit={handleSubmit(deleteVillaBookingSubmit)} encType='multipart/form-data' className='mt-5'>
                        <div className="flex gap-5 items-center mt-5">
                            <Button type='submit' loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                        </div>
                    </form>
                </>
            }
        </Drawer>
    )
}

export default DeleteVillaBooking