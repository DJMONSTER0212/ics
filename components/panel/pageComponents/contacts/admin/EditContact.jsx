import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import { useForm } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Toggle from '@/components/panel/design/Toggle'

const EditContact = ({ editContactDrawer, setEditContactDrawer, editMessage, setEditMessage, reFetch, editContactId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For edit Contact >>>>>>>>>>>>>>>>
    const [contact, setContact] = useState({})
    const { handleSubmit, control, reset, setValue, clearErrors } = useForm()
    // Edit form handler 
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/contacts/admin/${editContactId}`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setEditMessage({ message: responseData.error, type: 'error' })
        } else {
            setEditMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
        }
        setSubmitLoading(false)
    }

    // Fetch edit contact info >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        const response = await fetch(`/api/panel/contacts/admin/${editContactId}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            // Set value to form
            Object.entries(responseData.data).forEach(([name, value]) => setValue(name, value));
            setContact(responseData.data) // Set data to state
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditContactDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditContactDrawer, setEditMessage, setValue, setGlobalMessage, editContactId])
    
    // To fetch user info >>>>>>>>>>>>>>>>
    useEffect(() => {
        if (editContactId) {
            editFetch(editContactId)
        }
    }, [editContactId, editFetch])

    return (
        <Drawer title={'Edit Contact'} drawer={editContactDrawer} setDrawer={setEditContactDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {editMessage.type == 'error' && <Error error={editMessage.message} />}
                    {editMessage.type == 'success' && <Success success={editMessage.message} />}
                    {/* // Info >>>> */}
                    <div className="grid grid-cols-1 gap-3">
                        {contact.name && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Name</p>
                            <p className='text-base text-black-400'>{contact.name}</p>
                        </div>}
                        {contact.email && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Email</p>
                            <p className='text-base text-black-400'>{contact.email}</p>
                        </div>}
                        {contact.phone && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Email</p>
                            <p className='text-base text-black-400'>{contact.phone}</p>
                        </div>}
                        {contact.bookingId && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Booking Id</p>
                            <p className='text-base text-black-400'>{contact.bookingId}</p>
                        </div>}
                        {contact.message && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Message</p>
                            <p className='text-base text-black-400'>{contact.message}</p>
                        </div>}
                    </div>
                    <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {/* Replied */}
                        <Toggle
                            control={control}
                            name='replied'
                            defaultValue={false}
                            label='Mark as replied'
                            className='mb-3'
                        />
                        <Button loading={submitLoading} label='Update status' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default EditContact