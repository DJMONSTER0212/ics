import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, } from 'react'
import TableStrcture from '@/components/panel/design/table/TableStructure'
import Pagignation from '@/components/panel/design/table/Pagignation'
import Search from '@/components/panel/design/table/Search'
import Loader from '../Loader'
import Empty from './Empty'

const Table = forwardRef(({ columns, url, placeholder, disableSearch, disablePagignation, children, searchOptions, query }, ref) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [empty, setEmpty] = useState(false)
    const [fetchAgain, setFetchAgain] = useState(false)
    const pageCount = useRef(0)
    const pageSize = useRef(50)
    const search = useRef('')

    // Why not useState To avoid re fetch because of current page update after fetching the data
    const updatePageSize = (newPageSize) => {
        pageSize.current = newPageSize;
        if (currentPage == 0) {
            setFetchAgain(!fetchAgain)
        } else {
            setCurrentPage(0)
        }
    }

    // Why not useState To avoid re fetch because of current page update after fetching the data
    const updateSearch = ({ searchValue, searchOption }) => {
        search.current = { searchValue, searchOption }
        if (currentPage == 0) {
            setFetchAgain(!fetchAgain)
        } else {
            setCurrentPage(0)
        }
    }
    // To fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            let apiUrl;
            if (search.current) {
                apiUrl = `${url}searchOption=${search.current.searchOption}&search=${search.current.searchValue}&pageIndex=${currentPage}&maxResult=${pageSize.current}`
            } else {
                apiUrl = `${url}pageIndex=${currentPage}&maxResult=${pageSize.current}`;
            }
            const fetchData = await fetch(apiUrl, {
                headers: {
                    'Content-Type': "application/json",
                }
            })
            const responseData = await fetchData.json();
            responseData.totalRow == 0 ? setEmpty(true) : setEmpty(false)
            if (responseData.data) {
                setData(responseData.data)
            } else {
                setEmpty(true)
                setData([])
            }
            pageCount.current = Math.ceil(responseData.totalRow / pageSize.current)
            setCurrentPage(currentPage)
            setLoading(false)
            window.scrollTo(0, 0);
        }
        fetchData()
    }, [currentPage, url, fetchAgain])

    // To refetch data if needed in parent component for example on edit or update the data
    useImperativeHandle(ref, () => ({
        reFetch() {
            setFetchAgain(!fetchAgain)
        }
    }));
    return (
        <>
            <div className='flex flex-col justify-start items-start lg:flex-row gap-2 lg:justify-between lg:items-center'>
                {!disableSearch &&
                    <Search
                        searchOptions={searchOptions}
                        updateSearch={updateSearch}
                        placeholder={placeholder}
                        fetch={fetchAgain}
                        className={children ? 'w-full lg:w-1/2' : 'w-full'}
                        query={query}
                    />
                }
                {children}
            </div>
            <TableStrcture
                columns={columns}
                data={data}
                loading={loading}
            // empty={empty}
            />
            {/* {loading && <Loader className='my-10' />} */}
            {empty && <Empty />}
            {!disablePagignation &&
                <Pagignation
                    pageCount={pageCount.current}
                    pageSize={pageSize.current}
                    updatePageSize={updatePageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            }
        </>
    )
})

Table.displayName = "Table";
export default Table