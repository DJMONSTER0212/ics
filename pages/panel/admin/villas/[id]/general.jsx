import React, { useEffect, useState } from 'react'
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
import Textarea from '@/components/panel/design/Textarea';
import ImageUpload from '@/components/panel/design/ImageUpload';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import dynamic from 'next/dynamic'
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    // Ckeditor
    const CKEditorWrapper = dynamic(() => import("@/components/panel/design/CKEditorWrapper"), { ssr: false });
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for select fields [Location search]
    const loadLocations = async (inputValue, callback) => {
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
    const loadAdmins = async (inputValue, callback) => {
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
    // For edit villa >>>>>>>>>>>>>>>>>
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            images: ['/panel/images/newProperty.webp'],
        }
    })
    const images = useWatch({ control, name: 'images' })
    const minGuest = useWatch({ control, name: 'minGuest' })
    const maxGuest = useWatch({ control, name: 'maxGuest' })
    const maxChild = useWatch({ control, name: 'maxChild' })
    const basePrice = useWatch({ control, name: 'basePrice' })
    const [selectedLocation, setSelectedLocation] = useState()
    const [selectedAdmin, setSelectedAdmin] = useState()
    // For edit submit
    const editSubmit = async (data) => {
        setSubmitLoading(true)
        const formData = new FormData()
        // Adding images to formdata
        data.images.map((image, index) => {
            typeof image != 'string' && formData.append(`file[${index}]`, image)
        })
        // Sending images array
        data.images = JSON.stringify(data.images)
        // Sending property details array
        data.propertyDetails = JSON.stringify(data.propertyDetails)
        // Adding data to formdata
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/general`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            // Set current page title to new title
            setVilla({ ...villa, name: data.name })
            // Update images
            responseData.newImages && setValue('images', responseData.newImages)
            setGlobalMessage({ message: responseData.success, type: 'success' })
        }
        setSubmitLoading(false)
    }
    // To Fetch villa details >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/general`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Set villa values in react hook form format
                if (Object.keys(responseData.data).length > 0) {
                    const villaDetails = { ...responseData.data }
                    // Set selected location in react select format and update selected value in form of id of location
                    setSelectedLocation({ value: villaDetails.location._id, label: villaDetails.location.name, image: villaDetails.location.image })
                    villaDetails.location = villaDetails.location._id;
                    // Set selected admin/vendor in react select format and update selected value in form of id of userId
                    setSelectedAdmin({ value: villaDetails.user._id, label: villaDetails.user.name, email: villaDetails.user.email, image: villaDetails.user.image })
                    villaDetails.userId = villaDetails.user._id;
                    // Set value to form
                    Object.entries(villaDetails).forEach(([name, value]) => setValue(name, value));
                }
            } else {
                setGlobalMessage({ message: responseData.error, type: 'error' })
            }
            setLoading(false)
        }
        if (router.query.id) {
            fetchVilla(router.query.id);
        }
    }, [router.query.id, setValue])
    // Auth >>>>>>>>>>
    if (status === "loading") {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }
    return (
        <div className="px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen">
            {/* Title section */}
            <PageTitle
                loading={loading}
                breadcrumbs={[
                    {
                        title: 'Villas',
                        url: '/panel/admin/villas/'
                    },
                    {
                        title: villa.name,
                        url: `/panel/admin/villas/${router.query.id}/general`
                    },
                    {
                        title: 'General'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {loading ?
                <div className='animate-pulse'>
                    <div className='flex gap-5 justify-between items-center bg-white dark:bg-dimBlack py-5'>
                        <div className="flex gap-5 items-center overflow-scroll whitespace-nowrap no-scrollbar">
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        </div>
                    </div>
                    <div className='w-full mt-5 bg-gray-50 dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        <div className="flex gap-5 items-center mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-1 w-full rounded-md"></div>
                        </div>
                        <div className='mb-5 grid gap-3 grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'>
                            <div className="bg-gray-200 dark:bg-black-400 h-[100px] w-full rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-[100px] w-full rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-[100px] w-full rounded-md"></div>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="flex flex-col gap-3 mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                    </div>
                </div> : Object.keys(villa).length > 0 &&
                <>
                    {/* // Action [Page links] */}
                    <PageLinks activePage='general' villaId={router.query.id} settings={settings} />
                    {/* // Edit form */}
                    <form onSubmit={handleSubmit(editSubmit)} encType='multipart/form-data' className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        {/* // Villa details >>>>>>>>>>>>> */}
                        <TitleDevider title='Villa details' className='mb-3' />
                        {/* Images */}
                        <ImageUpload
                            multiple={true}
                            images={images}
                            maxImage={12}
                            setValue={setValue}
                            errors={errors}
                            setMessage={setGlobalMessage}
                            imageGridClassNames='mb-3 grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
                            imageSize='16:9 Ratio'
                            imageSizeClassName='mb-3'
                            name='images'
                            label='Upload images'
                        />
                        <Input type='text' name='name' register={register} validationOptions={{ required: 'Villa name is required' }} label='Villa name' placeholder='Ex: Royal hills' className='mb-3' />
                        {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                        {/* <Textarea rows={5} name='desc' register={register} label='Description' optional={true} placeholder='' className='mb-3' /> */}
                        <Controller
                            name="desc"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <CKEditorWrapper control={control} className='mb-3' name="desc" label='Description' placeholder='Write here.....' />}
                        />
                        {/* // Location details >>>>>>>>>>>>> */}
                        <TitleDevider title='Location details' className='mb-3' />
                        <Controller
                            name='location'
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
                                    noOptionsMessage={() => 'Type to see locations..'}
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
                        {errors.location && <Error error={errors.location.message} className='mb-3 py-1 text-base' />}
                        <Textarea rows={5} name='address' register={register} label='Address' validationOptions={{ required: 'Address is required' }} placeholder='Ex: Plot No.349, Fashion St, Raja Park, Jaipur, Rajasthan 302012' className='mb-3' />
                        {errors.address && <Error error={errors.address.message} className='mb-3 py-1 text-base' />}
                        <Input type='text' name='googleMapsLink' optional={true} register={register} label='Google maps link' placeholder='Ex: https://maps.google.com....' className='mb-3' />
                        {/* // Guest details >>>>>>>>>>>>> */}
                        <TitleDevider className='mb-3' title='Guest details' />
                        <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
                            <div>
                                <Input type='number' name='minGuest' register={register} label='Number of min. guest' validationOptions={{ required: 'Number of min guest is required' }} placeholder='Ex: 2' className='mb-3' />
                                {errors.minGuest && <Error error={errors.minGuest.message} className='mb-3 py-1 text-base' />}
                            </div>
                            <div>
                                <Input type='number' name='maxGuest' register={register} label='Number of max. guest' validationOptions={{ required: 'Number of max. guest is required', validate: (value) => Number(value) < Number(minGuest) ? 'Max. guest should be greater or equal to min. guest' : true }} placeholder='Ex: 2' className='mb-3' />
                                {errors.maxGuest && <Error error={errors.maxGuest.message} className='mb-3 py-1 text-base' />}
                            </div>
                        </div>
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
                        <div className='grid gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2'>
                            <div>
                                <Input type='number' name='basePrice' register={register} label='Base price' validationOptions={{ required: 'Base price is required' }} placeholder='Ex: 2999' className='mb-3' />
                                {errors.basePrice && <Error error={errors.basePrice.message} className='mb-3 py-1 text-base' />}
                            </div>
                            <div>
                                <Input type='number' name='discountedPrice' optional={true} register={register} label='Discounted price' validationOptions={{ validate: (value) => Number(value) >= Number(basePrice) ? 'Discounted price should not be higher or equal to base price' : true }} placeholder='Ex: 1999' className='mb-3' />
                                {errors.discountedPrice && <Error error={errors.discountedPrice.message} className='mb-3 py-1 text-base' />}
                            </div>
                        </div>
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
                                < Toggle
                                    label="Block property"
                                    name="block"
                                    control={control}
                                    defaultValue={false}
                                    className='mb-0'
                                />
                                <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Blocking the property will make it unlisted from the website.</p>
                            </>
                        }
                        < Toggle
                            label="Allow booking"
                            name="bookingAllowed"
                            control={control}
                            defaultValue={false}
                        />
                        <p className={`mb-3 text-base primary-400 text-black-300 dark:text-white font-normal`}>Allowing booking will list this property for booking on website.</p>
                        {settings.admin.property.letOwnerManageReviews &&
                            < Toggle
                                label="Allow reviews"
                                name="reviewsAllowed"
                                control={control}
                                defaultValue={false}
                                className='mb-3'
                            />
                        }
                        {settings.admin.booking.letOwnerManageMinimumPriceToBook &&
                            <>
                                <Input type='number' name='minimumPriceToBook' register={register} validationOptions={{ required: 'Minimum price for a booking is required.', validate: (value => (Number(value) >= 1 && Number(value) <= 100) ? true : 'Price should be between 1% to 100%') }} label='Minimum price for a booking [In %]' placeholder='Ex: 50' className='mb-3' />
                                {errors.minimumPriceToBook && <Error error={errors.minimumPriceToBook.message} className='mb-3 py-1 text-base' />}
                                <p className={`mt-2 mb-3 text-base text-red-600 dark:text-red-400 font-medium`}>Note: <span className='text-black-500 dark:text-white font-normal'>No need to add % after minimum price amount.</span></p>
                            </>
                        }
                        <Button type='submit' loading={submitLoading} variant='primary' label='Update villa details' />
                    </form>
                </>
            }
        </div>
    )
}

// Layout
Villa.layout = 'panelLayout';
export default Villa

// Passing props to layout
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