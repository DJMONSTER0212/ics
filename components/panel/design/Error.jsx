import React from 'react'
import { twMerge } from 'tailwind-merge'

const Error = ({ error, className }) => {
    return (
        <div className={twMerge("px-4 py-2.5 mb-6 text-base font-medium text-red-800 rounded-md bg-red-100 dark:bg-gray-800 dark:text-red-400", className)} role="alert">
            <span className="font-medium">{error}</span>
        </div>
    )
}

export default Error