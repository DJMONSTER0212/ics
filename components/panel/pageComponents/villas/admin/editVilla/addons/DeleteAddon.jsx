import React, { useState } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteAddon = ({ deleteMessage, setDeleteMessage, deleteAddonDrawer, setDeleteAddonDrawer, deleteAddonId, deleteAddonName, fetchAddons, setGlobalMessage, villa }) => {

    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)

    // Delete addon submit handler >>>>>>>>>>>>>>>>
    const deleteAddonSubmit = async () => {
        setSubmitLoading(true)

        // To delete addon
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/addons/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: deleteAddonId })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            fetchAddons(villa._id)
            // Close drawer
            setDeleteAddonDrawer(false)
        }
        setSubmitLoading(false)
    }

    return (
        <Drawer title={`Delete Addon`} drawer={deleteAddonDrawer} setDrawer={setDeleteAddonDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete addon */}
                    <p className='text-red-500 dark:text-red-400text-base font-normal mt-5'>Deleting a addon will remove the addon from villa booking page on website.</p>
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you still want to delete <span className='font-medium'>{deleteAddonName}</span>?</p>
                    <div className="flex gap-5 items-center mt-5">
                        <Button type='submit' loading={submitLoading} onClick={deleteAddonSubmit} label='Yes, Delete' variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteAddon