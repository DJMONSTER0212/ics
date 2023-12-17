import React from 'react'
import { twMerge } from 'tailwind-merge'

const Success = ({ success, className }) => {
    return (
        <div className={twMerge('px-4 py-2 mb-6 text-base font-medium text-green-800 rounded-md bg-green-200 dark:bg-gray-800 dark:text-green-400', className)}>
            <span className="font-medium">{success}</span>
        </div>
    )
}

export default Success