import React from 'react'
import { twMerge } from 'tailwind-merge'

const Empty = ({ message, className, messageDescription, children }) => {
    return (
        <>
            {/* <div className={twMerge("flex justify-center my-3 text-center", className)}>
                <p className='text-black-500 dark:text-white text-base font-normal'>{message}</p>
            </div> */}
            <div className={twMerge("flex flex-col gap-2 items-center text-center lg:max-w-[60%] mx-auto", className)}>
                <div className='flex flex-col gap-3 justify-center items-center'>
                    <span className="w-7 h-7 text-black-500 dark:text-white" dangerouslySetInnerHTML={{
                        __html:
                            `<svg xmlns="http://www.w3.org/2000/svg" fill="transparent" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8.976 21C4.055 21 3 19.945 3 15.024m18 0C21 19.945 19.945 21 15.024 21m0-18C19.945 3 21 4.055 21 8.976M8 16a4.993 4.993 0 0 1 4-2c1.636 0 3.088.786 4 2m-7-5.989V10m6 .011V10M3 8.976C3 4.055 4.055 3 8.976 3"/>
                        </svg>`
                    }}></span>
                    <p className='text-black-500 dark:text-white text-xl font-normal'>{message}</p>
                </div>
                {children}
                {messageDescription && <p className='text-black-300 dark:text-black-200 text-lg font-normal'>{messageDescription}</p>}
            </div>
        </>
    )
}

export default Empty