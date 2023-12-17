import React, { useState, useEffect, useCallback } from 'react'
import Button from '@/components/panel/design/Button'
import Drawer from '@/components/panel/design/Drawer'
import Loader from '@/components/panel/design/Loader'
import Error from '@/components/panel/design/Error'
import Success from '@/components/panel/design/Success'

const DeleteCoupon = ({ deleteMessage, setDeleteMessage, deleteCouponDrawer, setDeleteCouponDrawer, deleteCouponId, reFetch, setGlobalMessage, session }) => {
    // To store coupon after fetching coupon >>>>>>>>>>>>>>>>
    const [coupon, setCoupon] = useState({})
    // For drawer >>>>>>>>>>>>>>>>
    const [drawerLoading, setDrawerLoading] = useState(false)
    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // Delete coupon submit handler >>>>>>>>>>>>>>>>
    const deleteCouponSubmit = async () => {
        setSubmitLoading(true)
        // To delete coupon
        const response = await fetch(`/api/panel/promotions/admin/coupons/delete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: coupon._id })
        })
        const responseData = await response.json()
        if (responseData.error) {
            setDeleteMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
            // To re fetch data on table
            reFetch()
            // Close drawer
            setDeleteCouponDrawer(false)
        }
        setSubmitLoading(false)
    }
    // Fetch coupon info >>>>>>>>>>>>>>>>
    const couponFetch = useCallback(async (id) => {
        setDrawerLoading(true)
        setDeleteCouponDrawer(true) // Open drawer
        const response = await fetch(`/api/panel/promotions/admin/coupons/${id}`, {
            headers: {
                'Content-Type': "application/json",
            }
        })
        const responseData = await response.json();
        if (responseData.data) {
            if (responseData.data.length == 0) {
                return setGlobalMessage({ message: 'No coupon found', type: 'error' });
            }
            setCoupon(responseData.data);
            setDeleteMessage('')  // Clear previous delete Error/Success message
            setGlobalMessage('')  // Clear previous global Error/Success
        } else {
            setGlobalMessage({ message: responseData.error, type: 'error' })
            setDeleteCouponDrawer(false) // Close drawer
        }
        setDrawerLoading(false)
    }, [setDeleteCouponDrawer, setDeleteMessage, setGlobalMessage])
    // To fetch coupon >>>>>>>>>>>>>>>>
    useEffect(() => {
        if (deleteCouponId) {
            couponFetch(deleteCouponId)
        }
    }, [deleteCouponId, couponFetch])

    return (
        <Drawer title={`Delete Coupon`} drawer={deleteCouponDrawer} setDrawer={setDeleteCouponDrawer}>
            {drawerLoading ? <div className='flex justify-center items-center h-screen'><Loader className='my-0' /></div> :
                <>
                    {deleteMessage.type == 'error' && <Error error={deleteMessage.message} />}
                    {deleteMessage.type == 'success' && <Success success={deleteMessage.message} />}
                    {/* // Delete coupon */}
                    <p className='text-red-500 dark:text-red-400 text-base font-normal mt-2'>Do you want to delete coupon with code: <span className='font-medium'>{coupon.couponCode} </span>?</p>
                    <div className="flex gap-5 items-center mt-10">
                        <Button type='submit' onClick={deleteCouponSubmit} loading={submitLoading} label={`Yes, Delete`} variant='primary' className='bg-red-100 dark:bg-red-100 hover:bg-red-200 dark:hover:bg-red-200 text-red-500' />
                    </div>
                </>
            }
        </Drawer>
    )
}

export default DeleteCoupon