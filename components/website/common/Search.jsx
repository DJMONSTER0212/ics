import React, { useState, useRef, useEffect } from 'react'
import Button from '../design/Button'
import TitleDevider from '../design/TitleDevider'
import Filters from '@/components/website/common/Filters';
import Link from 'next/link';

const Search = ({ setVillas, query, setCurrentLocation, setLoading }) => {
    // Filters
    const [filters, setFilters] = useState({ sortBy: '', bestRated: query?.bestRated == 'true' && true || '', newVilla: query?.new == 'true' && true || '', petAllowed: '' })
    const [selectedLocation, setSelectedLocation] = useState({ id: query?.location || '', name: query?.city || '' })
    // Search Input
    const searchInputRef = useRef(null);
    const [searchValue, setSearchValue] = useState(query?.city || '');
    const timerRef = useRef(null); // Timeout
    // Search Type
    const [searchType, setSearchType] = useState('location')
    // Search Menu 
    const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false)
    // Locations For Search Menu 
    const searchMenuRef = useRef(null);
    const [menuLocations, setMenuLocations] = useState([])

    // Fetch menu villas >>>>>>>>>>>>>>>>>
    const [villaLoading, setVillaLoading] = useState(false)
    const [menuVillas, setMenuVillas] = useState([])
    const menuVillasFetch = async (search) => {
        setVillaLoading(true)
        const response = await fetch(`/api/website/villas?searchByName=${search}`);
        const responseData = await response.json();
        if (responseData.data) {
            // Set data to state
            setMenuVillas(responseData.data)
        }
        setVillaLoading(false)
    }

    // Fetch locations >>>>>>>>>>>>>>>>>
    const [locationLoading, setLocationLoading] = useState(false)
    const [locations, setLocations] = useState([])
    const locationsFetch = async (search) => {
        setLocationLoading(true)
        const response = await fetch(`/api/website/locations`);
        const responseData = await response.json();
        if (responseData.data) {
            // Set data to state
            setLocations(responseData.data)
            setMenuLocations(responseData.data)
        }
        setLocationLoading(false)
    }

    // To manage search input >>>>>>>>>>>>>>>>>
    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
        clearTimeout(timerRef.current);
        // To add delay of 1/2 seconds after searching
        timerRef.current = setTimeout(() => {
            if (searchType == 'location') {
                const filteredLocations = locations.filter(location =>
                    location.name.toLowerCase().includes(event.target.value.toLowerCase())
                );
                setMenuLocations(filteredLocations)
            } else {
                if (event.target.value != '') {
                    menuVillasFetch(event.target.value.toLowerCase())
                }
            }
        }, 80);

    }

    // To manage search type change
    const updateSearchType = (searchType) => {
        setSearchType(searchType);
        if (searchType == 'location') {
            const filteredLocations = locations.filter(location =>
                location.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setMenuLocations(filteredLocations)
        } else {
            if (searchValue) {
                menuVillasFetch(searchValue.toLowerCase())
            }
        }
    }

    // To manage location change >>>>>>>>>>>>>>>>>
    const handelLocationChange = async (id, name) => {
        setSelectedLocation({ id, name })
        setCurrentLocation({ id, name })
        setSearchValue(name)
    }

    // To open search result >>>>>>>>>>>>>>>>>
    const openMenu = () => {
        setIsSearchMenuOpen(true);
        if (searchInputRef.current) {
            const windowHeight = window.innerHeight;
            const targetRect = searchInputRef.current.getBoundingClientRect();
            const targetTop = targetRect.top;
            const desiredScrollPosition = targetTop - (windowHeight * 0.2); // Adjust the percentage as needed
            if (desiredScrollPosition > 250) {
                window.scrollTo({ top: desiredScrollPosition, behavior: 'smooth' });
            }
        }
    };

    // To close search result >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchMenuRef.current && !searchMenuRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
                setIsSearchMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // To fetch default locations >>>>>>>>>>>>>>>>>
    useEffect(() => {
        locationsFetch()
    }, [])

    // To fetch villas >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVillas = async () => {
            setLoading(true)
            const { sortBy, bestRated, newVilla, petAllowed } = filters;
            const { id } = selectedLocation;
            const response = await fetch(`/api/website/villas?locationId=${id}&sortByPrice=${sortBy}&bestRated=${bestRated}&new=${newVilla}&petAllowed=${petAllowed}`);
            const responseData = await response.json();
            if (responseData.data) {
                // Set data to state
                setVillas(responseData.data);
            }
            setLoading(false)
        }
        fetchVillas()
    }, [filters, selectedLocation, setVillas, setLoading])
    return (
        <div className="section-lg mt-20">
            <div className="flex flex-col md:flex-row gap-5 md:items-center relative">
                {/* // Select location */}
                <div className="bg-white flex flex-col xs:flex-row gap-x-5 gap-y-2 xs:items-center rounded-md mt-2 border border-gray-300 px-3 py-1 w-full xs:w-full">
                    {/* // Select location */}
                    <div className="flex-1 relative bg-white flex flex-col xs:flex-row gap-x-5 gap-y-2 xs:items-center rounded-md w-full md:w-fit md:min-w-[350px] ">
                        <div className="flex gap-5 items-center flex-1">
                            <div className="flex justify-center items-center">
                                <span className={`transition-all duration-500 w-6 h-6 text-black-500 block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-geo-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>' }}></span>
                            </div>
                            <div className="flex flex-col justify-start items-start w-full" onClick={() => { searchInputRef.current.focus() }} onFocus={() => { openMenu() }} >
                                <p className='text-base text-black-500 font-medium -mb-1.5'>Select a location or villa</p>
                                <input type="text" value={searchValue} onChange={(e) => handleInputChange(e)} placeholder='Search here...' ref={searchInputRef} className='w-full py-1.5 bg-transparent outline-none border-none text-black-500 text-base font-normal placeholder:text-black-300' />
                            </div>
                            {/* // Search result */}
                            <div ref={searchMenuRef} className={`${isSearchMenuOpen ? 'py-2 border w-full max-w-[450px] transition-all duration-200' : 'w-full max-w-[450px] h-0 overflow-hidden border-none py-0 transition-all duration-200'} absolute z-10 left-0 top-16 mt-1 bg-white rounded-md border border-gray-300 min-w-[300px] select-none px-0`}>
                                <div className="flex gap-0 items-center bg-gray-100 rounded-md w-fit mx-2">
                                    <Button variant={searchType == 'location' ? 'primary' : 'secondary'} onClick={() => updateSearchType('location')} label='Locations' className={`${searchType == 'location' && 'h-full bg-black-500 text-white hover:bg-black-500/90'} w-fit py-1 px-3`} />
                                    <Button variant={searchType == 'villa' ? 'primary' : 'secondary'} onClick={() => updateSearchType('villa')} label='Villas' className={`${searchType == 'villa' && 'h-full bg-black-500 text-white hover:bg-black-500/90'} w-fit px-2 py-1`} />
                                </div>
                                <TitleDevider title='Search results' className='my-3 mx-2' titleClassName='text-black-500' />
                                {/* // Locations */}
                                {searchType == 'location' && <div className="grid gap-0 grid-cols-1 max-h-[40vh] overflow-auto overscroll-contain">
                                    {locationLoading ?
                                        <div className="flex gap-3 items-center group hover:bg-gray-100 py-1 px-2 cursor-pointer animate-pulse">
                                            <div className="w-5 h-5 bg-gray-200 rounded-sm"></div>
                                            <div className='w-[50%] h-3 bg-gray-200 rounded-sm'></div>
                                        </div>
                                        : menuLocations.length == 0 ?
                                            <div className="flex gap-3 items-center py-1 px-2 cursor-pointer">
                                                <div className='text-black-300'>No location found</div>
                                            </div> :
                                            menuLocations.map((location, index) => (
                                                <div onClick={() => handelLocationChange(location._id, location.name)} key={index} className="flex gap-3 items-center group hover:bg-gray-100 py-1 px-2 cursor-pointer">
                                                    <span className={`transition-all duration-500 w-5 h-5 text-black-500 block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-geo-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>' }}></span>
                                                    <p className='text-base text-black-500 font-normal'>{location.name}</p>
                                                </div>
                                            ))}
                                </div>}
                                {/* // Villas */}
                                {searchType == 'villa' && <div className="grid gap-0 grid-cols-1 max-h-[40vh] overflow-auto overscroll-contain">
                                    {villaLoading ?
                                        <div className="flex gap-3 items-center group hover:bg-gray-100 py-1 px-2 cursor-pointer animate-pulse">
                                            <div className="w-5 h-5 bg-gray-200 rounded-sm"></div>
                                            <div className='flex flex-col gap-3 items-start w-full'>
                                                <div className='w-[50%] h-3 bg-gray-200 rounded-sm'></div>
                                                <div className='w-[20%] h-2 bg-gray-200 rounded-sm'></div>
                                            </div>
                                        </div>
                                        : menuVillas.length == 0 ?
                                            <div className="flex gap-3 items-center py-1 px-2 cursor-pointer">
                                                <div className='text-black-300'>{searchValue ? 'No villa found' : 'Please type to search villas'}</div>
                                            </div> : menuVillas.map((villa, index) => (
                                                <Link href={`/villa/${villa._id}/${villa.slug}`} key={index} className="flex gap-3 items-center group hover:bg-gray-100 py-1 px-2 cursor-pointer">
                                                    <span className={`transition-all duration-500 w-5 h-5 text-black-500 block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z"/></svg>' }}></span>
                                                    <div className='flex flex-col items-start'>
                                                        <p className='text-base text-black-500 font-normal'>{villa.name}</p>
                                                        <p className='text-sm text-black-300'>{villa.location.name}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                        {/* <Button label='Search' className='h-full bg-black-500 text-white hover:bg-black-500/90' /> */}
                        <Filters filters={filters} setFilters={setFilters} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search