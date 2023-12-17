import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/panel/design/Button';

const Locations = () => {
    const [loading, setLoading] = useState(true)
    // To Fetch locations >>>>>>>>>>>>>>>>>
    const [locations, setLocations] = useState([])
    useEffect(() => {
        const fetchLocation = async () => {
            setLoading(true)
            const response = await fetch(`/api/website/locations?limit=12`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setLocations(responseData.data)
            }
            setLoading(false)
        }
        fetchLocation()
    }, [setLoading])

    return (
        <>
            {loading ? <div className='section-lg xs:mt-5 md:mt-10 animate-pulse'>
                <div className="flex justify-between items-center select-none">
                    <div className='h-5 w-[20%] rounded-md bg-gray-200'></div>
                    <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                        <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                        <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                    </div>
                </div>
                <div className='mt-12 grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-[35px]'>
                    <div className='flex flex-col gap-2 cursor-pointer'>
                        <div className="h-[200px] rounded-xl overflow-hidden">
                            <div className="h-[200px] w-full rounded-md bg-gray-200"></div>
                        </div>
                        <div className='w-full'>
                            <div className='h-3 w-[80%] rounded-md bg-gray-200 mt-2'></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 cursor-pointer'>
                        <div className="h-[200px] rounded-xl overflow-hidden">
                            <div className="h-[200px] w-full rounded-md bg-gray-200"></div>
                        </div>
                        <div className='w-full'>
                            <div className='h-3 w-[80%] rounded-md bg-gray-200 mt-2'></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 cursor-pointer'>
                        <div className="h-[200px] rounded-xl overflow-hidden">
                            <div className="h-[200px] w-full rounded-md bg-gray-200"></div>
                        </div>
                        <div className='w-full'>
                            <div className='h-3 w-[80%] rounded-md bg-gray-200 mt-2'></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 cursor-pointer'>
                        <div className="h-[200px] rounded-xl overflow-hidden">
                            <div className="h-[200px] w-full rounded-md bg-gray-200"></div>
                        </div>
                        <div className='w-full'>
                            <div className='h-3 w-[80%] rounded-md bg-gray-200 mt-2'></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 cursor-pointer'>
                        <div className="h-[200px] rounded-xl overflow-hidden">
                            <div className="h-[200px] w-full rounded-md bg-gray-200"></div>
                        </div>
                        <div className='w-full'>
                            <div className='h-3 w-[80%] rounded-md bg-gray-200 mt-2'></div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 cursor-pointer'>
                        <div className="h-[200px] rounded-xl overflow-hidden">
                            <div className="h-[200px] w-full rounded-md bg-gray-200"></div>
                        </div>
                        <div className='w-full'>
                            <div className='h-3 w-[80%] rounded-md bg-gray-200 mt-2'></div>
                        </div>
                    </div>
                </div>
            </div> : locations.length > 0 &&
            <div className='section-lg xs:mt-5 md:mt-10'>
                <Splide hasTrack={false}
                    options={{
                        rewind: true,
                        width: '100%',
                        gap: '35px',
                        arrows: true,
                        pagination: false,
                        className: 'z-10',
                        perPage: 7,
                        breakpoints: {
                            440: {
                                perPage: 2,
                            },
                            640: {
                                gap: '20px',
                                perPage: 3,
                            },
                            840: {
                                perPage: 4,
                            },
                            1040: {
                                perPage: 5,
                            },
                        },
                        classes: {
                            arrows: 'splide__arrows arrows',
                            prev: 'splide__arrow--prev prev',
                            next: 'splide__arrow--next next',
                        },
                    }}
                >
                    <div className="flex justify-between items-center select-none">
                        <h2 className='text-2xl sm:text-3xl text-black-500 font-medium font-secondary'>Popular Destinations</h2>
                        <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                            <span className='splide__arrow--prev prev w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                            <span className='splide__arrow--next next w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                        </div>
                    </div>
                    <SplideTrack className='mt-12'>
                        {locations.map((location, index) => (
                            <SplideSlide key={index}>
                                <Link href={`/explore?location=${location._id}&city=${location.name}`} className='flex flex-col gap-2 cursor-pointer'>
                                    <div className="h-[200px] rounded-xl overflow-hidden">
                                        <Image src={location.image} alt='Room image' height={200} width={200} priority className='transition ease-in-out hover:scale-[1.04] w-full h-[200px] object-cover' />
                                    </div>
                                    <div className='w-full'>
                                        <h2 className='text-xl text-black-500 font-medium'>{location.name}</h2>
                                    </div>
                                </Link>
                            </SplideSlide>
                        ))}
                        {locations.length > 12 &&
                            <SplideSlide>
                                <Link href={`/explore`} className='h-full flex flex-col gap-2 cursor-pointer'>
                                    <div className='bg-gradient-to-bl from-primary-500/80 to-secondary-500 rounded-md p-5 relative h-full flex flex-col justify-end'>
                                        <p className='text-2xl xs:text-xl md:text-xl lg:text-xl xl:text-2xl text-white font-bold xs:font-normal sm:font-bold'><span className='text-2xl text-white font-medium font-secondary leading-[1.3] mb-1 block'>Explore more locations</span></p>
                                        <Button type='button' label='See all' className='mt-5 bg-white hover:bg-gray-100 text-black-500' />
                                    </div>
                                </Link>
                            </SplideSlide>
                        }
                    </SplideTrack>
                </Splide>
            </div>
            }
        </>
    )
}

export default Locations