import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'
import { useForm } from 'react-hook-form'

const DeleteVilla = ({ deleteMessage, setDeleteMessage, deleteVillaDrawer, setDeleteVillaDrawer, deleteVillaId, reFetch, setGlobalMessage, session }) => {
    // To store villa info after fetching villa >>>>>>>>>>>>>>>>
    const [villa, setVilla] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For delete villa >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    // Delete villa submit handler
    const deleteVillaSubmit = async (data) => {
        setSubmitLoading(true)
        // To delete villa
        const response = await fetch(`/api/panel/villas/admin/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: villa._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteVillaDrawer(false)
        }
        setSubmitLoading(false)
    }
    // Fetch villa info >>>>>>>>>>>>>>>>
    const villaFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteVillaDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/villas/admin/${id}/general`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No villa found', type: 'error' });
            }
            setVilla(responseData.data);
            reset() // Reset form
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteVillaDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteVillaDrawer, setDeleteMessage, setGlobalMessage, reset])
    // To fetch villa info
    useEffect(() => {
        if (deleteVillaId) {
            villaFetch(deleteVillaId)
        }
    }, [deleteVillaId, villaFetch])

    return (
        <Drawer title={`Delete Villa`} drawer={deleteVillaDrawer} setDrawer={setDeleteVillaDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete villa */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you want to delete <span className='font-medium'>{villa.name} </span>?</p>
                    <form onSubmit={handleSubmit(deleteVillaSubmit)} encType='multipart/form-data' className='mt-5'>
                        <div className="flex gap-5 items-center mt-5">
                            <Button type='submit' loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                        </div>
                    </form>
                    <p className='text-green-600 dark:text-green-700 text-sm font-normal mt-2'>Note: You can recover this villa by contacting TNIT.</p>
                </>
            }
        </Drawer>
    )
}

export default DeleteVilla