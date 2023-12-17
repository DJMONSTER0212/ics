import React, { useState, useEffect } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Input from '@/components/panel/design/Input'
import SelectInput from '@/components/panel/design/Select'
import Error from '@/components/panel/design/Error'
import { useForm, Controller, useWatch } from 'react-hook-form'
import Success from '@/components/panel/design/Success'
import { components } from 'react-select'
import Image from 'next/image'
import TitleDevider from '@/components/panel/design/TitleDevider'
import Calendar from './Calendar'
import Guests from './Guests'
import Addons from './Addons'
import Toggle from '@/components/panel/design/Toggle'

const AddVillaBooking = ({ addVillaBookingDrawer, setAddVillaBookingDrawer, addMessage, setAddMessage, settings, reFetch }) => {
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [priceToBePaid,setPriceToBePaid] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    // For select inputs >>>>>>>>>>>>>>>>>
    // Values for price modes
    let priceModes = [
        { value: 'automatic', label: 'Automatic' },
        { value: 'manual', label: 'Manual' },
    ]
    let ranges = [
        { value: 'full', label: 'FULL' },
        { value: 'pre', label: 'PRE' },
        { value: 'post', label: 'POST' },
    ]
    // Values for src
    let sources = [
        { value: 'panel', label: 'Panel' },
        { value: 'other', label: 'Other' },
    ]
    // Values for status
    let statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'cancelled', label: 'Cancelled' },
    ]
    // Values for user
    const loadUsers = async (inputValue) => {
        const response = await fetch(`/api/panel/users/admin/search?users=true&search=${inputValue}&activeAccounts=true`);
        const responseData = await response.json();
        const options = responseData.data.map((user) => ({
            value: user._id,
            label: user.name,
            email: user.email,
            image: user.image
        }));
        return options;
    };
    // Values for villas
    const loadVillas = async (inputValue) => {
        const response = await fetch(`/api/panel/villas/admin/search?searchOption=name&search=${inputValue}`);
        const responseData = await response.json();
        const options = responseData.data.map((villa) => ({
            value: villa._id,
            label: villa.name,
        }));
        return options;
    };
    // For add villa booking >>>>>>>>>>>>>>>>
    const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
    const [guests, setGuests] = useState({});
    const [addons, setAddons] = useState([]);
    const [couponInput, setCouponInput] = useState('')
    const [coupon, setCoupon] = useState('');
    const [directDiscountInput, setDirectDiscountInput] = useState('')
    const [directDiscount, setDirectDiscount] = useState('');
    const [selectedUser, setSelectedUser] = useState();
    const [selectedVilla, setSelectedVilla] = useState();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const priceMode = useWatch({ control, name: 'priceMode' });
    const range = useWatch({control ,name:'range'})
    const basePrice = useWatch({ control, name: 'basePrice' });
    const advancePayed = useWatch({ control, name: 'advancePayed' });
    const discountedPrice = useWatch({ control, name: 'discountedPrice' });
    const extraGuestPrice = useWatch({ control, name: 'extraGuestPrice' });
    const childPrice = useWatch({ control, name: 'childPrice' });
    const src = useWatch({ control, name: 'src' });
    const status = useWatch({ control, name: 'status' });
    // Add form handler >>>>>>>>>>>>>>>>
    const addFormSubmit = async (data) => {
        setSubmitLoading(true)
        // Check check-in and check-out date is not empty
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            setAddMessage({ message: 'Please select stay dates.', type: 'error' });
            setSubmitLoading(false)
            return;
        } else {
            data.checkIn = selectedDates.checkIn;
            data.checkOut = selectedDates.checkOut;
        }
        // Check guests is not empty
        if (!guests) {
            setAddMessage({ message: 'Please select guests.', type: 'error' });
            setSubmitLoading(false)
            return;
        } else {
            data.adults = guests.adults;
            data.childs = guests.childs;
            data.pets = guests.pets;
        }
        // Add addons
        data.addons = JSON.stringify(addons)
        // Add coupon
        data.coupon = coupon
        // Add direct discount
        data.directDiscount = directDiscount
        // Add price mode and prices
        data.priceMode = priceMode
        data.range = range
        data.advancePayed = advancePayed||0
        data.basePrice = basePrice || 0
        data.discountedPrice = discountedPrice || 0
        data.extraGuestPrice = extraGuestPrice || 0
        data.childPrice = childPrice || 0
        data.priceToBePaid = priceToBePaid ||0
        const formData = new FormData()
        for (var key in data) {
            formData.append(key, data[key]);
        }
        const response = await fetch(`/api/panel/villa-bookings/admin/`, {
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
    // To fetch villa addons on villa select >>>>>>>>>>>>>>>>
    const [villaAddons, setVillaAddons] = useState({})
    const fetchAddons = async (villaId) => {
        const response = await fetch(`/api/panel/villas/admin/${villaId}/addons`);
        const responseData = await response.json();
        if (responseData.data) {
            setVillaAddons(responseData.data)  // Set data in addon
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        }
    }
    // To fetch villa on villa select >>>>>>>>>>>>>>>>
    const [villa, setVilla] = useState({})
    const [villaLoading, setVillaLoading] = useState(null)
    useEffect(() => {
        const fetchVilla = async (id) => {
            setVillaLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/general`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data in villa
                setVilla(responseData.data)
                fetchAddons(id)
            } else {
                setAddMessage({ message: responseData.error, type: 'error' })
            }
            setVillaLoading(false)
        }
        if (selectedVilla?.value) {
            fetchVilla(selectedVilla?.value);
        }
    }, [selectedVilla, setAddMessage])
    // To fetch prices >>>>>>>>>>>>>>>>
    const [price, setPrice] = useState({});
    const [priceMessage, setPriceMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [priceLoading, setPriceLoading] = useState(false)
    useEffect(() => {
        const fetchPrices = async (selectedDates, addons, guests, coupon) => {
            setPriceLoading(true)
            setPriceMessage({ message: '', type: '' })
            const data = {
                villaId: selectedVilla?.value,
                userId: selectedUser?.value,
                checkIn: selectedDates.checkIn,
                checkOut: selectedDates.checkOut,
                adults: guests.adults,
                childs: guests.childs,
                pets: guests.pets,
                coupon: coupon,
                directDiscount: directDiscount,
                addons: JSON.stringify(addons),
                priceMode: priceMode,
                basePrice: basePrice || 0,
                discountedPrice: discountedPrice || 0,
                advancePayed : advancePayed||0,
                extraGuestPrice: extraGuestPrice || 0,
                childPrice: childPrice || 0,
                range: range,
                priceToBePaid : priceToBePaid||0
            }
            const formData = new FormData()
            for (var key in data) {
                formData.append(key, data[key]);
            }
            const response = await fetch(`/api/panel/villa-bookings/admin/price`, {
                method: "POST",
                body: formData
            })
            const responseData = await response.json();
            if (responseData.data) {
                setPrice(responseData.data);
                setPriceToBePaid(price.priceToBePaid?.minimum)
                // console.log(price)
                // console.log(priceToBePaid)
            } else {
                setPriceMessage({ message: responseData.error, type: 'error' })
                setPrice({})
            }
            setPriceLoading(false)
        }
        if (selectedDates.checkIn && selectedDates.checkOut && Object.keys(guests).length == 3) {
            fetchPrices(selectedDates, addons, guests, coupon)
        }
    }, [selectedDates, addons, guests, coupon, setPriceMessage, selectedVilla, selectedUser, directDiscount, basePrice, discountedPrice, childPrice, extraGuestPrice, priceMode])


    return (
        <Drawer title={'Add Booking'} drawer={addVillaBookingDrawer} setDrawer={setAddVillaBookingDrawer}>
            <form onSubmit={handleSubmit(addFormSubmit)} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} className='mt-5' encType='multipart/form-data'>
                {addMessage.type == 'error' && <Error error={addMessage.message} />}
                {addMessage.type == 'success' && <Success success={addMessage.message} />}
                <Controller
                    name='villaId'
                    control={control}
                    rules={{ validate: (value) => !value ? 'Villa is required.' : null }}
                    render={({ field }) => {
                        return <SelectInput
                            AsyncSelectOn={true}
                            className="mb-3"
                            cacheOptions
                            // defaultValue={{ value: field.value, label: field.value }}
                            defaultOptions
                            value={selectedVilla}
                            onChange={(e) => { field.onChange(e.value); setSelectedVilla({ value: e.value, label: e.label }) }}
                            loadOptions={loadVillas}
                            label="Select villa"
                            placeholder='Search here...'
                            noOptionsMessage={() => 'Type to see villas..'}
                            isSearchable={true}
                        />
                    }}
                />
                {errors.villaId && <Error error={errors.villaId.message} className='mb-3 py-1 text-base' />}
                {villaLoading == null ?
                    <TitleDevider title='Please select a villa' className='mb-3' /> :
                    villaLoading ?
                        <TitleDevider title='Loading....' className='mb-3' /> :
                        <>
                            <Controller
                                name='priceMode'
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value == null) {
                                            return "Price mode is required"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={priceModes}
                                        className="mb-3"
                                        defaultValue={priceModes.filter((priceMode) => priceMode.value == 'automatic')}
                                        // value={priceModes.filter((priceMode) => priceMode.value == field.value)}
                                        label='Price mode'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {errors.priceMode && <Error error={errors.priceMode.message} className='mb-3 py-1 text-base' />}
                            {priceMode == 'manual' &&
                                <>
                                    <Controller
                                        name='range'
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                if (value == null) {
                                                    return "Range is Required"
                                                }
                                                return true
                                            }
                                        }}
                                        render={({ field }) => {
                                            return <SelectInput
                                                options={ranges}
                                                className="mb-3"
                                                defaultValue={ranges.filter((item) => item.value == 'full')}
                                                // value={priceModes.filter((priceMode) => priceMode.value == field.value)}
                                                label='Range'
                                                isSearchable={false}
                                                onChange={(e) => field.onChange(e.value)}
                                                required={true}
                                            />
                                        }}
                                    />
                                    <Input type='text' name='basePrice' register={register} label='Base price' validationOptions={{ required: 'Base price is required' }} placeholder='Ex: 1999' className='mb-3' />
                                    {errors.basePrice && <Error error={errors.basePrice.message} className='mb-3 py-1 text-base' />}
                                    {range == "pre" && <>
                                        <Input type='number' name='advancePayed' register={register} label='Advance paid' validationOptions={{ required: 'Advance Payment is Required' }} placeholder='Ex: 1999' className='mb-3' />
                                        </>
                                    }
                                    <Input type='number' name='discountedPrice' optional={true} register={register} label='Discounted price' validationOptions={{ validate: (value) => (value && Number(value) >= Number(basePrice)) ? 'Discounted price should not be higher or equal to base price' : true }} placeholder='Ex: 1999' className='mb-3' />
                                    {Number(villa.maxGuest) > Number(villa.minGuest) &&
                                        <Input type='number' name='extraGuestPrice' register={register} label='Extra guest price' placeholder='Ex: 0 or 599' className='mb-3' />
                                    }
                                    {Number(villa.maxChild) > 0 &&
                                        <Input type='number' name='childPrice' register={register} label='Child price' placeholder='Ex: 0 or 299' className='mb-3' />
                                    }

                                </>
                            }
                            <Calendar settings={settings} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
                            {/* Guests */}
                            <Guests
                                setGuests={setGuests}
                                minGuest={villa.minGuest}
                                maxGuest={villa.maxGuest}
                                maxChild={villa.maxChild}
                                petAllowed={villa.petAllowed}
                            />
                            <Controller
                                name='src'
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value == null) {
                                            return "Booking source is required"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={sources}
                                        className="mb-3"
                                        value={sources.filter((source) => source.value == field.value)}
                                        label='Booking source'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {errors.src && <Error error={errors.src.message} className='mb-3 py-1 text-base' />}
                            {src == 'other' &&
                                <>
                                    <Input type='text' name='srcDesc' register={register} label='Enter booking source' validationOptions={{ required: 'A booking source is required' }} placeholder='Ex: Airbnb' className='mb-3' />
                                    {errors.srcDesc && <Error error={errors.srcDesc.message} className='mb-3 py-1 text-base' />}
                                </>
                            }
                            <Controller
                                name='userId'
                                control={control}
                                rules={{ validate: (value) => !value ? 'User is required.' : null }}
                                render={({ field }) => {
                                    return <SelectInput
                                        AsyncSelectOn={true}
                                        className="mb-3"
                                        cacheOptions
                                        // defaultValue={{ value: field.value, label: field.value }}
                                        defaultOptions
                                        value={selectedUser}
                                        onChange={(e) => { field.onChange(e.value); setSelectedUser({ value: e.value, label: e.label, email: e.email }) }}
                                        loadOptions={loadUsers}
                                        label="Select a user"
                                        placeholder='Search here...'
                                        noOptionsMessage={() => 'Type to see users..'}
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
                            <Controller
                                name='status'
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value == null) {
                                            return "Booking status is required"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => {
                                    return <SelectInput
                                        options={statuses}
                                        className="mb-3"
                                        value={statuses.filter((status) => status.value == field.value)}
                                        label='Booking status'
                                        isSearchable={false}
                                        onChange={(e) => field.onChange(e.value)}
                                        required={true}
                                    />
                                }}
                            />
                            {errors.status && <Error error={errors.status.message} className='mb-3 py-1 text-base' />}
                            {/* {status == 'confirmed' &&
                                <Toggle
                                    control={control}
                                    name='sendConfirmation'
                                    defaultValue={false}
                                    label='Send booking confirmation'
                                    className='mb-3'
                                />
                            } */}
                            <TitleDevider title='Main guest info' className='mb-3' />
                            <Input type='text' name='name' register={register} validationOptions={{ required: 'Full name is required' }} label='Full name' placeholder='Ex: John Doe' className='mb-3' />
                            {errors.name && <Error error={errors.name.message} className='mb-3 py-1 text-base' />}
                            <Input type='text' name='email' register={register} label='Email' validationOptions={{ required: 'Email is required' }} placeholder='Ex: john@example.com' className='mb-3' />
                            {errors.email && <Error error={errors.email.message} className='mb-3 py-1 text-base' />}
                            <Input type='number' name='phone' register={register} label={`Phone number`} validationOptions={{ required: 'Phone number is required' }} placeholder='Ex: 0123456789' className='mb-3' />
                            {errors.phone && <Error error={errors.phone.message} className='mb-3 py-1 text-base' />}
                            {selectedUser &&
                                <>
                                    <TitleDevider title='Coupon discount' className='mb-3' />
                                    <div className="flex flex-col mb-3 bg-gradient-to-bl from-primary-500/80 to-secondary-500 border px-3 py-2 rounded-md">
                                        <p className="text-sm font-normal text-white mb-2">Have a coupon code?</p>
                                        <div className="flex gap-1 items-center relative">
                                            <Input value={couponInput} type='text' onChange={(e) => setCouponInput(e.target.value)} placeholder='Enter code here..' className='w-full' inputClassName='bg-white pr-20 xs:pr-18 py-3' />
                                            <p onClick={(e) => setCoupon(couponInput)} className='absolute right-2 h-fit cursor-pointer text-base text-white bg-black-500 px-2 py-1 rounded-md'>{priceLoading ? '·····' : 'Apply'}</p>
                                        </div>
                                        {price.discount?.couponMessage.type == 'success' && <p className='text-sm text-green-600 font-medium bg-green-100 rounded-md px-2 py-1 mt-2'>{price.discount.couponMessage.message}</p>}
                                        {price.discount?.couponMessage.type == 'error' && <p className='text-sm text-red-600 font-medium bg-red-100 rounded-md px-2 py-1 mt-2'>{price.discount.couponMessage.message}</p>}
                                    </div>
                                </>
                            }
                            {villaAddons.length > 0 &&
                                <>
                                    <TitleDevider title='Addons' className='mb-3' />
                                    <Addons settings={settings} villaAddons={villaAddons} setAddons={setAddons} />
                                </>
                            }
                            {priceMessage.type == 'error' && <Error error={priceMessage.message} className='mb-3' />}
                            {Object.keys(price).length > 0 &&
                                <>
                                    <TitleDevider title={`Price details ${priceLoading ? '[Loading...]' : ''}`} className='mb-3' />
                                    <div className="mb-3 rounded-md bg-white dark:bg-black-400/40 border border-gray-300 dark:border-black-400 py-2 px-3">
                                        <div className="grid grid-cols-1 gap-1">
                                            <div className="flex items-start gap-3 justify-between">
                                                <div className="flex flex-col">
                                                    <p className='text-base text-black-500 dark:text-white'>{price.totalNights} Night{Number(price.totalNights) > 1 ? 's' : ''} Price</p>
                                                    <p className='text-sm text-black-300 dark:text-black-200'>For {guests.adults + guests.childs} guest{guests.adults + guests.childs > 1 ? 's' : ''}</p>
                                                </div>
                                                <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {price.perNightPrice} X {price.totalNights}</p>
                                            </div>
                                            {(price.discount.totalPriceDiscount > 0 || price.discount.couponDiscount.couponCode) &&
                                                <>
                                                    <TitleDevider title='Discounts' />
                                                    {price.discount.totalPriceDiscount > 0 && <div className="flex items-center gap-3 justify-between">
                                                        <p className='text-base text-black-500 dark:text-white'>Price discount</p>
                                                        <p className='text-base text-black-400 dark:text-black-200'>- {settings.website.currencySymbol} {price.discount.totalPriceDiscount}</p>
                                                    </div>}
                                                    {price.discount.couponDiscount.couponCode &&
                                                        <div className="flex items-center gap-3 justify-between">
                                                            <div className="flex flex-col">
                                                                <p className='text-base text-black-500 dark:text-white'>Coupon discount</p>
                                                                <p className='text-sm text-black-300 dark:text-black-200'>Code: {price.discount.couponDiscount.couponCode}</p>
                                                            </div>
                                                            <p className='text-base text-black-400 dark:text-black-200'>- {settings.website.currencySymbol} {price.discount.couponDiscount.price}</p>
                                                        </div>
                                                    }
                                                </>
                                            }
                                            {price.taxes.appliedTaxes.length > 0 &&
                                                <>
                                                    <TitleDevider title='Taxes' />
                                                    {price.taxes.appliedTaxes.map((tax, index) => (
                                                        <div key={index} className="flex items-center gap-3 justify-between">
                                                            <p className='text-base text-black-500 dark:text-white'>{tax.name} ({tax.price}%)</p>
                                                            <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {tax.appliedPrice}</p>
                                                        </div>
                                                    ))}
                                                </>
                                            }
                                            {price.addons.appliedAddons.length > 0 &&
                                                <>
                                                    <TitleDevider title='Addons' />
                                                    {price.addons.appliedAddons.map((addon, index) => (
                                                        <div key={index} className="flex items-center gap-3 justify-between">
                                                            <p className='text-base text-black-500 dark:text-white'>{addon.name}</p>
                                                            <p className='text-base text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {addon.price}</p>
                                                        </div>
                                                    ))}
                                                </>
                                            }
                                            {price.directDiscount.directDiscount > 0 &&
                                                <>
                                                    <TitleDevider title='Direct discounts' />
                                                    <div className="flex items-center gap-3 justify-between">
                                                        <p className='text-base text-black-500 dark:text-white'>Direct discount</p>
                                                        <p className='text-base text-black-400 dark:text-black-200'>- {settings.website.currencySymbol} {price.directDiscount.directDiscount}</p>
                                                    </div>
                                                </>
                                            }
                                            <TitleDevider title='Total' />
                                            <div className="flex items-center gap-3 justify-between">
                                                <div className="flex flex-col">
                                                    <p className='text-base font-medium text-black-500 dark:text-white'>Price to be paid</p>
                                                    <p className='text-sm text-black-300 dark:text-black-200'>For {price.totalNights} Night{Number(price.totalNights) > 1 ? 's' : ''} and {guests.adults + guests.childs} guest{guests.adults + guests.childs > 1 ? 's' : ''}</p>
                                                </div>
                                                <p className='text-lg text-black-500 dark:text-white font-bold'>{settings.website.currencySymbol} {price.priceToBePaid.full}</p>
                                            </div>
                                            <div className="flex items-center gap-3 justify-between">
                                                <p className='text-sm text-black-500 dark:text-white'>Min. Price to be paid</p>
                                                <p className='text-sm text-black-400 dark:text-black-200'>{settings.website.currencySymbol} {price.priceToBePaid.minimum}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <TitleDevider title='Direct discount' className='mb-3' />
                                    <div className="flex flex-col mb-3 bg-black-500 from-primary-500/80 to-secondary-500 border px-3 py-2 rounded-md">
                                        <p className="text-sm font-normal text-white mb-2">Want to apply direct discount?</p>
                                        <div className="flex gap-1 items-center relative">
                                            <Input value={directDiscountInput} type='number' onChange={(e) => setDirectDiscountInput(e.target.value)} placeholder='Enter discount price' className='w-full' inputClassName='bg-white pr-20 xs:pr-18 py-3' />
                                            <p onClick={(e) => setDirectDiscount(directDiscountInput)} className='absolute right-2 h-fit cursor-pointer text-base text-white bg-black-500 px-2 py-1 rounded-md'>{priceLoading ? '·····' : 'Apply'}</p>
                                        </div>
                                        {price.directDiscount.directDiscountMessage?.type == 'success' && <p className='text-sm text-green-600 font-medium bg-green-100 rounded-md px-2 py-1 mt-2'>{price.directDiscount.directDiscountMessage?.message}</p>}
                                        {price.directDiscount.directDiscountMessage?.type == 'error' && <p className='text-sm text-red-600 font-medium bg-red-100 rounded-md px-2 py-1 mt-2'>{price.directDiscount.directDiscountMessage?.message}</p>}
                                    </div>
                                </>
                            }
                            <Button disabled={priceMessage.type == 'error' ? true : false} loading={submitLoading} label='Add booking' />
                        </>
                }

            </form>
        </Drawer>
    )
}

export default AddVillaBooking