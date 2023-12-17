import React from 'react';
import { twMerge } from 'tailwind-merge'
import { Controller } from 'react-hook-form';

const Toggle = ({ label, name, control, defaultValue, className, labelClassName, rules }) => {
    let labelClassNames = 'block text-base font-medium text-black-500 dark:text-white ';
    return (
        <div className={twMerge('w-full flex justify-between items-center gap-5', className)}>
            {label && <label className={twMerge(labelClassNames, labelClassName)}>{label}</label>}
            <div className="relative flex items-center">
                <Controller
                    control={control}
                    name={name}
                    defaultValue={defaultValue}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <input
                            type="checkbox"
                            id={name}
                            name={name}
                            className={`toggle-checkbox absolute block w-3 h-3 top-[50%] translate-y-[-50%] rounded-full ${value ? 'bg-primary-500 dark:bg-primary-400 translate-x-8 transition-all duration-200' : 'bg-white translate-x-1 transition-all duration-200'} appearance-none cursor-pointer`}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            checked={value && true}
                        />
                    )}
                />
                <label
                    htmlFor={name}
                    className="toggle-label block overflow-hidden h-5 w-12 rounded-full bg-gray-200 dark:bg-black-400 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default Toggle;
