import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Villa from '../../common/Villa';
import Link from 'next/link';
import Empty from '@/components/website/design/Empty';

const BestVillas = () => {
    // To Fetch locations >>>>>>>>>>>>>>>>>
    const [locationLoading, setLocationLoading] = useState(true)
    const [locationId, setLocationId] = useState('popular') // Selected location
    const [locations, setLocations] = useState([])
    useEffect(() => {
        const fetchLocation = async () => {
            setLocationLoading(true)
            const response = await fetch(`/api/website/locations?limit=12`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setLocations(responseData.data)
            }
            setLocationLoading(false)
        }
        fetchLocation()
    }, [setLocationLoading])

    // To Fetch villas >>>>>>>>>>>>>>>>>
    const [villaLoading, setVillaLoading] = useState(true)
    const [villas, setVillas] = useState([])
    useEffect(() => {
        const fetchVilla = async () => {
            setVillaLoading(true)
            const response = await fetch(`/api/website/villas?limit=12&locationId=${locationId}`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setVillas(responseData.data)
            }
            setVillaLoading(false)
        }
        fetchVilla()
    }, [setVillaLoading, locationId])

    return (
        <div className='section-lg mt-20 xs:mt-28'>
            {/* Villas */}
            <Splide hasTrack={false} className='flex flex-col'
                options={{
                    rewind: true,
                    width: '100%',
                    gap: '35px',
                    arrows: true,
                    pagination: false,
                    className: 'z-10',
                    perPage: 4,
                    classes: {
                        arrows: 'splide__arrows arrows',
                        prev: 'splide__arrow--prev prev',
                        next: 'splide__arrow--next next',
                    },
                    breakpoints: {
                        440: {
                            perPage: 1,
                        },
                        850: {
                            gap: '20px',
                            perPage: 2,
                        },
                        1040: {
                            perPage: 3,
                        },
                    }
                }}>
                {/* // Title */}
                <div className="order-1 flex justify-between items-center select-none">
                    <h2 className='text-2xl sm:text-3xl text-black-500 font-medium font-secondary'>Popular Villas</h2>
                    <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                        <span className='splide__arrow--prev prev w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                        <span className='splide__arrow--next next w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                    </div>
                </div>
                {/* // Villas */}
                {villaLoading ?
                    <SplideTrack className='order-3 animate-pulse mt-12'>
                        <SplideSlide className='relative flex flex-col bg-white border border-gray-200 rounded-md'>
                            <div className='aspect-[4/3] rounded-t-md w-full h-full object-cover bg-gray-200 min-h-[220px]' />
                            <div className='w-full h-full mt-1 px-4 pb-2'>
                                {/* Villa name */}
                                <div className="h-5 w-[70%] rounded-md bg-gray-200 mt-2"></div>
                                {/* location */}
                                <div className="h-4 w-[40%] rounded-md bg-gray-200 my-2"></div>
                                {/* Price */}
                                <div className='flex flex-col gap-1 flex-wrap items-start mt-1'>
                                    <div className="h-3 w-[30%] rounded-md bg-gray-200 mb-1"></div>
                                    <div className="h-4 w-[60%] rounded-md bg-gray-200"></div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide className='relative flex flex-col bg-white border border-gray-200 rounded-md'>
                            <div className='aspect-[4/3] rounded-t-md w-full h-full object-cover bg-gray-200 min-h-[220px]' />
                            <div className='w-full h-full mt-1 px-4 pb-2'>
                                {/* Villa name */}
                                <div className="h-5 w-[70%] rounded-md bg-gray-200 mt-2"></div>
                                {/* location */}
                                <div className="h-4 w-[40%] rounded-md bg-gray-200 my-2"></div>
                                {/* Price */}
                                <div className='flex flex-col gap-1 flex-wrap items-start mt-1'>
                                    <div className="h-3 w-[30%] rounded-md bg-gray-200 mb-1"></div>
                                    <div className="h-4 w-[60%] rounded-md bg-gray-200"></div>
                                </div>
                            </div>
                        </SplideSlide>
                    </SplideTrack> :
                    <SplideTrack className='order-3 mt-12'>
                        {villas.map((villa, index) => (
                            <SplideSlide key={index}>
                                <Villa villa={villa} />
                            </SplideSlide>
                        ))}
                        {villas.length == 0 && <Empty message='Oops! No villas found for selected location' />}
                    </SplideTrack>
                }
                {/* // Locations */}
                {
                    locationLoading ?
                        <div className='order-2 mt-5 gap-[15px] flex items-center overflow-scroll no-scrollbar animate-pulse'>
                            <div className="bg-gray-200 h-8 w-[15%] xs:w-[10%] rounded-md"></div>
                            <div className="bg-gray-200 h-8 w-[20%] xs:w-[8%] rounded-md"></div>
                            <div className="bg-gray-200 h-8 w-[11%] xs:w-[12%] rounded-md"></div>
                        </div> :
                        <Splide className="order-2 flex gap-x-3 mt-5 overflow-y-hidden overflow-x-auto no-scrollbar"
                            options={{
                                rewind: true,
                                gap: '15px',
                                arrows: false,
                                pagination: false,
                                className: 'z-10',
                                autoWidth: true,
                            }}>
                            <SplideSlide><p onClick={() => setLocationId('popular')} className={`${locationId == 'popular' ? 'text-white bg-black-500' : 'text-black-300 bg-transparent'} whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-black-500 hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md`}>Popular</p></SplideSlide>
                            {locations.length > 0 &&
                                locations.map((location, index) => (
                                    <SplideSlide key={index}><p onClick={() => setLocationId(location._id)} className={`${locationId == location._id ? 'text-white bg-black-500' : 'text-black-300 bg-transparent'} whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-black-500 hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md`}>{location.name}</p></SplideSlide>
                                ))
                            }
                            <SplideSlide><Link href='/explore'><p className={`bg-transparent whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-black-500 hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md`}>Explore all</p></Link></SplideSlide>
                        </Splide>
                }
            </Splide >
        </div >
    )
}

export default BestVillas