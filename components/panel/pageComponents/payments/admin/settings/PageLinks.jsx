import React from 'react'
import Link from 'next/link'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings }) => {
    return (
        <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
            <div className="flex gap-x-5 gap-y-2 sm:flex-wrap items-center w-full whitespace-nowrap overflow-scroll no-scrollbar">
                <Link href={`/panel/admin/payments/settings/payout`}><TabButton label='Payout' activeTab={activePage} tabName='payout' /></Link>
                <Link href={`/panel/admin/payments/settings/gateway`}><TabButton label='Payment gateway' activeTab={activePage} tabName='gateway' /></Link>
                <Link href={`/panel/admin/payments/settings/tax`}><TabButton label='Tax' activeTab={activePage} tabName='tax' /></Link>
            </div>
        </div>
    )
}

export default PageLinks