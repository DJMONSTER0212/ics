import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteCancellationRule = ({ deleteMessage, setDeleteMessage, deleteCancellationRuleDrawer, setDeleteCancellationRuleDrawer, deleteCancellationRuleId, deleteCancellationRule, reFetchCancellationRules, setGlobalMessage }) => {
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Delete cancellation rule submit handler >>>>>>>>>>>>>>>>
    const deleteCancellationRuleSubmit = async () => {
        setSubmitLoading(true)
        // To delete cancellation rule
        const response = await fetch(`/api/panel/settings/admin/cancellation/rules/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: deleteCancellationRuleId })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch updated data
            reFetchCancellationRules()
            // Close drawer
            setDeleteCancellationRuleDrawer(false)
        }
        setSubmitLoading(false)
    }

    return (
        <Drawer title={`Delete Cancellation Rule`} drawer={deleteCancellationRuleDrawer} setDrawer={setDeleteCancellationRuleDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete cancellation rule */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2 mb-5'>Do you really want to delete this cancellation rule?</p>
                    <div className="flex flex-col justify-between w-full bg-white dark:bg-black-600 rounded-md py-2 px-4">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="flex gap-2 justify-between">
                                <p className='text-base text-black-500 dark:text-white'>Days before check-in</p>
                                <p className='text-base text-black-300 dark:text-black-200'>{deleteCancellationRule?.daysBeforeCheckIn}</p>
                            </div>
                            <div className="flex gap-2 justify-between">
                                <p className='text-base text-black-500 dark:text-white'>Refundable price</p>
                                <p className='text-base text-black-300 dark:text-black-200'>{deleteCancellationRule?.refundablePrice}%</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5 items-center mt-5">
                        <Button type='submit' loading={submitLoading} onClick={deleteCancellationRuleSubmit} label='Yes, Delete' variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteCancellationRule