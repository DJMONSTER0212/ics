import React, { useRef } from 'react'
import '@splidejs/react-splide/css';
import Villa from '../../common/Villa';
import Empty from '../../design/Empty';

const SearchVillaResults = ({ villas, currentLocation, loading }) => {
    return (
        <div className='section-lg mt-10'>
            <div className="flex flex-col gap-1 items-start select-none">
                <h2 className='text-xl text-black-500 font-semibold'>Explore villas</h2>
                {currentLocation && currentLocation.name ?
                    <p className='text-base text-black-500 font-normal'><span className='font-medium'>Selected location:</span> {currentLocation.name}</p> :
                    <p className='text-base text-black-500 font-medium'>Discover the Enchanting World of Luxury Villas</p>
                }
            </div>
            {/* Villas */}
            {loading ?
                <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[35px] mt-5'>
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
                </div> :
                <>
                    <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[35px] mt-5'>
                        {villas.map((villa, index) => (
                            <div key={index}>
                                <Villa villa={villa} />
                            </div>
                        ))}
                    </div>
                    {villas.length == 0 && <Empty message='Oops! No villas found for selected location' />}
                </>
            }
        </div>
    )
}

export default SearchVillaResults