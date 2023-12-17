import React from 'react'
import Button from '@/components/panel/design/Button'

const TabButton = ({ onClick, label, tabName, activeTab }) => {
    return (
        <>
            <div onClick={onClick} className="group flex items-center gap-2 cursor-pointer">
                <div className={`${activeTab == tabName ? 'w-1 transition-all' : 'w-0 transition-all'} bg-primary-500 h-full rounded-md min-h-[20px]`}></div>
                <p className={`text-lg ${activeTab == tabName ? 'text-primary-500 dark:text-primary-400' : 'text-black-500 dark:text-white'} group-hover:text-primary-500 dark:group-hover:text-primary-400 font-regular`}>{label}</p>
            </div>
        </>
    )
}

export default TabButton