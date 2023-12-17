import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteLocation = ({ deleteMessage, setDeleteMessage, deleteLocationDrawer, setDeleteLocationDrawer, deleteLocationId, reFetch, setGlobalMessage, session }) => {
    // To store location after fetching location >>>>>>>>>>>>>>>>
    const [location, setLocation] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Delete location submit handler >>>>>>>>>>>>>>>>
    const deleteLocationSubmit = async () => {
        setSubmitLoading(true)
        // To delete location
        const response = await fetch(`/api/panel/locations/admin/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: location._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteLocationDrawer(false)
        }
        setSubmitLoading(false)
    }
    // Fetch location info >>>>>>>>>>>>>>>>
    const locationFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteLocationDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/locations/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No location found', type: 'error' });
            }
            setLocation(responseData.data);
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteLocationDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteLocationDrawer, setDeleteMessage, setGlobalMessage])
    // To fetch location >>>>>>>>>>>>>>>>
    useEffect(() => {
        if (deleteLocationId) {
            locationFetch(deleteLocationId)
        }
    }, [deleteLocationId, locationFetch])

    return (
        <Drawer title={`Delete Location`} drawer={deleteLocationDrawer} setDrawer={setDeleteLocationDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete location */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Deleting a location will permanently delete all the properties for this location in trash. Do still you want to delete <span className='font-medium'>{location.name} </span>?</p>
                    <div className="flex gap-5 items-center mt-5">
                        <Button type='submit' onClick={deleteLocationSubmit} loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteLocation