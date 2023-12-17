import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import Toggle from '@/components/panel/design/Toggle'
import Textarea from '@/components/panel/design/Textarea'
import { components } from 'react-select'
import Image from 'next/image'
import ImageUpload from '@/components/panel/design/ImageUpload'
import ReactPlayer from 'react-player'

const EditContact = ({ editContactDrawer, setEditContactDrawer, editMessage, setEditMessage, settings, reFetch, session, editContactId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For edit Contact >>>>>>>>>>>>>>>>
    const [contact, setContact] = useState({})
    const { register, handleSubmit, control, reset, setValue, clearErrors, formState: { errors } } = useForm()

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

    // Fetch edit student review info >>>>>>>>>>>>>>>>>
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
    // To fetch user info
    useEffect(() => {
        if (editContactId) {
            editFetch(editContactId)
        }
    }, [editContactId, editFetch])

    return (
        <Drawer title={'Edit Student Review'} drawer={editContactDrawer} setDrawer={setEditContactDrawer}>
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
                        {contact.phone && <div className="grid grid-cols-1 gap-2">
                            <p className='text-base font-medium text-black-500'>Phone Number</p>
                            <div className="bg-gray-200 px-3 py-2 rounded-md">
                                <p className='text-base text-black-400'>{contact.phone}</p>
                                <div className="grid grid-cols-1 gap-1 mt-2">
                                    <p className='text-sm font-medium text-black-500'>Telegram/Whatsapp Number</p>
                                    <p className='text-base text-black-400'>{contact.socialPhone}</p>
                                </div>
                            </div>
                        </div>}
                        {contact.location && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Location</p>
                            <p className='text-base text-black-400'>{contact.location}</p>
                        </div>}
                        {contact.profession && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Profession</p>
                            <div className="bg-gray-200 px-3 py-2 rounded-md grid grid-cols-1 gap-1">
                                {contact.profession.map((profession, index) => (
                                    <p key={index} className='text-base text-black-400'>{profession}</p>
                                ))}
                            </div>
                        </div>}
                        {contact.college && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>College</p>
                            <p className='text-base text-black-400'>{contact.college}</p>
                        </div>}
                        {contact.business && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Business</p>
                            <p className='text-base text-black-400'>{contact.business}</p>
                        </div>}
                        {contact.softwares && contact.softwares.length > 0 && <div className="grid grid-cols-1 gap-1">
                            <p className='text-base font-medium text-black-500'>Softwares</p>
                            <div className="bg-gray-200 px-3 py-2 rounded-md grid grid-cols-1 gap-1">
                                {contact.softwares.map((software, index) => (
                                    <p key={index} className='text-base text-black-400'>{software}</p>
                                ))}
                            </div>
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