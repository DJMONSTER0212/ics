import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteContact = ({ deleteMessage, setDeleteMessage, deleteContactDrawer, setDeleteContactDrawer, deleteContactId, reFetch, setGlobalMessage, session }) => {
    // To store contact after fetching contact >>>>>>>>>>>>>>>>
    const [contact, setContact] = useState({})

    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // Delete contact submit handler >>>>>>>>>>>>>>>>
    const deleteContactSubmit = async () => {
        setSubmitLoading(true)
        // To delete team contact
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

    // Fetch contact >>>>>>>>>>>>>>>>
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
                return setGlobalMessage({ message: 'No team contact found', type: 'error' });
            }
            setContact(responseData.data);
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteContactDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteContactDrawer, setDeleteMessage, setGlobalMessage])
    // To fetch contact
    useEffect(() => {
        if (deleteContactId) {
            contactFetch(deleteContactId)
        }
    }, [deleteContactId, contactFetch])

    return (
        <Drawer title={`Delete Contact`} drawer={deleteContactDrawer} setDrawer={setDeleteContactDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete contact */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you want to delete <span className='font-medium'>{contact.name}</span>{"'"}s query?</p>
                    <div className="flex gap-5 items-center mt-5">
                        <Button onClick={deleteContactSubmit} type='submit' loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteContact