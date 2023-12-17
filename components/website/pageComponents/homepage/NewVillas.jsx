import React, { useContext, useEffect, useState } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Button from '@/components/website/design/Button';
import Villa from '../../common/Villa';
import Link from 'next/link';
import { SettingsContext } from '@/conf/context/SettingsContext'

const NewVillas = () => {
    const { settings } = useContext(SettingsContext);
    const [loading, setLoading] = useState(true)
    // To Fetch villas >>>>>>>>>>>>>>>>>
    const [villas, setVillas] = useState([])
    useEffect(() => {
        const fetchVilla = async () => {
            setLoading(true)
            const response = await fetch(`/api/website/villas?limit=20&new=true`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setVillas(responseData.data)
            }
            setLoading(false)
        }
        fetchVilla()
    }, [setLoading])
    return (
        <>
            {loading ? <div className='section-lg mt-20 xs:mt-28 animate-pulse'>
                <div className="flex justify-between items-center select-none">
                    <div className='h-5 w-[20%] rounded-md bg-gray-200'></div>
                    <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                        <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                        <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                    </div>
                </div>
                <div className='mt-12 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-[35px]'>
                    <div className='relative flex flex-col bg-white border border-gray-200 rounded-md'>
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
                    </div>
                </div>
            </div > : villas.length > 0 &&
            <div className='section-lg mt-20 xs:mt-28'>
                {/* Villas */}
                <Splide hasTrack={false}
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
                    <div className="flex justify-between items-center select-none">
                        <h2 className='text-2xl sm:text-3xl text-black-500 font-medium font-secondary'>New Villas</h2>
                        <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                            <span className='splide__arrow--prev prev w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                            <span className='splide__arrow--next next w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                        </div>
                    </div>
                    <SplideTrack className='mt-12'>
                        {window.innerWidth > 440 && <SplideSlide className='hidden xs:block'>
                            <div className='bg-gradient-to-bl from-secondary-500/80 to-primary-500 rounded-md p-5 relative h-full flex flex-col justify-end'>
                                <span className="w-16 xs:w-10 sm:w-14 text-white block flex-1 mt-4 xs:mt-0 xs:mb-1 sm:mt-10 md:mt-1" dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>new-star</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z"></path> </g> </g> </g></svg>' }}></span>
                                <h1 className='text-2xl xs:text-xl md:text-xl lg:text-xl xl:text-2xl text-white font-bold xs:font-normal sm:font-bold leading-[1.3]'>Discover Our Newest Luxurious Villas: Your Gateway to Modern Elegance</h1>
                                <Link href="/explore?new=true"><Button type='button' label='See all' className='mt-5 bg-white hover:bg-gray-100 text-black-500' /></Link>
                                <div className="bg-black-500 px-2 py-1 rounded-b-lg flex gap-2 items-center w-fit absolute top-0 right-5">
                                    <span className="w-4 h-4 text-white block" dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>new-star</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z"></path> </g> </g> </g></svg>' }}></span>
                                    <p className='text-sm text-white font-medium'>New</p>
                                </div>
                            </div>
                        </SplideSlide>
                        }
                        {villas.slice(0, 4).map((villa, index) => (
                            <SplideSlide key={index}>
                                <Villa villa={villa} />
                            </SplideSlide>
                        ))}
                    </SplideTrack>
                </Splide>
            </div>
            }
        </>
    )
}

export default NewVillas