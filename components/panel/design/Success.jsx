import React from 'react'

const Success = ({ success }) => {
    return (
        <div className="px-4 py-2.5 mb-6 text-base font-medium text-green-800 rounded-md bg-green-200 dark:bg-gray-800 dark:text-green-400" role="alert">
            <span className="font-medium">{success}</span>
        </div>
    )
}

export default Success