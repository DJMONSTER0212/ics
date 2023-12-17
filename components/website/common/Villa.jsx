import React, { useContext } from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import Link from 'next/link';
import { SettingsContext } from '@/conf/context/SettingsContext';

const Villa = ({ villa, Tag }) => {
    const { settings } = useContext(SettingsContext)
    return (
        <div className='relative flex flex-col bg-white border border-gray-200 rounded-md'>
            <Splide hasTrack={false}
                options={{
                    width: '100%',
                    rewind: true,
                    arrows: villa.images.length > 1 ? true : false,
                    pagination: false,
                    autoplay: true,
                    interval: 3000,
                    drag: false,
                    classes: {
                        arrows: 'splide__arrows arrows',
                        prev: 'splide__arrow--prev prev',
                        next: 'splide__arrow--next next',
                    },
                }}
                className='relative group'
            >
                <SplideTrack className='rounded-t-md relative'>
                    {villa.images.map((image, index) => (
                        <SplideSlide key={index}>
                            <Image src={image} alt='Villa image' height={400} width={300} priority className='aspect-[4/3] rounded-t-md w-full h-full object-cover' />
                        </SplideSlide>
                    ))}
                </SplideTrack>
                {villa.images.length > 1 &&
                    <div className='opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 w-full flex gap-5 sm:gap-7 justify-between splide__arrows arrows absolute -translate-y-1/2 top-1/2 px-2'>
                        <button className='splide__arrow--prev prev bg-none'><span className='block w-7 h-7 p-1.5 bg-white rounded-full text-black-500 cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>' }}></span></button>
                        <button className='splide__arrow--next next bg-none'><span className='block w-7 h-7 p-1.5 bg-white rounded-full text-black-500 cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>' }}></span></button>
                    </div>
                }
                {/* Pets */}
                {villa.petAllowed && <p className='flex gap-2 items-center absolute bottom-1 left-1 bg-white py-1 px-2 border border-black-500 rounded-md text-xs text-black-500 font-normal mr-0.5'><span className='text-black-500 w-3 h-3 block overflow-hidden' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" fill="none" viewBox="0 0 512 512"><g fill="currentColor" stroke="currentColor" clip-path="url(#a)"><path d="M325.711 512.001H110.539c-28.486 0-51.66-23.174-51.66-51.66V225.285c0-17.428 8.742-33.474 23.388-42.922l132.997-85.806c24.747-15.967 56.728-15.967 81.473 0l132.997 85.806c14.645 9.448 23.388 25.493 23.388 42.922v256.394c0 8.158-6.615 14.772-14.772 14.772s-14.772-6.613-14.772-14.772V225.285a21.452 21.452 0 0 0-9.862-18.097l-132.997-85.806c-15.02-9.689-34.425-9.689-49.441 0L98.283 207.189a21.452 21.452 0 0 0-9.86 18.097v235.056c0 12.196 9.92 22.116 22.116 22.116h215.173c8.157 0 14.772 6.613 14.772 14.772 0 8.159-6.614 14.771-14.773 14.771Z"/><path d="M486.918 172.985c-2.844 0-5.715-.818-8.25-2.529L281.504 37.412c-15.491-10.455-35.514-10.455-51.01 0L33.332 170.456c-6.764 4.566-15.943 2.78-20.508-3.981-4.563-6.762-2.78-15.945 3.982-20.508L213.97 12.922c25.533-17.23 58.53-17.228 84.061 0l197.164 133.044c6.762 4.563 8.545 13.745 3.981 20.508a14.757 14.757 0 0 1-12.257 6.511ZM256.001 429.151c-72.916 0-120.032-35.446-120.032-90.304 0-10.002 1.671-24.85 6.124-38.043-17.726-28.066-3.139-69.027-1.34-73.801a14.771 14.771 0 0 1 12.159-9.469c.507-.058 5.144-.56 11.99-.56 16.758 0 38.566 2.851 54.112 15.256 11.9-3.44 24.302-5.179 36.987-5.179 12.684 0 25.085 1.74 36.987 5.179 15.544-12.404 37.353-15.256 54.112-15.256 6.845 0 11.484.504 11.99.56a14.774 14.774 0 0 1 12.159 9.469c1.801 4.774 16.382 45.733-1.34 73.802 4.454 13.196 6.124 28.043 6.124 38.043-.001 54.857-47.116 90.303-120.032 90.303Zm-90.3-182.633c-2.913 12.035-5.129 30.312 2.4 39.977.332.427.784.929 1.384 1.539a14.774 14.774 0 0 1 2.789 16.75c-3.917 8.166-6.761 22.491-6.761 34.064 0 19.042 8.13 34.034 24.164 44.559C205.595 393.855 229.15 399.61 256 399.61c26.85 0 50.405-5.755 66.323-16.203 16.033-10.525 24.164-25.515 24.164-44.559 0-11.571-2.844-25.896-6.761-34.065a14.778 14.778 0 0 1 2.784-16.744c.61-.619 1.053-1.112 1.394-1.551 7.522-9.655 5.309-27.92 2.392-39.968-18.135.123-31.947 4.421-37.966 11.837a14.776 14.776 0 0 1-16.596 4.544c-11.303-4.185-23.326-6.306-35.734-6.306-12.408 0-24.432 2.123-35.736 6.306a14.769 14.769 0 0 1-16.597-4.544c-6.019-7.416-19.83-11.715-37.966-11.839Z"/><path d="M212.875 333.091h-2.028c-8.158 0-14.772-6.613-14.772-14.772 0-8.158 6.613-14.772 14.772-14.772h2.028c8.158 0 14.772 6.613 14.772 14.772-.001 8.158-6.614 14.772-14.772 14.772Zm88.28 0h-2.03c-8.157 0-14.772-6.613-14.772-14.772 0-8.158 6.615-14.772 14.772-14.772h2.03c8.157 0 14.772 6.613 14.772 14.772-.001 8.158-6.614 14.772-14.772 14.772Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h512.001v512.001H0z"/></clipPath></defs></svg>' }}></span> Pet friendly</p>}
            </Splide>
            <Link href={`/villa/${villa._id}/${villa.slug}`} passHref className='w-full h-full mt-1 px-3 pb-2'>
                {/* Villa name */}
                <h2 className='text-lg text-black-500 font-medium line-clamp-1 cursor-pointer'>{villa.name}</h2>
                {villa.villaDetails.length > 0 &&
                    <div className="flex flex-wrap gap-1 items-center h-6 overflow-hidden">
                        {villa.villaDetails.map((detail, index) => (
                            <div key={index} className='flex gap-1 items-center'>
                                <p className='text-sm text-black-300 font-normal whitespace-nowrap'>{detail}</p>
                                {index + 1 != villa.villaDetails.length && <div className="w-1 h-1 rounded-full bg-black-300"></div>}
                            </div>
                        ))}
                    </div>
                }
                {/* location */}
                <p className='flex items-center gap-1 text-sm text-black-500'>{villa.location.name}</p>
                {/* Price */}
                <div className='flex flex-col gap-1 flex-wrap items-start mt-1'>
                    {villa.discountedPrice && <div className='flex items-center gap-1'><p className='text-sm text-red-500 font-medium mr-0.5 line-through'>{settings.website?.currencySymbol} {villa.basePrice}</p><span className='text-sm font-medium text-primary-500'>{Math.round(((Number(villa.basePrice) - Number(villa.discountedPrice)) * 100 / Number(villa.basePrice)))} %off</span></div>}
                    <p className='flex items-center text-sm text-black-500 font-normal'><span className='text-lg text-black-500 font-bold mr-0.5 whitespace-nowrap'>{settings.website?.currencySymbol} {villa.discountedPrice ? villa.discountedPrice : villa.basePrice}</span><span className='text-sm text-black-300 ml-1'>Per night*</span></p>
                </div>
                {/* Tags */}
                <div className="absolute top-0 right-2 flex gap-3">
                    {/* // Best rated */}
                    {villa.promotion?.bestRated && <div className="bg-black-500 px-2 py-1 rounded-b-lg flex gap-2 items-center w-fit">
                        <span className="w-3 h-3 text-white block" dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>' }}></span>
                        <p className='text-sm text-white font-medium whitespace-nowrap'>Best Rated</p>
                    </div>}
                    {/* // New */}
                    {villa.promotion?.bestRated && <div className="bg-black-500 px-2 py-1 rounded-b-lg flex gap-2 items-center w-fit">
                        <span className="w-4 h-4 text-white block" dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>new-star</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z"></path> </g> </g> </g></svg>' }}></span>
                        <p className='text-sm text-white font-medium'>New</p>
                    </div>}
                    {/* // Other tags */}
                    {Tag && <Tag />}
                </div>
            </Link>
        </div>
    )
}

export default Villa