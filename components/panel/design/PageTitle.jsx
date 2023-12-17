import React from 'react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

const PageTitle = ({ loading, title, breadcrumbs, className }) => {
    return (
        <>
            {loading ?
                <div className={twMerge(`flex flex-col gap-2 w-full pt-5 bg-white dark:bg-black-600`, className)}>
                    {breadcrumbs && <div className="flex flex-wrap gap-2 items-center">
                        {loading && <div className="bg-gray-200 dark:bg-black-400 h-2 w-14 rounded-md animate-pulse"></div>}
                        {loading && <div className="text-gray-200 dark:text-black-400 animate-pulse">/</div>}
                        {loading && <div className="bg-gray-200 dark:bg-black-400 h-2 w-14 rounded-md animate-pulse"></div>}
                        {loading && <div className="text-gray-200 dark:text-black-400 animate-pulse">/</div>}
                        {loading && <div className="bg-gray-200 dark:bg-black-400 h-2 w-14 rounded-md animate-pulse"></div>}
                    </div>}
                    {loading && <div className="bg-gray-200 dark:bg-black-400 h-6 w-28 rounded-md animate-pulse"></div>}
                </div> :
                <div className={twMerge(`flex flex-col gap-2 w-full pt-5 bg-white dark:bg-black-600`, className)}>
                    {breadcrumbs && breadcrumbs.length > 1 && <div className="flex flex-wrap gap-2 items-center">
                        {breadcrumbs.map((breadcrumb, index) => (
                            index == breadcrumbs.length - 1 ?
                                <p key={index} className="text-sm font-medium text-black-500 dark:text-white">{breadcrumb.title}</p>
                                :
                                <div key={index} className="flex gap-2">
                                    {breadcrumb.url ? <Link href={breadcrumb.url}><p className="text-sm font-normal text-gray-600 dark:text-gray-400">{breadcrumb.title}</p></Link> :
                                        <p><p className="text-sm font-normal text-gray-600 dark:text-gray-400">{breadcrumb.title}</p></p>
                                    }
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">/</p>
                                </div>
                        ))}
                    </div>}
                    <h2 className={`${breadcrumbs && breadcrumbs.length > 1 ? 'text-xl' : 'text-2xl'} font-medium text-gray-800 dark:text-white flex gap-2 items-center line-clamp-1`}>{title || breadcrumbs && breadcrumbs.length > 1 && breadcrumbs[breadcrumbs.length - 1].title}</h2>
                </div>
            }
        </>
    )
}

export default PageTitle