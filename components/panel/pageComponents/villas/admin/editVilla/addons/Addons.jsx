import React from 'react'
import TitleDevider from '@/components/panel/design/TitleDevider'
import Button from '@/components/panel/design/Button'
import Empty from '@/components/panel/design/Empty'

const DayAddons = ({ onClickAddAddon, addons, editFetch, deleteFetch, settings }) => {
    return (
        <>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-5 sm:items-center justify-between mb-3">
                <TitleDevider title='Addons' className='w-full' />
                <Button onClick={onClickAddAddon} variant='primary-icon' className='w-fit text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
            </div>
            {addons.length > 0 ?
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
                    {addons.map((addons, index) => (
                        <div key={index} className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                            <div className="border-b border-gray-300 dark:border-black-400 pb-2">
                                <p className='text-lg text-black-500 dark:text-white font-medium'>{addons.name}</p>
                            </div>
                            <div className="mt-2 grid grid-cols-1 gap-1">
                                <div className="flex gap-2 justify-between">
                                    <p className='text-base text-black-500 dark:text-white'>Price</p>
                                    <p className='text-base text-black-300 dark:text-black-200'>{settings.website.currencySymbol} {addons.price}</p>
                                </div>
                                {addons.shortDesc && <div className="flex flex-col gap-1 justify-between">
                                    <p className='text-base text-black-500 dark:text-white'>Description</p>
                                    <p className='text-base text-black-300 dark:text-black-200'>{addons.shortDesc}</p>
                                </div>}
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-2 mt-2">
                                <Button variant='secondary-icon' onClick={() => deleteFetch(addons._id, addons.name)} className='w-[25%] text-sm py-2 bg-red-100 dark:bg-red-100' iconClassname='text-red-500 dark:text-red-500' labelClassName='hidden' label='Delete' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>'} />
                                <Button variant='secondary-icon' onClick={() => editFetch(addons._id)} className='w-[75%] text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Edit price' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'} />
                            </div>
                        </div>
                    ))}
                </div> :
                <Empty message='No addons found for villa.' >
                    <p className='text-black-300 dark:text-black-200 text-lg font-normal'>Please <span onClick={onClickAddAddon} className='cursor-pointer text-primary-500 dark:text-primary-400'>create a addon</span> for villa.</p>
                </Empty>
            }
        </>
    )
}

export default DayAddons