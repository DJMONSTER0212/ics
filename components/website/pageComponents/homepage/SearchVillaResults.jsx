import React, { useRef } from 'react'
import '@splidejs/react-splide/css';
import Villa from '../../common/Villa';
const SearchVillaResults = ({ villas }) => {
    return (
        <div className='section-lg mt-10'>
            {/* Villas */}
            <div className="flex justify-between items-center select-none">
                <h2 className='text-xl text-black-500 font-semibold'>Search results</h2>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[35px] mt-5">
                {villas.slice(0, 4).map((property, index) => (
                    <Villa key={index} villa={property} />
                ))}
            </div>
        </div>
    )
}

export default SearchVillaResults