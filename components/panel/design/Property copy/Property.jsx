import React, { memo } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import Button from '@/components/panel/design/Button';
import Empty from '../Empty';

const Property = ({ properties, editFetch, loading }) => {
    return (
        <>
            {loading ?
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                    <div className="bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md">
                        <div className='flex flex-col gap-2 h-full'>
                            <div className='w-full z-10'>
                                <Splide hasTrack={false} options={{
                                    rewind: true,
                                    width: '100%',
                                    gap: '1rem',
                                    arrows: false,
                                    heightRatio: 0.643,
                                    classes: {
                                        pagination: 'splide__pagination your-class-pagination',
                                        page: 'splide__pagination__page dot',
                                    },
                                    className: 'z-10'
                                }}>
                                    <SplideTrack>
                                        <SplideSlide>
                                            <div className='rounded-t-md w-full h-full bg-gray-200 dark:bg-black-400' ></div>
                                        </SplideSlide>
                                    </SplideTrack>
                                </Splide>
                            </div>
                            <div className='flex flex-col w-full pb-3 px-3 flex-1'>
                                {/* // Labels, Name, Address & Primary number */}
                                <div className='flex-1'>
                                    {/* // Labels */}
                                    <div className='text-sm font-medium h-7 w-2/3 bg-gray-200 dark:bg-black-400 px-2 py-1 rounded-md flex gap-2 items-center'></div>
                                    {/* // Name */}
                                    <div className='rounded-md w-full h-5 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Address */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Primary number */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                </div>
                                {/* // Button */}
                                <div className='rounded-md w-full h-10 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md">
                        <div className='flex flex-col gap-2 h-full'>
                            <div className='w-full z-10'>
                                <Splide hasTrack={false} options={{
                                    rewind: true,
                                    width: '100%',
                                    gap: '1rem',
                                    arrows: false,
                                    heightRatio: 0.643,
                                    classes: {
                                        pagination: 'splide__pagination your-class-pagination',
                                        page: 'splide__pagination__page dot',
                                    },
                                    className: 'z-10'
                                }}>
                                    <SplideTrack>
                                        <SplideSlide>
                                            <div className='rounded-t-md w-full h-full bg-gray-200 dark:bg-black-400' ></div>
                                        </SplideSlide>
                                    </SplideTrack>
                                </Splide>
                            </div>
                            <div className='flex flex-col w-full pb-3 px-3 flex-1'>
                                {/* // Labels, Name, Address & Primary number */}
                                <div className='flex-1'>
                                    {/* // Labels */}
                                    <div className='text-sm font-medium h-7 w-2/3 bg-gray-200 dark:bg-black-400 px-2 py-1 rounded-md flex gap-2 items-center'></div>
                                    {/* // Name */}
                                    <div className='rounded-md w-full h-5 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Address */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Primary number */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                </div>
                                {/* // Button */}
                                <div className='rounded-md w-full h-10 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md">
                        <div className='flex flex-col gap-2 h-full'>
                            <div className='w-full z-10'>
                                <Splide hasTrack={false} options={{
                                    rewind: true,
                                    width: '100%',
                                    gap: '1rem',
                                    arrows: false,
                                    heightRatio: 0.643,
                                    classes: {
                                        pagination: 'splide__pagination your-class-pagination',
                                        page: 'splide__pagination__page dot',
                                    },
                                    className: 'z-10'
                                }}>
                                    <SplideTrack>
                                        <SplideSlide>
                                            <div className='rounded-t-md w-full h-full bg-gray-200 dark:bg-black-400' ></div>
                                        </SplideSlide>
                                    </SplideTrack>
                                </Splide>
                            </div>
                            <div className='flex flex-col w-full pb-3 px-3 flex-1'>
                                {/* // Labels, Name, Address & Primary number */}
                                <div className='flex-1'>
                                    {/* // Labels */}
                                    <div className='text-sm font-medium h-7 w-2/3 bg-gray-200 dark:bg-black-400 px-2 py-1 rounded-md flex gap-2 items-center'></div>
                                    {/* // Name */}
                                    <div className='rounded-md w-full h-5 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Address */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Primary number */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                </div>
                                {/* // Button */}
                                <div className='rounded-md w-full h-10 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white animate-pulse dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md">
                        <div className='flex flex-col gap-2 h-full'>
                            <div className='w-full z-10'>
                                <Splide hasTrack={false} options={{
                                    rewind: true,
                                    width: '100%',
                                    gap: '1rem',
                                    arrows: false,
                                    heightRatio: 0.643,
                                    classes: {
                                        pagination: 'splide__pagination your-class-pagination',
                                        page: 'splide__pagination__page dot',
                                    },
                                    className: 'z-10'
                                }}>
                                    <SplideTrack>
                                        <SplideSlide>
                                            <div className='rounded-t-md w-full h-full bg-gray-200 dark:bg-black-400' ></div>
                                        </SplideSlide>
                                    </SplideTrack>
                                </Splide>
                            </div>
                            <div className='flex flex-col w-full pb-3 px-3 flex-1'>
                                {/* // Labels, Name, Address & Primary number */}
                                <div className='flex-1'>
                                    {/* // Labels */}
                                    <div className='text-sm font-medium h-7 w-2/3 bg-gray-200 dark:bg-black-400 px-2 py-1 rounded-md flex gap-2 items-center'></div>
                                    {/* // Name */}
                                    <div className='rounded-md w-full h-5 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Address */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                    {/* // Primary number */}
                                    <div className='rounded-md w-full h-3 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                                </div>
                                {/* // Button */}
                                <div className='rounded-md w-full h-10 bg-gray-200 dark:bg-black-400 mt-5' ></div>
                            </div>
                        </div>
                    </div>
                </div> :
                properties && properties.length != 0 ?
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {/* // Property */}
                        {properties.map((property, index) => (
                            <div key={index} className="bg-white dark:bg-dimBlack border border-gray-200 dark:border-black-400 rounded-md">
                                <div className='flex flex-col gap-2 h-full'>
                                    <div className='w-full z-10'>
                                        <Splide hasTrack={false} options={{
                                            rewind: true,
                                            width: '100%',
                                            gap: '1rem',
                                            arrows: false,
                                            heightRatio: 0.643,
                                            classes: {
                                                pagination: 'splide__pagination your-class-pagination',
                                                page: 'splide__pagination__page dot',
                                            },
                                            className: 'z-10'
                                        }}>
                                            <SplideTrack>
                                                {property.images.map((image, index) => (
                                                    <SplideSlide key={index}>
                                                        <Image src={image} alt='Property image' height={321} width={500} priority className='rounded-t-md w-full' />
                                                    </SplideSlide>
                                                ))}
                                            </SplideTrack>
                                        </Splide>
                                    </div>
                                    <div className='flex flex-col w-full pb-3 px-3 flex-1'>
                                        {/* // Labels, Name, Address & Primary number */}
                                        <div className='flex-1'>
                                            {/* // Labels */}
                                            <div className="mb-3 flex gap-x-1 gap-y-1 flex-wrap">
                                                {property.submitForVerification && !property.verified && <p className="text-sm font-medium w-fit bg-green-200 px-2 py-1 rounded-md text-green-700 flex gap-2 items-center"><span className="w-4 h-4" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>' }}></span> Applied for verification</p>}
                                                {property.verificationFailReason && <p className="text-sm font-medium w-fit bg-red-100 px-2 py-1 rounded-md text-red-500 flex gap-2 items-center"><span className='block w-2 h-2 bg-red-500'></span> Verification failed</p>}
                                                {!property.submitForVerification && !property.verified && <p className="text-sm font-medium w-fit bg-red-100 px-2 py-1 rounded-md text-red-500 flex gap-2 items-center"><span className='block w-2 h-2 bg-red-500'></span> Property is not verified</p>}
                                                {property.hidden && <p className="text-sm font-medium w-fit bg-yellow-50 dark:bg-yellow-100 px-2 py-1 rounded-md text-yellow-700 flex gap-2 items-center"><span className="w-4 h-4" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-eyeglasses" viewBox="0 0 16 16"><path d="M4 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h.541A3 3 0 0 0 7 8a1 1 0 0 1 2 0 3 3 0 0 0 5.959.5h.541a.5.5 0 0 0 0-1h-.541a3 3 0 0 0-5.584-.953A1.993 1.993 0 0 0 8 6c-.532 0-1.016.208-1.375.547zM14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>' }}></span> Hidden</p>}
                                                {!property.hidden && !property.block && property.verified && <p className="text-sm font-medium w-fit bg-green-200 dark:bg-green-200 px-2 py-1 rounded-md text-green-700 flex gap-2 items-center"><span className='block w-2 h-2 rounded-md bg-green-500'></span> Listed on website</p>}
                                                {property.block && <p className="text-sm font-medium w-fit bg-red-100 px-2 py-1 rounded-md text-red-500 flex gap-2 items-center"><span className='block w-2 h-2 bg-red-500'></span> Property is blocked</p>}
                                            </div>
                                            {/* // Name */}
                                            <h2 className={`text-lg ${!property.hidden && !property.block && property.verified ? 'text-green-600' : 'text-red-500'} font-medium flex gap-3 items-center`}><span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-building-fill" viewBox="0 0 16 16"><path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H3Zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z"/></svg>' }}></span> {property.name} {property.verified && <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 bi bi-patch-check-fill" viewBox="0 0 16 16"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" /></svg>}</h2>
                                            {/* // Address */}
                                            <p className='mt-2 text-black-300 dark:text-black-200 text-base font-normal line-clamp-2'>{property.address}</p>
                                            {/* // Primary number */}
                                            <div className="flex gap-x-5 gap-y-1 flex-wrap">
                                                {property.phonePrimary && <p className='flex gap-4 items-center text-black-300 dark:text-black-200 mt-3'><span className="w-4 h-4" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>' }}></span>{property.phonePrimary}</p>}
                                            </div>
                                        </div>
                                        {/* // Button */}
                                        <div className='mt-3'>
                                            <Button variant='secondary-icon' onClick={() => { editFetch(property._id) }} className='w-full text-xs py-2 px-3 xl:px-6 min-h-[35.2px]' label='Edit Property' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> :
                    <Empty message='Ooops! No data found' className='mt-5' />
            }
        </>
    )
}

export default memo(Property)