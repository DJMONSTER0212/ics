import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import { components } from 'react-select';
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'
import Toggle from '@/components/panel/design/Toggle'
import TitleDevider from '@/components/panel/design/TitleDevider'
import Image from 'next/image'

const EditUser = ({ editUserDrawer, setEditUserDrawer, editMessage, setEditMessage, settings, reFetch, session, editUserId, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For fubmit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for select fields [Admin search]
    const loadAdmins = async (inputValue) => {
        const response = await fetch(`/api/panel/users/tnit/search?adminVendor=true&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options.filter((option) => option.value != editUserId);
    };
    // Values for roles
    let roles = [
        { value: 'tnit', label: 'TNIT' },
        { value: 'user', label: 'User' },
        { value: 'support_admin', label: 'Support team for admin' },
        { value: 'admin', label: 'Admin' }
    ]
    // Only allow some roles if multi vendor model is on
    if (settings.tnit.multiVendorAllowed) {
        roles.push({ value: 'vendor', label: 'Vendor' })
    }

    // For edit user >>>>>>>>>>>>>>>>>>>
    const { register, handleSubmit, setValue, getValues, control, reset, clearErrors, formState: { errors } } = useForm()
    const editImageSrc = useWatch({ control, name: 'image', defaultValue: '/panel/images/newUser.webp' })
    const newRole = useWatch({ control, name: 'role' })
    // To shift properties to another admin/vendor to if user changing the role of a admin/vendor 
    const [userRole, setUserRole] = useState()
    const [adminId, setAdminId] = useState()
    // Edit form handler
    const editFormSubmit = async (data) => {
        setSubmitLoading(true)
        data.image = data.image[0]
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/users/tnit/${data._id}`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setEditMessage({ message: responseData.error, type: 'error' })
        } else {
            setUserRole(data.role) // To update role of user
            setAdminId('') // To reset adminId (User Id of the user to whom the properties have been transferred) of user
            setEditMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
        }
        setSubmitLoading(false)
    }

    // Fetch edit user info >>>>>>>>>>>>>>>>>
    const editFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setUserRole('') // Empty user role
        const response = await fetch(`/api/panel/users/tnit/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            // Reset form
            reset()
            // Set value to form
            Object.entries(responseData.data).forEach(([name, value]) => setValue(name, value)); // Set value to form
            // Set user role
            setUserRole(responseData.data.role)
            setEditMessage('')  // Clear previous edit Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setEditUserDrawer(false) // Close drawer
        }
        clearErrors() // Clear all previous form errors
        setDrawerLoading(false)
    }, [clearErrors, reset, setEditUserDrawer, setEditMessage, setValue, setGlobalMessage])
    // To fetch user info
    useEffect(() => {
        if (editUserId) {
            editFetch(editUserId)
        }
    }, [editUserId, editFetch])

    return (
        <Drawer title={session && session.user._id != getValues("_id") ? 'Edit User' : 'Edit Your Details'} drawer={editUserDrawer} setDrawer={setEditUserDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <form onSubmit={handleSubmit(editFormSubmit)} className='mt-5' encType='multipart/form-data'>
                    {editMessage.type == 'error' && <Error error={editMessage.message} />}
                    {editMessage.type == 'success' && <Success success={editMessage.message} />}
                    <ImageUpload
                        images={editImageSrc}
                        register={register}
                        name='image'
                        label='Profile picture'
                        className='mb-3'
                        optional={true}
                    />
                    <Input type='text' name='name' register={register} validationOptions={{ required: 'Full name is required' }} label='Full name' placeholder='Ex: John Doe' className='mb-3' />
                    {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                    <Input type='text' name='email' register={register} label='Email' validationOptions={{ required: 'Email is required' }} placeholder='Ex: john@example.com' className='mb-3' />
                    {errors.email && <Error error={errors.email.message} className='mb-3 py-1 text-base' />}
                    {/* // To prevent self role/status/verified change */}
                    {session && session.user._id != getValues("_id") &&
                        <>
                            <Controller
                                name='role'
                                control={control}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={roles}
                                        className="mb-3"
                                        value={roles.filter((el) => el.value == field.value)}
                                        label='Role'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {settings.tnit.multiVendorAllowed && (userRole == 'admin' || userRole == 'vendor') && (newRole != 'admin' && newRole != 'vendor') &&
                                <>
                                    <Controller
                                        name='adminId'
                                        control={control}
                                        rules={{ validate: (value) => !value ? 'Admin/vendor is required to transfer the properties.' : null }}
                                        render={({ field }) => {
                                            return <SelectInput
                                                AsyncSelectOn={true}
                                                className="mb-3"
                                                cacheOptions
                                                // defaultValue={{ value: field.value, label: field.value }}
                                                defaultOptions
                                                value={adminId}
                                                onChange={(e) => { field.onChange(e.value); setAdminId({ value: e.value, label: e.label, email: e.email }) }}
                                                loadOptions={loadAdmins}
                                                label="Choose an admin or vendor to transfer all properties of this user"
                                                labelClassName='text-red-500 dark:text-red-400'
                                                placeholder='Search here...'
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
                                    {errors.adminId && <Error error={errors.adminId.message} className='mb-3 py-1 text-base' />}
                                </>
                            }
                            <Toggle
                                control={control}
                                name='verified'
                                defaultValue={false}
                                label='Verify account'
                                className='mb-3'
                            />
                            <Toggle
                                control={control}
                                name='block'
                                defaultValue={false}
                                label='Block account'
                                className='mb-3'
                            />
                        </>
                    }
                    <Input type='password' name='password' register={register} label='Password' placeholder='•••••••••' className='mb-3' />
                    <TitleDevider title={'Other information'} className='mb-3' />
                    <Input type='number' name='phone' register={register} label='Phone number' optional={true} placeholder='Ex: 9057895623' className='mb-3' />
                    <Input type='date' name='dob' register={register} label='Date of birth' optional={true} className='mb-3' />
                    <Input type='date' name='anniversary' register={register} label='Date of anniversary' optional={true} className='mb-3' />
                    <Button loading={submitLoading} label='Update user details' />
                </form>
            }
        </Drawer>
    )
}

export default EditUser