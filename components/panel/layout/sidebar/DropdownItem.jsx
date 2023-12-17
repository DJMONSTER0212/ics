import React, { useState } from 'react'
import Link from 'next/link';

const DropdownItem = ({ title, icon, subItems, routerPath, path, setSidebarOpen }) => {
    const [isOpen, setIsOpen] = useState(false); // Dropdown
    // For dropdown
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className='select-none'>
            {/* // Title */}
            <div className="group flex items-center gap-2 cursor-pointer" onClick={toggleMenu}>
                <div className={`${routerPath.includes(path) ? 'w-1 transition-all' : 'w-0 transition-all'} bg-primary-500 h-full rounded-md min-h-[20px]`}></div>
                <span className={`w-5 h-5 mr-2 ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400 font-medium' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400`} dangerouslySetInnerHTML={{ __html: icon }}></span>
                <p className={`flex-1 text-base ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400 font-medium' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400 font-regular`}>{title}</p>
                <span className={`w-5 h-5 ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400 font-medium' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400 ${isOpen ? '-rotate-180 transition-all' : 'rotate-0 transition-all'}`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>' }}></span>
            </div>
            {/* // Dropdown items */}
            <div className={`${isOpen ? 'h-auto opacity-100 transition-all duration-200 py-3 mt-3' : 'opacity-0 h-0 overflow-hidden py-0 transition-all duration-200'} grid grid-cols-1 gap-4 ml-5 bg-gray-100 dark:bg-black-400 rounded-md`}>
                {subItems.map((item, index) => (
                    <Link key={index} onClick={() => setSidebarOpen(false)} href={item.path} className="px-5 group flex items-center">
                        <p className={`text-base ${routerPath == item.path ? 'text-primary-500 dark:text-primary-400 font-medium' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400 font-regular`}>{item.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default DropdownItem