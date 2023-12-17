import Input from "../Input"
import { twMerge } from "tailwind-merge";
import React, { useState, useEffect, useRef } from 'react';

const Search = ({ updateSearch, placeholder, className, searchOptions, query }) => {
    const [inputValue, setInputValue] = useState(''); // Search Input
    const [searchOption, setSearchOption] = useState('all') // Search option 
    const [searchOptionPlaceholder, setSearchOptionPlaceholder] = useState(searchOptions ? searchOptions[0].placeholder : '') // Search option placeholder
    const timerRef = useRef(null); // Timeout

    // Input chnage [Search input change]
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        clearTimeout(timerRef.current);
        // To add delay of 1/2 seconds after user stops typing
        timerRef.current = setTimeout(() => {
            updateSearch({ searchValue: event.target.value, searchOption: searchOption })
        }, 500);
    };

    // Select change [Search Options change]
    const handleSelectChange = (event) => {
        setSearchOption(event.target.value);
        setSearchOptionPlaceholder(searchOptions.filter((el) => el.value == event.target.value)[0].placeholder)
        if (inputValue != '') {
            clearTimeout(timerRef.current);
            // To add delay of 1/2 seconds after selecting
            timerRef.current = setTimeout(() => {
                updateSearch({ searchValue: inputValue, searchOption: event.target.value })
            }, 100);
        }
    }
    useEffect(() => {
        if (query && query.search && query.searchOption) {
            setInputValue(query.search)
            setSearchOption(query.searchOption)
            updateSearch({ searchValue: query.search, searchOption: query.searchOption })
        }
        return () => {
            clearTimeout(timerRef.current);
        };
    }, []);
    return (
        <div className={twMerge("flex gap-5 items-center", className)}>
            {/* // Search Options */}
            {searchOptions &&
                <select
                    value={searchOption}
                    onChange={(event) => {
                        handleSelectChange(event)
                    }}
                    className='outline-none bg-transparent border border-gray-300 dark:border-black-400 text-black-500 dark:text-white rounded-md block dark:placeholder-black-200 px-3 py-1.5 text-sm'
                >
                    {searchOptions.map((search, index) => (
                        <option key={index} value={search.value} className='bg-white dark:bg-dimBlack text-black dark:text-white'>
                            {search.name}
                        </option>
                    ))}
                </select>
            }
            {/* // Search Input */}
            <Input type="text" variant='input-icon' value={inputValue} onChange={(e) => handleInputChange(e)} className='w-full' inputClassName='px-2 border-none w-full' placeholder={placeholder ? placeholder : searchOptionPlaceholder ? searchOptionPlaceholder : 'Search here...'} icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>'} />
        </div>
    )
}

export default Search