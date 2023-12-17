import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteTax = ({ deleteMessage, setDeleteMessage, deleteTaxDrawer, setDeleteTaxDrawer, deleteTaxId, reFetch, setGlobalMessage, session }) => {
    // To store tax after fetching tax >>>>>>>>>>>>>>>>
    const [tax, setTax] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Delete tax submit handler >>>>>>>>>>>>>>>>
    const deleteTaxSubmit = async () => {
        setSubmitLoading(true)
        // To delete tax
        const response = await fetch(`/api/panel/payments/admin/taxes/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: tax._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteTaxDrawer(false)
        }
        setSubmitLoading(false)
    }
    // Fetch tax info >>>>>>>>>>>>>>>>
    const taxFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteTaxDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/payments/admin/taxes/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No tax found', type: 'error' });
            }
            setTax(responseData.data);
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteTaxDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteTaxDrawer, setDeleteMessage, setGlobalMessage])
    // To fetch tax >>>>>>>>>>>>>>>>
    useEffect(() => {
        if (deleteTaxId) {
            taxFetch(deleteTaxId)
        }
    }, [deleteTaxId, taxFetch])

    return (
        <Drawer title={`Delete Tax`} drawer={deleteTaxDrawer} setDrawer={setDeleteTaxDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete tax */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Deleting tax will remove this from all the villas and hotels. Do you still want to delete <span className='font-medium'>{tax.name} </span>?</p>
                    <div className="flex gap-5 items-center mt-5">
                        <Button type='submit' onClick={deleteTaxSubmit} loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteTax