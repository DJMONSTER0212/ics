import React from 'react'
import Select from 'react-select'
import AsyncSelect from "react-select/async";
import { twMerge } from 'tailwind-merge'
import AsyncCreatableSelect from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable';

const SelectInput = ({ options, label, labelClassName, className, isMulti, onChange, defaultValue, value, isSearchable, cacheOptions, defaultOptions, loadOptions, AsyncSelectOn, AsyncCreatableSelectOn, CreatableSelectOn, placeholder, noOptionsMessage, components, optional }) => {
    return (
        <>
            <div className={className}>
                {label && <p className={twMerge('block mb-3 text-base font-medium text-black-500 dark:text-white ', labelClassName)}>{label} {optional && <span className='text-sm ml-1 text-black-300'>Optional</span>}</p>}
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
                    /> : AsyncCreatableSelectOn ?
                        <AsyncCreatableSelect
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
                        /> : CreatableSelectOn ?
                            <CreatableSelect
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