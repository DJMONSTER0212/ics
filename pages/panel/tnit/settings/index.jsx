import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Input from '@/components/panel/design/Input';
import Toggle from '@/components/panel/design/Toggle';
import { useForm, useWatch, Controller } from 'react-hook-form'
import SelectInput from '@/components/panel/design/Select';
import { components } from 'react-select';
import Image from 'next/image';
import TitleDevider from '@/components/panel/design/TitleDevider';
import PageTitle from '@/components/panel/design/PageTitle';
import PageLinks from '@/components/panel/pageComponents/setting/tnit/PageLinks';
import connectDB from '@/conf/database/dbConfig';
import settingsModel from '@/models/settings.model'

const Settings = ({ settings }) => {
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Values for select fields [Admin search]
    const [selectedAdmin, setSelectedAdmin] = useState()
    const loadAdmins = async (inputValue, callback) => {
        const response = await fetch(`/api/panel/users/tnit/search?searchOption=admin&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options;
    };
    // For Vendor Settings >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, formState: { errors } } = useForm({ defaultValues: settings.tnit });
    const limitMaxVillas = useWatch({ control, name: 'limitMaxVillas' });
    const limitMaxHotels = useWatch({ control, name: 'limitMaxHotels' });
    const multiVendorAllowed = useWatch({ control, name: 'multiVendorAllowed' });
    const limitMaxVendors = useWatch({ control, name: 'limitMaxVendors' });
    // For vendor settings submit
    const vendorSettingSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/settings/tnit/vendor`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            if (data.adminId) {
                delete data.adminId; // Removing admin id because properties are transferred
            }
        }
        setSubmitLoading(false)
    }
    return (
        <div className="px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen">
            {/* // Page title */}
            <PageTitle
                breadcrumbs={[
                    {
                        title: 'Settings',
                        url: '/panel/tnit/settings'
                    },
                    {
                        title: 'Vendor settings',
                    }
                ]}
                className='py-5'
            />
            {/* // Action [Page links] */}
            <PageLinks activePage='vendor' settings={settings} />
            <form onSubmit={handleSubmit(vendorSettingSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                {globalMessage.type == 'error' && <Error className='mb-3' error={globalMessage.message} />}
                {globalMessage.type == 'success' && <Success className='mb-3' success={globalMessage.message} />}
                <TitleDevider title='Villas' className='mb-3' />
                <Toggle
                    label="Limit number of villas ?"
                    name="limitMaxVillas"
                    control={control}
                    defaultValue={false}
                    className='mb-3'
                />
                {limitMaxVillas &&
                    <>
                        <Input type='number' name='maxVillas' register={register} validationOptions={{ required: 'Number of max villas is required' }} label='Number of max villas' placeholder='Ex: 20' className='mb-3' />
                        {errors.maxVillas && <Error error={errors.maxVillas.message} className='mb-3 py-1 text-base' />}
                    </>
                }
                <TitleDevider title='Hotels' className='mb-3' />
                <Toggle
                    label="Limit number of hotels ?"
                    name="limitMaxHotels"
                    control={control}
                    defaultValue={false}
                    className='mb-3'
                />
                {limitMaxHotels &&
                    <>
                        <Input type='number' name='maxHotels' register={register} validationOptions={{ required: 'Number of max hotels is required' }} label='Number of max hotels' placeholder='Ex: 20' className='mb-3' />
                        {errors.maxHotels && <Error error={errors.maxHotels.message} className='mb-3 py-1 text-base' />}
                    </>
                }
                <TitleDevider title='Multi vendor' className='mb-3' />
                <Toggle
                    label="Enable multi vendor model"
                    name="multiVendorAllowed"
                    control={control}
                    defaultValue={false}
                    className='mb-3'
                    labelClassName='text-red-500 dark:text-red-400'
                />
                {multiVendorAllowed &&
                    <>
                        <Toggle
                            label="Limit number of vendors ?"
                            name="limitMaxVendors"
                            control={control}
                            defaultValue={false}
                            className='mb-3'
                        />
                        {limitMaxVendors &&
                            <>
                                <Input type='number' name='maxVendors' register={register} validationOptions={{ required: 'Number of max vendors is required' }} label='Number of max vendors' placeholder='Ex: 20' className='mb-3' />
                                {errors.maxVendors && <Error error={errors.maxVendors.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                    </>
                }
                {settings.tnit.multiVendorAllowed && !multiVendorAllowed &&
                    <>
                        <Controller
                            name='adminId'
                            control={control}
                            rules={{ validate: (value) => !value ? 'Admin is required.' : null }}
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
                                    label="Choose an admin to transfer all properties of the vendor"
                                    labelClassName='text-red-500 dark:text-red-400'
                                    placeholder='Search here...'
                                    noOptionsMessage={() => 'Type to see admins..'}
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
                <Button type='submit' loading={submitLoading} variant='primary' label='Update vendor settings' />
            </form>
        </div>
    )
}

// Layout
Settings.layout = 'panelLayout';
export default Settings

// Passing props
export async function getServerSideProps(context) {
    // Connect to DB
    await connectDB();
    // Fetch settings
    const settings = await settingsModel.findOne().lean();
    return {
        props: {
            settings: JSON.parse(JSON.stringify(settings))
        },
    }
}