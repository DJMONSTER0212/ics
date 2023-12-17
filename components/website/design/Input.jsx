import { twMerge } from 'tailwind-merge'
import React from 'react'

const Input = ({ step, label, name, type, accept, multiple, value, onChange, onKeyDown, onKeyUp, placeholder, required, className, labelClassName, inputClassName, variant, icon, defaultValue, min, max, register, validationOptions, optional, maxLength }) => {
    let labelClassNames = 'block mb-2 text-base font-medium text-black-500 ';
    let inputClassNames = 'outline-none bg-gray-100 text-black-500 dark:text-white text-base rounded-md block w-full px-3 py-1.5 placeholder-black-300 '
    let registerValue; // For React hook form
    register ? registerValue = { ...register(name, validationOptions) } : ''
    switch (variant) {
        case 'input-icon':
            return (
                <>
                    <div className={className}>
                        {label && <label htmlFor={name} className={twMerge(labelClassNames, labelClassName)}>{label} {optional && <span className='text-sm ml-1 text-black-300'>Optional</span>}</label>}
                        <div className="flex items-center">
                            {icon && (
                                <span className="w-4 h-4 mr-2 -ml-1 text-black-500 dark:text-white" dangerouslySetInnerHTML={{ __html: icon }}></span>
                            )}
                            <input step={step} maxLength={maxLength} type={type} accept={accept} multiple={multiple} value={value} defaultValue={defaultValue} min={min} max={max} onChange={onChange} onKeyUp={onKeyUp} onKeyDown={onKeyDown} {...registerValue} id={name} name={name} className={twMerge(inputClassNames, inputClassName)} placeholder={placeholder} required={required} />
                            {maxLength && <p className='text-sm mt-1 text-black-300'>Max. characters: {maxLength}</p>}
                        </div>
                    </div>
                </>
            )

        default:
            return (
                <>
                    <div className={className}>
                        {label && <label htmlFor={name} className={twMerge(labelClassNames, labelClassName)}>{label} {optional && <span className='text-sm ml-1 text-black-300'>Optional</span>}</label>}
                        <input step={step} maxLength={maxLength} type={type} accept={accept} multiple={multiple} value={value} defaultValue={defaultValue} min={min} max={max} onChange={onChange} onKeyUp={onKeyUp} onKeyDown={onKeyDown} {...registerValue} id={name} name={name} className={twMerge(inputClassNames, inputClassName)} placeholder={placeholder} required={required} />
                        {maxLength && <p className='text-sm mt-1 text-black-300'>Max. characters: {maxLength}</p>}
                    </div>
                </>
            )
    }
}

export default Input