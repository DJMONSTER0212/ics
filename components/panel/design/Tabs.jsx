import React from 'react'

const Tabs = ({ children }) => {
    return (
        <div className="flex gap-x-4 gap-y-2 sm:flex-wrap items-center w-full whitespace-nowrap overflow-auto no-scrollbar h-full">
            {children}
        </div>
    )
}

export default Tabs