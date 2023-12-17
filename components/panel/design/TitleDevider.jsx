import React from 'react'
import { twMerge } from 'tailwind-merge'

const TitleDevider = ({ className, titleClassName, lineClassName, title }) => {
    return (
        <div className={twMerge('flex gap-5 items-center', className)}><p className={twMerge('text-black-300 dark:text-black-200', titleClassName)}>{title}</p><div className={twMerge('flex-1 h-[0.5px] bg-gray-300 dark:bg-black-400', lineClassName)}></div></div>
    )
}

export default TitleDevider