import React, { useState, useEffect } from 'react'
import Button from '@/components/panel/design/Button';
import TitleDevider from '@/components/panel/design/TitleDevider';
import AddCancellationRule from '@/components/panel/pageComponents/villas/admin/editVilla/AddCancellationRule';
import EditCancellationRule from '@/components/panel/pageComponents/villas/admin/editVilla/EditCancellationRule';
import DeleteCancellationRule from '@/components/panel/pageComponents/villas/admin/editVilla/DeleteCancellationRule';
import Empty from '@/components/panel/design/Empty'

const CancellationRules = ({ globalMessage, setGlobalMessage, villaId }) => {
    // For cancellation rules
    const [loading, setLoading] = useState(true)
    const [cancellationRules, setCancellationRules] = useState({})
    const [reFetch, setReFetch] = useState(false)

    // For edit cancellation rule >>>>>>>>>>>>>>>>
    const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    const [editCancellationRuleDrawer, setEditCancellationRuleDrawer] = useState(false)
    const [editCancellationRuleId, setEditCancellationRuleId] = useState()
    // Edit fetch
    const editFetch = (id) => {
        setEditCancellationRuleId(id)
        setEditCancellationRuleDrawer(true)
        setGlobalMessage({ message: '', type: '' })
    }

    // For add cancellation rule >>>>>>>>>>>>>>>>
    const [addCancellationRuleDrawer, setAddCancellationRuleDrawer] = useState(false)
    const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
    // Add cancellation rule onclick
    const onClickAddCancellationRule = () => {
        setAddMessage('');
        setAddCancellationRuleDrawer(!addCancellationRuleDrawer)
    }

    // For delete cancellation rule >>>>>>>>>>>>>>>>
    const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
    const [deleteCancellationRuleDrawer, setDeleteCancellationRuleDrawer] = useState(false)
    const [deleteCancellationRuleId, setDeleteCancellationRuleId] = useState()
    const [deleteCancellationRule, setDeleteCancellationRule] = useState()

    // Delete fetch
    const deleteFetch = (id, rule) => {
        setDeleteMessage({ message: '', type: '' })
        setDeleteCancellationRuleId(id)
        setDeleteCancellationRule(rule)
        setDeleteCancellationRuleDrawer(true)
        setGlobalMessage({ message: '', type: '' })
    }

    // To Fetch cancellation rules >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchCancellationRules = async () => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${villaId}/cancellation/rules`);
            const responseData = await response.json();
            if (responseData.data) {
                responseData.data.cancellation.cancellationRules.sort((a, b) => a.daysBeforeCheckIn - b.daysBeforeCheckIn);
                setCancellationRules(responseData.data.cancellation.cancellationRules)  // Set data in cancellation rule
            } else {
                setGlobalMessage({ message: responseData.error, type: 'error' })
            }
            setLoading(false)
        }
        fetchCancellationRules();
    }, [setGlobalMessage, reFetch, villaId])

    // To refetch cancellation rule
    const reFetchCancellationRules = () => {
        setReFetch(!reFetch)
    }
    return (
        <>
            {/* // Cancellation rules */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-5 sm:items-center justify-between mt-5 mb-3">
                <TitleDevider title='Cancellation rules' className='w-full' />
                <Button variant='primary-icon' onClick={onClickAddCancellationRule} className='w-fit text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
            </div>
            {loading ?
                <div className='animate-pulse grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 mt-5'>
                    <div className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex gap-2 mt-3">
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex gap-2 mt-3">
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex gap-2 mt-3">
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-36 rounded-md"></div>
                                <div className="bg-gray-200 dark:bg-black-400 h-3 w-full rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex gap-2 mt-3">
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[25%] rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-[75%] rounded-md"></div>
                        </div>
                    </div>
                </div> :
                <>
                    {cancellationRules.length > 0 ?
                        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
                            {cancellationRules.map((rule, index) => (
                                <div key={index} className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                                    <div className="grid grid-cols-1 gap-1">
                                        <div className="flex gap-2 justify-between">
                                            <p className='text-base text-black-500 dark:text-white'>Days before check-in</p>
                                            <p className='text-base text-black-300 dark:text-black-200'>{rule.daysBeforeCheckIn}</p>
                                        </div>
                                        <div className="flex gap-2 justify-between">
                                            <p className='text-base text-black-500 dark:text-white'>Refundable price</p>
                                            <p className='text-base text-black-300 dark:text-black-200'>{rule.refundablePrice}%</p>
                                        </div>
                                    </div>
                                    <div className="flex-1"></div>
                                    <div className="flex gap-2 mt-3">
                                        <Button variant='secondary-icon' onClick={() => deleteFetch(rule._id, rule)} className='w-[25%] text-sm py-2 bg-red-100 dark:bg-red-100' iconClassname='text-red-500 dark:text-red-500' labelClassName='hidden' label='Delete' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>'} />
                                        <Button variant='secondary-icon' onClick={() => editFetch(rule._id)} className='w-[75%] text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Edit rule' icon={'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'} />
                                    </div>
                                </div>
                            ))}
                        </div> :
                        <Empty message='No cancellation rules found.' >
                            <p className='text-black-300 dark:text-black-200 text-lg font-normal'>Please <span onClick={onClickAddCancellationRule} className='cursor-pointer text-primary-500 dark:text-primary-400'>create a cancellation rule</span>.</p>
                        </Empty>
                    }
                </>
            }
            {/* // Add cancellation rule */}
            <AddCancellationRule
                addMessage={addMessage}
                setAddMessage={setAddMessage}
                addCancellationRuleDrawer={addCancellationRuleDrawer}
                setAddCancellationRuleDrawer={setAddCancellationRuleDrawer}
                reFetchCancellationRules={reFetchCancellationRules}
                villaId={villaId}
            />
            {/* // Edit cancellation rule */}
            <EditCancellationRule
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                editCancellationRuleDrawer={editCancellationRuleDrawer}
                setEditCancellationRuleDrawer={setEditCancellationRuleDrawer}
                reFetchCancellationRules={reFetchCancellationRules}
                editCancellationRuleId={editCancellationRuleId}
                setGlobalMessage={setGlobalMessage}
                villaId={villaId}
            />
            {/* // Delete cancellation rule */}
            <DeleteCancellationRule
                deleteMessage={deleteMessage}
                setDeleteMessage={setDeleteMessage}
                deleteCancellationRuleDrawer={deleteCancellationRuleDrawer}
                setDeleteCancellationRuleDrawer={setDeleteCancellationRuleDrawer}
                reFetchCancellationRules={reFetchCancellationRules}
                deleteCancellationRuleId={deleteCancellationRuleId}
                setGlobalMessage={setGlobalMessage}
                deleteCancellationRule={deleteCancellationRule}
                villaId={villaId}
            />
        </>
    )
}

export default CancellationRules