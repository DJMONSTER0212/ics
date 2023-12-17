import React, { useMemo, memo } from 'react'
import { useTable, useSortBy } from "react-table";
import { twMerge } from 'tailwind-merge';

const TableStructure = ({ columns, data, loading }) => {
    const columnData = useMemo(() => columns, [columns]);
    const rowData = useMemo(() => data, [data]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: columnData,
        data: rowData,
    }, useSortBy);
    return (
        <>
            <div className='overflow-x-auto w-full my-5 no-scrollbar'>
                <table className='w-full whitespace-nowrap rounded-md bg-transparent overflow-hidden'>
                    <thead>
                        {headerGroups.map((headerGroup, index) => (
                            <tr key={index} {...headerGroup.getHeaderGroupProps()} className="text-black-500 dark:text-white drak:text-white text-sm text-left">
                                {headerGroup.headers.map((column, index) => (
                                    <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())} className={twMerge(`font-medium uppercase px-4 py-2.5 gap-2 bg-gray-100 dark:bg-black-400 ${index == 0 ? 'rounded-bl-md' : index + 1 == columns.length && 'rounded-br-md'}`, column.className)}>
                                        {column.canSort ?
                                            <div className='flex gap-2 items-center'>
                                                {column.render("Header")}
                                                <svg className="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                                                    <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                                                    <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                                                </svg>
                                            </div> :
                                            column.render("Header")
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {!loading &&
                            rows.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <tr key={index} {...row.getRowProps()} className="text-black-500 dark:text-white drak:text-white text-base text-left hover:bg-gray-100 dark:hover:bg-black-400">
                                        {row.cells.map((cell, index) => {
                                            return <td key={index} len={cell.length} {...cell.getCellProps()} className={`truncate max-w-xs font-normal px-4 py-2.5 ${index == 0 ? 'rounded-l-md' : index + 1 == row.cells.length && 'rounded-r-md'}`}>{cell.render("Cell")}</td>
                                        })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
            {/* // Loading animation */}
            {loading &&
                <>
                    <div className="animate-pulse px-4 py-2.5 w-full rounded-md -mt-3 flex gap-10 items-center">
                        <div className="flex gap-5 items-center w-[30%]">
                            <div className="animate-pulse h-6 w-7 bg-gray-300 dark:bg-black-400 rounded-full"></div>
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                        <div className="flex gap-5 items-center w-[50%]">
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                        <div className="flex gap-5 items-center w-[20%]">
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                    </div>
                    <div className="animate-pulse px-4 py-2.5 w-full rounded-md -mt-3 flex gap-10 items-center">
                        <div className="flex gap-5 items-center w-[30%]">
                            <div className="animate-pulse h-6 w-7 bg-gray-300 dark:bg-black-400 rounded-full"></div>
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                        <div className="flex gap-5 items-center w-[50%]">
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                        <div className="flex gap-5 items-center w-[20%]">
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                    </div>
                    <div className="animate-pulse px-4 py-2.5 w-full rounded-md -mt-3 flex gap-10 items-center">
                        <div className="flex gap-5 items-center w-[30%]">
                            <div className="animate-pulse h-6 w-7 bg-gray-300 dark:bg-black-400 rounded-full"></div>
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                        <div className="flex gap-5 items-center w-[50%]">
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                        <div className="flex gap-5 items-center w-[20%]">
                            <div className="animate-pulse h-3 w-full bg-gray-300 dark:bg-black-400 rounded-sm"></div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default memo(TableStructure)