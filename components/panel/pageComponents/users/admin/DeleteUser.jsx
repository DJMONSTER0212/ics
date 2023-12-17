import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'
import { useForm, Controller } from 'react-hook-form'
import SelectInput from '@/components/panel/design/Select';
import { components } from 'react-select';
import Image from 'next/image';

const DeleteUser = ({ deleteMessage, setDeleteMessage, deleteUserDrawer, setDeleteUserDrawer, deleteUserId, reFetch, setGlobalMessage, session }) => {
    // To store user info after fetching user >>>>>>>>>>>>>>>>
    const [user, setUser] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Values for select fields [Admin search] >>>>>>>>>>>>>>>>
    const loadAdmins = async (inputValue, callback) => {
        const response = await fetch(`/api/panel/users/admin/search?adminVendor=true&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options.filter((option) => option.value != user._id);
    };

    // For delete user >>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({ defaultValues: { adminId: '' } });
    const [selectedAdmin, setSelectedAdmin] = useState()

    // Delete user submit handler >>>>>>>>>>>>>>>>
    const deleteUserSubmit = async (data) => {
        setSubmitLoading(true)
        // To prevent self deleteing
        if (user._id == session.user._id) {
            setDrawerLoading(false)
            return setDeleteMessage({ message: `You can't delete yourself`, type: 'error' });
        }
        // To delete user
        const response = await fetch(`/api/panel/users/admin/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: user._id, adminId: data.adminId })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteUserDrawer(false)
        }
        setSubmitLoading(false)
    }

    // Fetch user info >>>>>>>>>>>>>>>>
    const userFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteUserDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/users/admin/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No user found', type: 'error' });
            }
            setUser(responseData.data);
            reset() // Reset form
            setSelectedAdmin() // Clear previous selected admin info [To transfer data]
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteUserDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteUserDrawer, setDeleteMessage, setGlobalMessage, reset])
    // To fetch user info
    useEffect(() => {
        if (deleteUserId) {
            userFetch(deleteUserId)
        }
    }, [deleteUserId, userFetch])

    return (
        <Drawer title={`Delete User`} drawer={deleteUserDrawer} setDrawer={setDeleteUserDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete user */}
                    <p className='text-red-500 dark:text-red-400text-base font-normal mt-5'>Deleting a user will also delete all the data related to this user and it{"'"}s properties like villas, addons, bookings, coupons, etc.</p>
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you still want to delete <span className='font-medium'>{user.name}</span>?</p>
                    <form onSubmit={handleSubmit(deleteUserSubmit)} encType='multipart/form-data' className='mt-5'>
                        {(user.role == 'admin' || user.role == 'vendor') &&
                            <Controller
                                name='adminId'
                                control={control}
                                render={({ field }) => {
                                    return <SelectInput
                                        AsyncSelectOn={true}
                                        className="mb-3"
                                        cacheOptions
                                        // defaultValue={{ value: field.value, label: field.value }}
                                        defaultOptions
                                        value={selectedAdmin}
                                        onChange={(e) => { field.onChange(e.value); setSelectedAdmin({ value: e.value, label: e.label, email: e.email }) }}
                                        loadOptions={loadAdmins}
                                        label="Choose an admin or vendor to transfer data of this user"
                                        placeholder='Search here...'
                                        optional={true}
                                        noOptionsMessage={() => 'No admins or vendors found'}
                                        isSearchable={true}
                                        components={{
                                            Option: ({ data, ...props }) => {
                                                return (
                                                    <components.Option {...props}>
                                                        <div className="flex items-center gap-x-3">
                                                            <Image className="rounded-md" src={data.image} width='45' height='45' alt="x" />
                                                            <div>
                                                                <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                                                                <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{data.email}</p>
                                                            </div>
                                                        </div>
                                                    </components.Option>
                                                );
                                            }
                                        }}
                                    />
                                }}
                            />
                        }
                        <div className="flex gap-5 items-center mt-5">
                            <Button type='submit' loading={submitLoading} label={`${selectedAdmin ? 'Transfer data and delete user' : 'Yes, Delete'}`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                        </div>
                    </form>
                </>
            }
        </Drawer>
    )
}

export default DeleteUser