import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const VillaImages = ({ images }) => {
    const [openImageDownbar, setOpenImageDownbar] = useState(false)
    // To close image downbar >>>>>>>>>>>>>>>>>>
    const downbarRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (downbarRef.current && !downbarRef.current.contains(event.target)) {
                setOpenImageDownbar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <>
            {/* // Image gallery */}
            <div className="grid grid-cols-1 xs:grid-cols-3 md:grid-cols-4 gap-3 relative">
                <div className="xs:col-span-2">
                    <Image src={images[0]} loading="eager" height={700} width={700} alt='Villa' className='aspect-[4/3] bg-gray-200 rounded-md' />
                </div>
                <div className="hidden xs:grid gap-3 grid-cols-1">
                    {images.slice(1, 3).map((image, index) => (
                        <Image key={index} src={image} loading="eager" height={500} width={500} alt='Villa' className='aspect-[4/3] bg-gray-200 rounded-md' />
                    ))}
                </div>
                <div className="hidden md:grid gap-3 grid-cols-1">
                    {images.slice(3, 5).map((image, index) => (
                        <Image key={index} src={image} loading="eager" height={500} width={500} alt='Villa' className='aspect-[4/3] bg-gray-200 rounded-md' />
                    ))}
                </div>
                <p onClick={() => setOpenImageDownbar(!openImageDownbar)} className='select-none cursor-pointer flex gap-2 items-center absolute bottom-2 left-2 bg-white py-1 px-2 border border-black-500 rounded-md text-sm text-black-500 font-normal mr-0.5'><span className='text-black-500 w-5 h-5 block' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>' }}></span> View all {images.length} images</p>
            </div>
            {/* // Image downbar */}
            <div className={`${openImageDownbar ? 'w-full bg-black-500/40 transition-all duration-200 h-screen' : 'h-screen w-full opacity-0 invisible transition-all duration-200'} fixed right-0 left-0 mx-auto top-0 z-20`}>
                <div ref={downbarRef} className={`${openImageDownbar ? 'w-[calc(100%-20px)] lg:w-[50%] px-4 transition-all duration-200 h-[80vh] lg:h-[95vh] pb-20 lg:pb-2' : 'h-0 w-0 border-none overflow-hidden px-0 transition-all duration-200'} fixed right-0 left-0 mx-auto bottom-0 bg-white border border-gray-300 overflow-auto rounded-md`}>
                    {/* Title */}
                    <div className="flex items-center justify-between bg-white py-2 sticky top-0">
                        <p className='flex gap-2 items-center bg-white py-1 px-2 rounded-md text-base text-black-500 font-medium'><span className='text-black-500 w-5 h-5 block' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>' }}></span> 7 Images</p>
                        <span onClick={() => setOpenImageDownbar(false)} className='bg-gray-200 hover:bg-gray-300 p-1 rounded-md cursor-pointer text-black-500 w-7 h-7 block' title='Close' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>' }}></span>
                    </div>
                    {/* Images */}
                    <div className="grid grid-cols-1 justify-center items-center gap-3 mt-5">
                        {images.map((image, index) => (
                            <Image key={index} src={image} height={1000} width={1000} alt='Villa' className='aspect-[4/3] bg-gray-200 rounded-md mx-auto' />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default VillaImages