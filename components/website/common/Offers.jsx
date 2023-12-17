import React, { useEffect, useState } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Offer from './Offer';

const Offers = () => {
    const [loading, setLoading] = useState(true)
    // To Fetch offers >>>>>>>>>>>>>>>>>
    const [offers, setOffers] = useState([])
    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true)
            const response = await fetch(`/api/website/coupons?limit=20`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setOffers(responseData.data)
            }
            setLoading(false)
        }
        fetchOffers()
    }, [setLoading])
    return (
        <>{loading ?
            <>
                <div className='grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 animate-pulse'>
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
                </div >
            </> : offers.length > 0 &&
            <div className="section-lg mt-20 xs:mt-28">
                <Splide hasTrack={false} options={{
                    rewind: true,
                    width: '100%',
                    gap: '35px',
                    arrows: true,
                    pagination: false,
                    className: 'z-10',
                    perPage: 3,
                    breakpoints: {
                        440: {
                            perPage: 1,
                        },
                        640: {
                            gap: '20px',
                            perPage: 1,
                        },
                        840: {
                            perPage: 2,
                        },
                        1040: {
                            perPage: 3,
                        },
                    },
                    classes: {
                        arrows: 'splide__arrows arrows',
                        prev: 'splide__arrow--prev prev',
                        next: 'splide__arrow--next next',
                    },
                }}>
                    {/* // Title */}
                    <div className="flex justify-between items-center select-none">
                        <h2 className='text-2xl sm:text-3xl text-black-500 font-medium font-secondary'>Some Exciting Offers</h2>
                        <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                            <span className='splide__arrow--prev prev w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                            <span className='splide__arrow--next next w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                        </div>
                    </div>
                    {/* // Offers */}
                    <SplideTrack className='mt-12'>
                        {offers.map((offer, index) => (
                            <SplideSlide key={index}>
                                <Offer offer={offer} />
                            </SplideSlide>
                        ))}
                    </SplideTrack>
                </Splide>
            </div>
        }
        </>
    )
}

export default Offers