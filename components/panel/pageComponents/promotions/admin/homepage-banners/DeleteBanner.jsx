import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteBanner = ({ deleteMessage, setDeleteMessage, deleteBannerDrawer, setDeleteBannerDrawer, deleteBannerId, reFetch, setGlobalMessage, session }) => {
    // To store banner after fetching banner >>>>>>>>>>>>>>>>
    const [banner, setBanner] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Delete banner submit handler >>>>>>>>>>>>>>>>
    const deleteBannerSubmit = async () => {
        setSubmitLoading(true)
        // To delete banner
        const response = await fetch(`/api/panel/promotions/admin/homepage-banners/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: banner._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteBannerDrawer(false)
        }
        setSubmitLoading(false)
    }
    // Fetch banner info >>>>>>>>>>>>>>>>
    const bannerFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteBannerDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/promotions/admin/homepage-banners/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No banner found', type: 'error' });
            }
            setBanner(responseData.data);
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteBannerDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteBannerDrawer, setDeleteMessage, setGlobalMessage])
    // To fetch banner >>>>>>>>>>>>>>>>
    useEffect(() => {
        if (deleteBannerId) {
            bannerFetch(deleteBannerId)
        }
    }, [deleteBannerId, bannerFetch])

    return (
        <Drawer title={`Delete Banner`} drawer={deleteBannerDrawer} setDrawer={setDeleteBannerDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete banner */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you want to delete banner {'"'}<span className='font-medium'>{banner.title} </span>{'"'}?</p>
                    <div className="flex gap-5 items-center mt-5">
                        <Button type='submit' onClick={deleteBannerSubmit} loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteBanner