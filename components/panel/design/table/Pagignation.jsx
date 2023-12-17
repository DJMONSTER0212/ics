import Button from "../Button"
import Input from "../Input"

const Pagignation = ({ pageCount, pageSize, currentPage, setCurrentPage, updatePageSize }) => {
    const gotoPage = (page) => {
        setCurrentPage(page)
    }
    const previousPage = () => {
        setCurrentPage(currentPage - 1)
    }
    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    }
    return (
        <div className="flex flex-col-reverse lg:flex-row gap-2 justify-between items-center mt-5">
            <div className="w-full sm:w-auto flex justify-between xs:justify-center lg:flex-row flex-wrap gap-2 xs:gap-4 sm:gap-2 items-center">
                <div className="flex gap-2 items-center">
                    <p className="text-black-500 dark:text-white font-regular">Go to page: </p>
                    <Input type="number"
                        value={currentPage + 1}
                        onChange={e => {
                            const page = e.target.value ? e.target.value - 1 : 0
                            gotoPage(page)
                        }}
                        className='w-1/3 min-w-[50px]'
                        inputClassName='px-3 py-1 text-sm w-full'
                        min='1'
                        max={pageCount}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <p className="text-black-500 dark:text-white font-regular">Show </p>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            const pageSize = Number(e.target.value);
                            updatePageSize(pageSize)
                        }}
                        className='outline-none bg-transparent border border-gray-300 dark:border-black-400 text-black-500 dark:text-white rounded-md block dark:placeholder-black-200 px-3 py-1.5 text-sm'
                    >
                        {[50, 100, 150, 200, 500, 1000].map(pageSize => (
                            <option key={pageSize} value={pageSize} className='bg-white dark:bg-dimBlack text-black dark:text-white'>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex gap-2 xs:gap-4 sm:gap-2 items-center">
                <Button onClick={() => gotoPage(0)} disabled={currentPage == 0} variant='secondary-icon' className='w-auto text-sm py-2 px-2' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/><path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>'} />
                <Button onClick={() => previousPage()} disabled={currentPage == 0} variant='secondary-icon' className='w-auto text-sm py-2 px-2' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>'} />
                <p className="text-black-500 dark:text-white font-regular whitespace-nowrap">
                    Page
                    <span className="ml-2 font-medium">
                        {currentPage + 1} of {pageCount}
                    </span>
                </p>
                <Button onClick={() => nextPage()} disabled={currentPage == pageCount - 1} variant='secondary-icon' className='w-auto text-sm py-2 px-2' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>'} />
                <Button onClick={() => gotoPage(pageCount - 1)} disabled={currentPage == pageCount - 1} variant='secondary-icon' className='w-auto text-sm py-2 px-2' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/><path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/></svg>'} />
            </div>
        </div>
    )
}

export default Pagignation