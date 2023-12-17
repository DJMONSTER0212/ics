import React, { useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import Loader from '@/components/panel/design/Loader';
import Drawer from '@/components/panel/design/Drawer';
import { useForm, useWatch, Controller } from 'react-hook-form'
import Input from '@/components/panel/design/Input';
import Textarea from '@/components/panel/design/Textarea';
import Toggle from '@/components/panel/design/Toggle';
import ImageUpload from '@/components/panel/design/ImageUpload';
import { components } from 'react-select';
import Image from 'next/image';
import SelectInput from '@/components/website/design/Select';
import TitleDevider from '@/components/panel/design/TitleDevider';

const AddVilla = ({ addMessage, setAddMessage, addVillaDrawer, setAddVillaDrawer, reFetch, settings }) => {
    // For drawer >>>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for select fields [Location search]
    const loadLocations = async (inputValue) => {
        const response = await fetch(`/api/panel/locations/admin/search?searchOption=vendor&search=${inputValue}`);
        const responseData = await response.json();
        const options = responseData.data.map((location) => ({
            value: location._id,
            label: location.name,
            image: location.image
        }));
        return options;
    };
    // Values for select fields [Admin/Vendor search]
    const loadAdmins = async (inputValue) => {
        const response = await fetch(`/api/panel/users/admin/search?adminVendor=true&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options;
    };
    // For add villa >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            images: ['/panel/images/newProperty.webp'],
        }
    })
    const images = useWatch({ control, name: 'images' })
    const maxChild = useWatch({ control, name: 'maxChild' })
    const minGuest = useWatch({ control, name: 'minGuest' })
    const maxGuest = useWatch({ control, name: 'maxGuest' })
    const basePrice = useWatch({ control, name: 'basePrice' })
    const [selectedLocation, setSelectedLocation] = useState()
    const [selectedAdmin, setSelectedAdmin] = useState()
    // Add Form handler
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding images to formdata
        data.images.map((image, index) => {
            typeof image != 'string' && formData.append(`file[${index}]`, image)
        })
        // Sending images array
        data.images = JSON.stringify(data.images)
        // Sending host object
        data.hostInfo = JSON.stringify(data.hostInfo)
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setAddMessage({ message: responseData.error, type: 'error' })
        } else {
            setAddMessage({ message: responseData.success, type: 'success' })
            reset() // To reset form
            setSelectedAdmin() // To reset selected admin
            setSelectedLocation() // To reset location
            reFetch() // To refetch updated data
        }
        setSubmitLoading(false)
    }
    return (
        <Drawer title={'Add Villa'} drawer={addVillaDrawer} setDrawer={setAddVillaDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    <form onSubmit={handleSubmit(addFormSubmit)} className='mt-5' encType='multipart/form-data'>
                        {/* // Property details */}
                        {<div className="flex items-center gap-x-3 w-full mb-7">
                            <div className='bg-primary-500 h-10 w-1 rounded-md'></div>
                            <div>
                                <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center line-clamp-1">Creating villa property</h2>
                                <p className="text-sm font-normal text-gray-600 dark:text-gray-400">Renting complete property</p>
                            </div>
                        </div>}
                        {addMessage.type == 'error' && <Error error={addMessage.message} />}
                        {addMessage.type == 'success' && <Success success={addMessage.message} />}
                        {/* // Villa details >>>>>>>>>>>>> */}
                        <TitleDevider title='Villa details' className='mb-3' />
                        {/* Images */}
                        <ImageUpload
                            multiple={true}
                            images={images}
                            maxImage={7}
                            setValue={setValue}
                            errors={errors}
                            setMessage={setAddMessage}
                            imageGridClassNames='mb-3'
                            imageSize='16:9 Ratio'
                            imageSizeClassName='mb-3'
                            name='images'
                            label='Upload images'
                        />
                        <Input type='text' name='name' register={register} validationOptions={{ required: 'Villa name is required' }} label='Villa name' placeholder='Ex: Royal hills' className='mb-3' />
                        {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                        {/* // Location details >>>>>>>>>>>>> */}
                        <TitleDevider title='Location details' className='mb-3' />
                        <Controller
                            name='locationId'
                            control={control}
                            rules={{ validate: (value) => !value ? 'Location is required.' : null }}
                            render={({ field }) => {
                                return <SelectInput
                                    AsyncSelectOn={true}
                                    className="mb-3"
                                    cacheOptions
                                    // defaultValue={{ value: field.value, label: field.value }}
                                    defaultOptions
                                    value={selectedLocation}
                                    onChange={(e) => { field.onChange(e.value); setSelectedLocation({ value: e.value, label: e.label, email: e.email }) }}
                                    loadOptions={loadLocations}
                                    label="Select location"
                                    placeholder='Search here...'
                                    noOptionsMessage={() => 'Type to search locations..'}
                                    isSearchable={true}
                                    components={{
                                        Option: ({ data, ...props }) => {
                                            return (
                                                <components.Option {...props}>
                                                    <div className="flex items-center gap-x-3">
                                                        <Image className="rounded-md" src={data.image} width='35' height='35' alt="x" />
                                                        <div>
                                                            <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                                                        </div>
                                                    </div>
                                                </components.Option>
                                            );
                                        }
                                    }}
                                />
                            }}
                        />
                        {errors.locationId && <Error error={errors.locationId.message} className='mb-3 py-1 text-base' />}
                        <Textarea rows={5} name='address' register={register} label='Address' validationOptions={{ required: 'Address is required' }} placeholder='Ex: Plot No.349, Fashion St, Raja Park, Jaipur, Rajasthan 302012' className='mb-3' />
                        {errors.address && <Error error={errors.address.message} className='mb-3 py-1 text-base' />}
                        <Input type='text' name='googleMapsLink' optional={true} register={register} label='Google maps link' placeholder='Ex: https://maps.google.com....' className='mb-3' />
                        {/* // Host details >>>>>>>>>>>>> */}
                        <TitleDevider title='Host details' className='mb-3' />
                        <Input type='text' name='hostInfo.name' register={register} validationOptions={{ required: 'Host name is required' }} label='Host name' placeholder='Ex: John doe' className='mb-3' />
                        {errors.hostInfo?.name && <Error error={errors.hostInfo?.name.message} className='mb-3 py-1 text-base' />}
                        <Input type='text' name='hostInfo.phone' register={register} validationOptions={{ required: 'Host phone number is required' }} label='Host phone number' placeholder='Ex: +91-0123456789' className='mb-3' />
                        {errors.hostInfo?.phone && <Error error={errors.hostInfo?.phone.message} className='mb-3 py-1 text-base' />}
                        <Input type='email' name='hostInfo.email' register={register} label='Host email' placeholder='Ex: host@your.com' className='mb-3' />
                        {/* // Guest details >>>>>>>>>>>>> */}
                        <TitleDevider className='mb-3' title='Guest details' />
                        <Input type='number' name='minGuest' register={register} label='Number of min. guest' validationOptions={{ required: 'Number of min guest is required' }} placeholder='Ex: 2' className='mb-3' />
                        {errors.minGuest && <Error error={errors.minGuest.message} className='mb-3 py-1 text-base' />}
                        <Input type='number' name='maxGuest' register={register} label='Number of max. guest' validationOptions={{ required: 'Number of max. guest is required', validate: (value) => Number(value) < Number(minGuest) ? 'Max. guest should be greater or equal to min. guest' : true }} placeholder='Ex: 2' className='mb-3' />
                        {errors.maxGuest && <Error error={errors.maxGuest.message} className='mb-3 py-1 text-base' />}
                        <Input type='number' name='maxChild' register={register} label='Number of max. child' validationOptions={{ required: 'Number of max. child is required', validate: (value) => Number(value) > Number(maxGuest) ? 'Max. child should be lesser or equal to max. guest' : true }} placeholder='Ex: 2' className='mb-3' />
                        {errors.maxChild && <Error error={errors.maxChild.message} className='mb-3 py-1 text-base' />}
                        < Toggle
                            label="Pets allowed"
                            name="petAllowed"
                            control={control}
                            defaultValue={false}
                            className='mb-3'
                        />
                        {/* // Price details */}
                        <TitleDevider className='mb-3' title='Price details' />
                        <Input type='number' name='basePrice' register={register} label='Base price' validationOptions={{ required: 'Base price is required' }} placeholder='Ex: 2999' className='mb-3' />
                        {errors.basePrice && <Error error={errors.basePrice.message} className='mb-3 py-1 text-base' />}
                        <Input type='number' name='discountedPrice' optional={true} register={register} label='Discounted price' validationOptions={{ validate: (value) => Number(value) >= Number(basePrice) ? 'Discounted price should not be higher or equal to base price' : true }} placeholder='Ex: 1999' className='mb-3' />
                        {errors.discountedPrice && <Error error={errors.discountedPrice.message} className='mb-3 py-1 text-base' />}
                        {Number(maxGuest) > Number(minGuest) &&
                            <>
                                <Input type='number' name='extraGuestPrice' register={register} label='Extra guest price' validationOptions={{ required: 'Extra guest price is required' }} placeholder='Ex: 0 or 599' className='mb-3' />
                                {errors.extraGuestPrice && <Error error={errors.extraGuestPrice.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                        {Number(maxChild) > 0 &&
                            <>
                                <Input type='number' name='childPrice' register={register} label='Child price' validationOptions={{ required: 'Child price is required' }} placeholder='Ex: 0 or 299' className='mb-3' />
                                {errors.childPrice && <Error error={errors.childPrice.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                        {/* // Important details */}
                        <TitleDevider className='mb-3' title='Important details' />
                        {settings.tnit.multiVendorAllowed &&
                            <>
                                <Controller
                                    name='userId'
                                    control={control}
                                    rules={{ validate: (value) => !value ? 'Vendor/Admin is required.' : null }}
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
                                            label="Select vendor/admin"
                                            placeholder='Search here...'
                                            noOptionsMessage={() => 'Type to see vendor/admin..'}
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
                                {errors.userId && <Error error={errors.userId.message} className='mb-3 py-1 text-base' />}
                            </>
                        }
                        < Toggle
                            label="Allow booking"
                            name="bookingAllowed"
                            control={control}
                            defaultValue={false}
                            className='mb-3'
                        />
                        {settings.admin.property.letOwnerManageReviews &&
                            < Toggle
                                label="Allow reviews"
                                name="reviewsAllowed"
                                control={control}
                                defaultValue={false}
                                className='mb-3'
                            />
                        }
                        <Button loading={submitLoading} type='submit' label='Add villa' />
                    </form>
                </>
            }
        </Drawer>
    )
}

export default AddVilla