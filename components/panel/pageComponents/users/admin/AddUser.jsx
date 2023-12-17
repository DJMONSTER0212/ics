import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import ImageUpload from '@/components/panel/design/ImageUpload'
import Toggle from '@/components/panel/design/Toggle'
import TitleDevider from '@/components/panel/design/TitleDevider'

const AddUser = ({ addUserDrawer, setAddUserDrawer, addMessage, setAddMessage, settings, reFetch }) => {
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for roles
    let roles = [
        { value: 'user', label: 'User' },
        { value: 'support_admin', label: 'Support team for admin' },
    ]
    // Only allow some roles if multi vendor model is on
    if (settings.tnit.multiVendorAllowed) {
        roles.push({ value: 'admin', label: 'Admin' });
        roles.push({ value: 'vendor', label: 'Vendor' })
    }
    // For add user >>>>>>>>>>>>>>>>
    const { register: register, handleSubmit: handleSubmit, control: control, reset: reset, formState: { errors: errors } } = useForm()
    const addImageSrc = useWatch({ control: control, name: 'image', defaultValue: '/panel/images/newUser.webp' })
    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        data.image = data.image[0]
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/users/admin/`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setAddMessage({ message: responseData.error, type: 'error' })
        } else {
            setAddMessage({ message: responseData.success, type: 'success' })
            reset() // To reset form
            // To re fetch data on table
            reFetch()
        }
        setSubmitLoading(false)
    }

    return (
        <Drawer title={'Add User'} drawer={addUserDrawer} setDrawer={setAddUserDrawer}>
            <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                {addMessage.type == 'error' && <Error error={addMessage.message} />}
                {addMessage.type == 'success' && <Success success={addMessage.message} />}
                <ImageUpload
                    images={addImageSrc}
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
                <Controller
                    name='role'
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                                return "Role is required"
                            }
                            return true
                        }
                    }}
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
                {errors.role && <Error error={errors.role.message} className='mb-3 py-1 text-base' />}
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
                <Input type='password' name='password' register={register} validationOptions={{ required: 'Password is required' }} label='Password' placeholder='•••••••••' className='mb-3' />
                {errors.password && <Error error={errors.password.message} className='mb-3 py-1 text-base' />}
                <TitleDevider title={'Other information'} className='mb-3' />
                <Input type='number' name='phone' register={register} label='Phone number' optional={true} placeholder='Ex: 9057895623' className='mb-3' />
                <Input type='date' name='dob' register={register} label='Date of birth' optional={true} className='mb-3' />
                <Input type='date' name='anniversary' register={register} label='Date of anniversary' optional={true} className='mb-3' />
                <Button loading={submitLoading} label='Add user' />
            </form>
        </Drawer>
    )
}

export default AddUser