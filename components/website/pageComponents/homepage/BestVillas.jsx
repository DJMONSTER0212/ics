import React, { useContext, useEffect, useState } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Button from '@/components/website/design/Button';
import Villa from '../../common/Villa';
import Link from 'next/link';
import { SettingsContext } from '@/conf/context/SettingsContext'

const BestVillas = () => {
    const { settings } = useContext(SettingsContext);
    const [loading, setLoading] = useState(true)
    // To Fetch villas >>>>>>>>>>>>>>>>>
    const [villas, setVillas] = useState([])
    useEffect(() => {
        const fetchVilla = async () => {
            setLoading(true)
            const response = await fetch(`/api/website/villas?limit=20&bestRated=true`);
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
                        <h2 className='text-2xl sm:text-3xl text-black-500 font-medium font-secondary'>Best Rated Villas</h2>
                        <div className='flex gap-5 sm:gap-7 splide__arrows arrows'>
                            <span className='splide__arrow--prev prev w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                            <span className='splide__arrow--next next w-9 h-9 sm:w-10 sm:h-10 p-2.5 bg-black-500 rounded-md text-white cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>' }}></span>
                        </div>
                    </div>
                    <SplideTrack className='mt-12'>
                        {window.innerWidth > 440 && <SplideSlide className='hidden xs:block'>
                            <div className='bg-gradient-to-bl from-primary-500/80 to-secondary-500 rounded-md p-5 relative h-full flex flex-col justify-end'>
                                <span className="w-16 xs:w-10 sm:w-14 text-white block flex-1 mt-4 xs:mt-0 xs:mb-1 sm:mt-10 md:mt-1" dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-stars"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"></path> </g></svg>' }}></span>
                                <h1 className='text-2xl xs:text-xl md:text-xl lg:text-xl xl:text-2xl text-white font-bold xs:font-normal sm:font-bold leading-[1.3]'>{settings.website?.name}<br /> Villas That Always Deliver on Guest Expectations</h1>
                                <Link href="/explore?bestRated=true"><Button type='button' label='See all' className='mt-5 bg-white hover:bg-gray-100 text-black-500' /></Link>
                                <div className="bg-black-500 px-2 py-1 rounded-b-lg flex gap-2 items-center w-fit absolute top-0 right-5">
                                    <span className="w-3 h-3 text-white block" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>' }}></span>
                                    <p className='text-sm text-white font-medium'>Best Rated</p>
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

export default BestVillas