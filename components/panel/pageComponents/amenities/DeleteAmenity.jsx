import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteAmenity = ({ deleteMessage, setDeleteMessage, deleteAmenityDrawer, setDeleteAmenityDrawer, deleteAmenityId, reFetch, setGlobalMessage, session }) => {
    // To store amenity after fetching amenity >>>>>>>>>>>>>>>>
    const [amenity, setAmenity] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Delete amenity submit handler >>>>>>>>>>>>>>>>
    const deleteAmenitySubmit = async () => {
        setSubmitLoading(true)
        // To delete amenity
        const response = await fetch(`/api/panel/amenities/admin/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: amenity._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteAmenityDrawer(false)
        }
        setSubmitLoading(false)
    }
    // Fetch amenity info >>>>>>>>>>>>>>>>
    const amenityFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteAmenityDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/amenities/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No amenity found', type: 'error' });
            }
            setAmenity(responseData.data);
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteAmenityDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteAmenityDrawer, setDeleteMessage, setGlobalMessage])
    // To fetch amenity >>>>>>>>>>>>>>>>
    useEffect(() => {
        if (deleteAmenityId) {
            amenityFetch(deleteAmenityId)
        }
    }, [deleteAmenityId, amenityFetch])

    return (
        <Drawer title={`Delete Amenity`} drawer={deleteAmenityDrawer} setDrawer={setDeleteAmenityDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete amenity */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Deleting amenity will remove this from all the villas and hotels. Do you still want to delete <span className='font-medium'>{amenity.name} </span>?</p>
                    <div className="flex gap-5 items-center mt-5">
                        <Button type='submit' onClick={deleteAmenitySubmit} loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteAmenity