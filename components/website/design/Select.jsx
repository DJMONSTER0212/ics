import React from 'react'
import Select from 'react-select'
import AsyncSelect from "react-select/async";
import { twMerge } from 'tailwind-merge'

const SelectInput = ({ options, label, labelClassName, className, isMulti, onChange, defaultValue, value, isSearchable, cacheOptions, defaultOptions, loadOptions, AsyncSelectOn, placeholder, noOptionsMessage, components }) => {
    return (
        <>
            <div className={className}>
                {label && <p className={twMerge('block mb-3 text-base font-medium text-black-500 dark:text-white ', labelClassName)}>{label}</p>}
                {AsyncSelectOn ?
                    <AsyncSelect
                        cacheOptions={cacheOptions}
                        defaultOptions={defaultOptions}
                        loadOptions={loadOptions}
                        options={options}
                        className="my-react-select-container"
                        classNamePrefix="my-react-select"
                        isMulti={isMulti}
                        placeholder={placeholder ? placeholder : 'Selecttytyty..'}
                        noOptionsMessage={noOptionsMessage}
                        onChange={onChange}
                        defaultValue={defaultValue}
                        value={value}
                        isSearchable={isSearchable}
                        components={components}
                    /> :
                    <Select
                        cacheOptions={cacheOptions}
                        options={options}
                        className="my-react-select-container"
                        classNamePrefix="my-react-select"
                        isMulti={isMulti}
                        placeholder={placeholder ? placeholder : 'Select..'}
                        noOptionsMessage={noOptionsMessage}
                        onChange={onChange}
                        defaultValue={defaultValue}
                        value={value}
                        isSearchable={isSearchable}
                        components={components}
                    />
                }
            </div>
        </>
    )
}

export default SelectInput