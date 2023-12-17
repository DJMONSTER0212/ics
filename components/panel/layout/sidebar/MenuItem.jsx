import React from 'react'
import Link from 'next/link'
import DropdownItem from './DropdownItem'

const MenuItem = ({ variant, title, icon, message, path, routerPath, subItems, setSidebarOpen }) => {
    return (
        <>
            {variant == 'normal' &&
                <Link href={path} onClick={() => setSidebarOpen(false)} className="group flex items-center gap-2">
                    <div className={`${routerPath.includes(path) ? 'w-1 transition-all' : 'w-0 transition-all'} bg-primary-500 h-full rounded-md min-h-[20px]`}></div>
                    <span className={`w-5 h-5 mr-2 ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400`} dangerouslySetInnerHTML={{ __html: icon }}></span>
                    <p className={`text-base ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400 font-medium' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400 font-regular`}>{title}</p>
                </Link>
            }
            {variant == 'withMessage' &&
                <Link href={path} onClick={() => setSidebarOpen(false)} className="group flex items-center gap-2">
                    <div className={`${routerPath.includes(path) ? 'w-1 transition-all' : 'w-0 transition-all'} bg-primary-500 h-full rounded-md min-h-[20px]`}></div>
                    <span className={`w-5 h-5 mr-2 ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400`} dangerouslySetInnerHTML={{ __html: icon }}></span>
                    <p className={`flex-1 text-base ${routerPath.includes(path) ? 'text-primary-500 dark:text-primary-400' : 'text-black-300 dark:text-black-200'} group-hover:text-primary-500 dark:group-hover:text-primary-400 font-regular`}>{title}</p>
                    <span className='py-[2px] px-2 bg-primary-500 dark:bg-primary-400 rounded text-xs text-primary-400'>{message}</span>
                </Link>
            }
            {variant == 'dropdown' &&
                <DropdownItem title={title} setSidebarOpen={setSidebarOpen} icon={icon} subItems={subItems} routerPath={routerPath} path={path} />
            }
        </>
    )
}

export default MenuItem