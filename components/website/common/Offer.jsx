import React, { useState } from 'react'
import moment from 'moment'

const Offer = ({ offer }) => {
    const [isCopied, setIsCopied] = useState(false)
    return (
        <div className="flex flex-col justify-between bg-gradient-to-bl from-primary-500/80 to-secondary-500 border border-gray-200 rounded-md py-4 px-6 h-full">
            <span className='w-14 h-10 text-primary-400' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 64 64" id="Flat" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect height="32" rx="4" ry="4" style="fill:#fff" width="58" x="3" y="16"></rect><polygon points="3 28 23 48 17 48 3 34 3 28" style="fill:#191919"></polygon><polygon points="41 16 61 36 61 30 47 16 41 16" style="fill:#191919"></polygon><rect height="16" style="fill:#3D82F5" width="18" x="23" y="25"></rect><polygon points="32 22 27 21 27 25 32 25 37 25 37 21 32 22" style="fill:#f7cc38"></polygon><rect height="16" style="fill:#f7cc38" width="2" x="31" y="25"></rect><rect height="2" style="fill:#f7cc38" width="18" x="23" y="32"></rect></g></svg>' }}></span>
            <p className='text-base text-white font-normal mt-3 flex-1'>{offer.shortDesc}</p>
            <div>
                <p className='text-sm text-white font-normal mt-3'>Expires on {moment(offer.expirationDate).format('DD MMMM YYYY')}</p>
                <div className="flex flex-wrap gap-5 justify-between items-center mt-2 bg-gray-100 hover:bg-gray-100 pl-4 pr-2 py-2 rounded-md">
                    <p className='font-medium text-black-500'>{offer.code}</p>
                    <p onClick={() => { navigator.clipboard.writeText(offer.code); setIsCopied(true) }} className='cursor-pointer text-base text-white hover:text-white bg-black-500 hover:bg-black-500 border border-black-500 px-2 py-1 rounded-md flex gap-1 items-center'>{isCopied ? 'Copied' : 'Copy'}</p>
                </div>
            </div>
        </div>
    )
}

export default Offer