import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'
import { useForm } from 'react-hook-form'

const DeleteMember = ({ deleteMessage, setDeleteMessage, deleteContactDrawer, setDeleteContactDrawer, deleteContactId, reFetch, setGlobalMessage, session }) => {
    // To store team member info after fetching team member >>>>>>>>>>>>>>>>
    const [contact, setContact] = useState({})

    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // For delete team member >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({ defaultValues: { adminId: '' } });

    // Delete team member submit handler >>>>>>>>>>>>>>>>
    const deleteContactSubmit = async (data) => {
        setSubmitLoading(true)
        // To delete team member
        const response = await fetch(`/api/panel/contacts/admin/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: contact._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteContactDrawer(false)
        }
        setSubmitLoading(false)
    }

    // Fetch team member info >>>>>>>>>>>>>>>>
    const contactFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteContactDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/contacts/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No team member found', type: 'error' });
            }
            setContact(responseData.data);
            reset() // Reset form
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteContactDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteContactDrawer, setDeleteMessage, setGlobalMessage, reset])
    // To fetch team member info
    useEffect(() => {
        if (deleteContactId) {
            contactFetch(deleteContactId)
        }
    }, [deleteContactId, contactFetch])

    return (
        <Drawer title={`Delete team member`} drawer={deleteContactDrawer} setDrawer={setDeleteContactDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete team member */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you want to delete <span className='font-medium'>{contact.name}</span>?</p>
                    <form onSubmit={handleSubmit(deleteContactSubmit)} encType='multipart/form-data' className='mt-5'>
                        <div className="flex gap-5 items-center mt-5">
                            <Button type='submit' loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                        </div>
                    </form>
                </>
            }
        </Drawer>
    )
}

export default DeleteMember