import React from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';

const Tabs = () => {
    return (
        <Splide hasTrack={false}
            options={{
                width: '100%',
                gap: '15px',
                arrows: true,
                pagination: false,
                className: 'z-10',
                perPage: 4,
            }}>
            <SplideTrack className="flex gap-x-3 mt-5 overflow-y-hidden overflow-x-auto no-scrollbar">
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-white hover:text-white bg-black-500 hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Jaipur</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-transparent hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Udaipur</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-transparent hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Mumbai</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-transparent hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Manali</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-transparent hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Explore all</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-white hover:text-white bg-black-500 hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Jaipur</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-transparent hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Udaipur</p></SplideSlide>
                <SplideSlide><p className='whitespace-nowrap cursor-pointer text-base text-black-300 hover:text-white bg-transparent hover:bg-black-500 border border-gray-200 px-2 py-1 rounded-md'>Mumbai</p></SplideSlide>
            </SplideTrack>
        </Splide>
    )
}

export default Tabs