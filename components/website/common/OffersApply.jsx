import React, { useState, useRef, useEffect } from 'react'
import Input from '../design/Input'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'

const OffersApply = ({ className, villaId, setCoupon, price, priceLoading, query }) => {
    const [couponInput, setCouponInput] = useState(query.coupon && query.coupon || '')
    const [openOfferDownbar, setOpenOfferDownbar] = useState(false)
    const [loading, setLoading] = useState(true)
    // To fetch offers >>>>>>>>>>>>>>>>>>
    const [offers, setOffers] = useState([])
    useEffect(() => {
        const fetchVilla = async () => {
            setLoading(true)
            const response = await fetch(`/api/website/coupons?villaId=${villaId}`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setOffers(responseData.data)
            }
            setLoading(false)
        }
        fetchVilla()
    }, [setLoading, villaId])
    // To close offers downbar >>>>>>>>>>>>>>>>>>
    const downbarRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (downbarRef.current && !downbarRef.current.contains(event.target)) {
                setOpenOfferDownbar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Apply coupon >>>>>>>>>>>>>>>>>>
    const applyCoupon = (coupon) => {
        // Set coupon to input
        setCouponInput(coupon)
        // Set coupon to prop
        setCoupon(coupon)
        // Close offers downbar
        setOpenOfferDownbar(false)
    }
    return (
        <>
            {/* // Form area */}
            {priceLoading ?
                <div className={"animate-pulse flex flex-col mt-5 bg-gradient-to-bl from-primary-500/80 to-secondary-500 border px-3 py-2 rounded-md"}>
                    <div className="flex gap-5 items-center justify-between mb-2">
                        <div className="bg-gray-100 w-[50%] h-2 rounded-md"></div>
                        <div className="bg-gray-100 w-[30%] h-3 rounded-md"></div>
                    </div>
                    <div className="flex gap-1 items-center relative">
                        <div className="bg-gray-100 w-[100%] h-12 rounded-md"></div>
                        <div className="bg-gray-300 w-16 h-8 rounded-md absolute right-2"></div>
                    </div>
                </div>
                : <div className={twMerge("flex flex-col mt-5 bg-gradient-to-bl from-primary-500/80 to-secondary-500 border px-3 py-2 rounded-md", className)}>
                    <div className="flex gap-5 items-center justify-between mb-2">
                        <p className="text-sm font-normal text-white">Have a coupon code?</p>
                        <p onClick={() => setOpenOfferDownbar(!openOfferDownbar)} className="select-none text-base font-medium text-white cursor-pointer">View offers</p>
                    </div>
                    <div className="flex gap-1 items-center relative">
                        <Input value={couponInput} type='text' onChange={(e) => setCouponInput(e.target.value)} placeholder='Enter code here..' className='w-full' inputClassName='bg-white pr-20 xs:pr-18 py-3' />
                        <p onClick={(e) => setCoupon(couponInput)} className='absolute right-2 h-fit cursor-pointer text-base text-white bg-black-500 px-2 py-1 rounded-md'>{priceLoading ? '·····' : 'Apply'}</p>
                    </div>
                    {price.discount?.message.type == 'success' && <p className='text-sm text-green-600 font-medium bg-green-100 rounded-md px-2 py-1 mt-2'>{price.discount.message.message}</p>}
                    {price.discount?.message.type == 'error' && <p className='text-sm text-red-600 font-medium bg-red-100 rounded-md px-2 py-1 mt-2'>{price.discount.message.message}</p>}
                </div>
            }
            {/* // Offers downbar */}
            <div className={`${openOfferDownbar ? 'w-full bg-black-500/40 transition-all duration-200 h-screen' : 'h-screen w-full opacity-0 invisible transition-all duration-200'} fixed right-0 left-0 mx-auto top-0 z-20`}>
                <div ref={downbarRef} className={`${openOfferDownbar ? 'w-[calc(100%-20px)] lg:w-[50%] px-4 transition-all duration-200 h-[80vh] pb-20 lg:pb-2' : 'h-0 w-full border-none overflow-hidden px-0 transition-all duration-200'} fixed right-0 left-0 mx-auto bottom-0 bg-white border border-gray-300 overflow-auto rounded-md`}>
                    {/* Title */}
                    <div className="flex items-center justify-between bg-white py-2 sticky top-0">
                        <p className='flex gap-2 items-center bg-white py-1 px-2 rounded-md text-base text-primary-500 font-medium'><span className='block w-8 h-8 text-primary-500' dangerouslySetInnerHTML={{ __html: '<svg fill="currentColor" viewBox="0 0 512 512" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="gift_box-box_open-heart-love-valentine"> <path d="M98.468,174.126l-19.952-20.46c-7.017-7.196-8.387-18.749-2.104-26.593c7.145-8.922,20.022-9.403,27.784-1.442 c7.763-7.96,20.64-7.479,27.785,1.442c6.282,7.845,4.913,19.397-2.104,26.593l-19.953,20.46 C106.784,177.346,101.608,177.346,98.468,174.126z M440,232v176c0,17.673-14.327,32-32,32h-64.063c-8.837,0-16-7.163-16-16V232h-56 v192c0,8.837-7.163,16-16,16L192,440c-17.669,0-32-14.317-32-31.986c0-15.404-0.06-31.565-0.076-42.962L137.52,425.04 c-3.04,8.24-12.32,12.48-20.56,9.36L102,428.8c-16.56-6.16-24.96-24.64-18.8-41.2c35.467-94.885,29.152-77.975,36.4-97.44 l44.96,16.8L184,254.988V254.5l-44.8-16.74c7.261-19.503,0.864-2.371,36.4-97.44c6.24-16.56,24.64-24.96,41.2-18.8l14.96,5.6 c8.315,3.113,12.533,12.376,9.421,20.691l-2.023,5.407c11.952-2.916,23.795-0.19,32.842,6.125 c17.504-12.211,42.038-9.022,55.719,8.785c10.676,13.896,10.819,33.124,1.392,47.871H424C432.8,216,440,223.2,440,232z M230.56,176.196l-6.496,17.36c0.176,6.623,2.783,13.291,7.866,18.424l3.976,4.02c8.323,0,63.117,0,72.193,0l3.972-4.016 c9.359-9.457,10.633-24.121,2.961-34.105c-9.633-12.541-27.106-12.833-37.344-2.492c-3,3.039-8.375,3.039-11.375,0 C256.877,165.849,240.837,164.992,230.56,176.196z M408,328c0-4.4-3.6-8-8-8s-8,3.6-8,8v52.08c0,4.48,3.6,8,8,8s8-3.52,8-8V328z M408,255.52c0-4.4-3.6-8-8-8s-8,3.6-8,8V288c0,4.4,3.6,8,8,8s8-3.6,8-8V255.52z M370.739,162.485 c7.318,7.398,19.204,7.398,26.522,0l32.5-32.855c11.85-11.979,13.89-31.229,3.614-44.605C420.961,68.863,397.847,67.782,384,81.78 c-13.847-13.998-36.961-12.917-49.375,3.245c-10.275,13.376-8.235,32.626,3.614,44.605L370.739,162.485z"></path> </g> <g id="Layer_1"></g> </g></svg>' }}></span>Available offers</p>
                        <span onClick={() => setOpenOfferDownbar(false)} className='bg-gray-200 hover:bg-gray-300 p-1 rounded-md cursor-pointer text-black-500 w-7 h-7 block' title='Close' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>' }}></span>
                    </div>
                    {/* Offers */}
                    {loading ? <div className='grid grid-cols-1 gap-3 mt-5 animate-pulse'>
                        <div className='w-full bg-gray-50 rounded-md py-4 px-6'>
                            <div className='w-full h-full mt-1 px-4 pb-2'>
                                <div className="h-7 w-12 rounded-md bg-gray-200 mt-2"></div>
                                <div className="h-4 w-[40%] rounded-md bg-gray-200 my-2"></div>
                                <div className='flex gap-5 items-start mt-1 relative w-full'>
                                    <div className="h-12 w-full rounded-md bg-gray-200 mb-1"></div>
                                    <div className="h-8 w-20 rounded-md bg-gray-300 absolute right-2 top-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full bg-gray-50 rounded-md py-4 px-6'>
                            <div className='w-full h-full mt-1 px-4 pb-2'>
                                <div className="h-7 w-12 rounded-md bg-gray-200 mt-2"></div>
                                <div className="h-4 w-[40%] rounded-md bg-gray-200 my-2"></div>
                                <div className='flex gap-5 items-start mt-1 relative w-full'>
                                    <div className="h-12 w-full rounded-md bg-gray-200 mb-1"></div>
                                    <div className="h-8 w-20 rounded-md bg-gray-300 absolute right-2 top-2"></div>
                                </div>
                            </div>
                        </div>
                    </div > : offers.length == 0 ?
                        <div className="flex flex-col mt-5 py-4 px-6 bg-gray-50 rounded-md">
                            <h2 className='text-xl xs:text-2xl text-black-500 font-semibold'>Oops!</h2>
                            <p className='text-base text-black-300 font-normal mt-1'>No offers found for this property.</p>
                        </div> :
                        <div className="grid grid-cols-1 gap-3 mt-5">
                            {offers.map((offer, index) => (
                                <div key={index} className="flex flex-col justify-between bg-gradient-to-bl from-primary-500/80 to-secondary-500 border border-gray-200 rounded-md py-4 px-6 h-full">
                                    <span className='w-14 h-10 text-primary-400' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 64 64" id="Flat" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect height="32" rx="4" ry="4" style="fill:#fff" width="58" x="3" y="16"></rect><polygon points="3 28 23 48 17 48 3 34 3 28" style="fill:#191919"></polygon><polygon points="41 16 61 36 61 30 47 16 41 16" style="fill:#191919"></polygon><rect height="16" style="fill:#3D82F5" width="18" x="23" y="25"></rect><polygon points="32 22 27 21 27 25 32 25 37 25 37 21 32 22" style="fill:#f7cc38"></polygon><rect height="16" style="fill:#f7cc38" width="2" x="31" y="25"></rect><rect height="2" style="fill:#f7cc38" width="18" x="23" y="32"></rect></g></svg>' }}></span>
                                    <p className='text-base text-white font-normal mt-3 flex-1'>{offer.shortDesc}</p>
                                    <div>
                                        <p className='text-sm text-white font-normal mt-3'>Expires on {moment(offer.expirationDate).format('DD MMMM YYYY')}</p>
                                        <div className="flex flex-wrap gap-5 justify-between items-center mt-2 bg-gray-100 hover:bg-gray-100 pl-4 pr-2 py-2 rounded-md">
                                            <p className='font-medium text-black-500'>{offer.couponCode}</p>
                                            <p onClick={() => applyCoupon(offer.couponCode)} className='cursor-pointer text-base text-white hover:text-white bg-black-500 hover:bg-black-500 border border-black-500 px-2 py-1 rounded-md flex gap-1 items-center'>{couponInput == offer.couponCode ? 'Applied' : 'Apply'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default OffersApply