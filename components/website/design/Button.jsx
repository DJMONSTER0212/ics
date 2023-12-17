import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Button = forwardRef(({ variant, label, icon, onClick, type, className, disabled, labelClassName, iconClassname, loading }, ref) => {
    let classNames = `${(disabled || loading) && 'cursor-not-allowed'} ${(disabled) && 'opacity-50'} font-medium rounded-md text-base w-full text-center flex gap-5 items-center justify-center `;
    switch (variant) {
        case 'primary':
            classNames += `px-6 py-2 text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 `
            break;
        case 'secondary':
            classNames += 'px-6 py-2 text-black-500 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-black-400 dark:hover:bg-black-500'
            break;
        case 'primary-icon':
            classNames += `px-6 py-2 flex ${label && 'gap-3'} items-center justify-center text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 `
            break;
        case 'secondary-icon':
            classNames += `px-6 py-2 flex ${label && 'gap-3'} items-center justify-center text-black-500 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-black-400 dark:hover:bg-black-500 `
            break;
        default:
            classNames += 'px-6 py-2 text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 '
            break;
    }
    return (
        <>
            <button ref={ref} type={type} className={twMerge(classNames, className)} onClick={onClick} disabled={disabled}>
                {loading && <span className={twMerge("w-4 h-4 animate-spin", iconClassname)} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" className="hds-flight-icon--animation-loading" viewBox="0 0 16 16"><g fill="#ffffff" fill-rule="evenodd" clip-rule="evenodd"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" opacity=".2"/><path d="M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z"/></g></svg>' }}></span>}
                {!loading && icon && (
                    <span className={twMerge("w-4 h-4", iconClassname)} dangerouslySetInnerHTML={{ __html: icon }}></span>
                )}
                {label && <span className={labelClassName}>{label}</span>}
            </button>
        </>
    )
})

Button.displayName = 'Button';

export default Button