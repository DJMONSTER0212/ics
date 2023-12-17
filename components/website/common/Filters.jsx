import React, { useEffect, useState, useRef } from 'react'
import Button from '../design/Button'
import TitleDevider from '../design/TitleDevider'

const Filters = ({ filters, setFilters }) => {
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const [values, setValues] = useState({ ...filters })
    // handler for sort by
    const handleSortByChange = (event) => {
        setValues({ ...values, sortBy: event.target.value });
    };
    // To close menu >>>>>>>>>>>>>>>>>
    const filterBtnRef = useRef(null)
    const filterMenuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target) && !filterBtnRef.current.contains(event.target)) {
                setIsOpenMenu(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (
        <>
            <Button ref={filterBtnRef} onClick={() => setIsOpenMenu(!isOpenMenu)} variant='secondary-icon' label={`Filters`} icon='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16"><path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/></svg>' />
            <div ref={filterMenuRef} className={`${isOpenMenu ? 'transition-all duration-200 py-2 h-fit w-full xs:w-fit' : 'h-0 overflow-hidden py-0 border-none transition-all duration-200 '} absolute z-10 right-0 top-32 xs:top-20 w-fit bg-white rounded-md border border-gray-300 px-2 select-none`} >
                {/* // Sort */}
                <TitleDevider title='Sort by price' className='mb-2' titleClassName='text-base text-black-500 font-medium' />
                <div className="mt-2 flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                        <input type="radio" name="sortBy" id="sortBy1" value={'priceDes'} checked={values.sortBy == 'priceDes'} onChange={handleSortByChange} className='accent-black-500' />
                        <label htmlFor="sortBy1" className='text-sm text-black-500'>High to Low</label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="radio" name="sortBy" id="sortBy2" value={'priceAsc'} checked={values.sortBy == 'priceAsc'} onChange={handleSortByChange} className='accent-black-500' />
                        <label htmlFor="sortBy2" className='text-sm text-black-500'>Low to High</label>
                    </div>
                </div>
                {/* // Filter */}
                <TitleDevider title='Filters' className='mt-2' titleClassName='text-base text-black-500 font-medium' />
                <div className="mt-2 flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                        <input type="checkbox" name="new" id="new" value={true} checked={values.newVilla == 'true' || values.newVilla == true} onChange={(e) => setValues({ ...values, newVilla: values.newVilla ? values.newVilla == 'true' ? 'false' : 'true' : e.target.value })} className='accent-black-500 w-4 h-4' />
                        <label htmlFor="new" className='text-sm text-black-500'>New</label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="checkbox" name="bestRated" id="bestRated" value={true} checked={values.bestRated == 'true' || values.bestRated == true} onChange={(e) => setValues({ ...values, bestRated: values.bestRated ? values.bestRated == 'true' ? 'false' : 'true' : e.target.value })} className='accent-black-500 w-4 h-4' />
                        <label htmlFor="bestRated" className='text-sm text-black-500'>Best rated</label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="checkbox" name="petAllowed" id="petAllowed" value={true} checked={values.petAllowed == 'true' || values.petAllowed == true} onChange={(e) => setValues({ ...values, petAllowed: values.petAllowed ? values.petAllowed == 'true' ? 'false' : 'true' : e.target.value })} className='accent-black-500 w-4 h-4' />
                        <label htmlFor="petAllowed" className='text-sm text-black-500'>Pets allowed</label>
                    </div>
                </div>
                <div className="flex gap-2 justify-center items-center mt-3">
                    <Button variant='secondary' label='Clear' onClick={() => { setFilters({}); setValues({}); }} />
                    <Button disabled={filters == values} label={filters == values ? 'Applied' : 'Apply'} onClick={() => { setFilters(values); }} className={`${filters == values ? 'bg-gray-200 hover:bg-gray-200 text-black-200' : 'bg-black-500 text-white hover:bg-black-500/90'} h-full`} />
                </div>
            </div>
        </>
    )
}

export default Filters