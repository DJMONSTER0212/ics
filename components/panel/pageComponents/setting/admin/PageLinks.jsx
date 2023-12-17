import React from 'react'
import Link from 'next/link'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings }) => {
    return (
        <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
            <Tabs>
                <Link href={`/panel/admin/settings/website`}><TabButton label='Website' activeTab={activePage} tabName='website' /></Link>
                <Link href={`/panel/admin/settings/seo`}><TabButton label='SEO' activeTab={activePage} tabName='seo' /></Link>
                <Link href={`/panel/admin/settings/social`}><TabButton label='Social' activeTab={activePage} tabName='social' /></Link>
                <Link href={`/panel/admin/settings/info`}><TabButton label='Information' activeTab={activePage} tabName='info' /></Link>
                <Link href={`/panel/admin/settings/policy`}><TabButton label='Policies' activeTab={activePage} tabName='policy' /></Link>
                <Link href={`/panel/admin/settings/property`}><TabButton label='Property' activeTab={activePage} tabName='property' /></Link>
                <Link href={`/panel/admin/settings/booking`}><TabButton label='Booking' activeTab={activePage} tabName='booking' /></Link>
                <Link href={`/panel/admin/settings/cancellation`}><TabButton label='Cancellation' activeTab={activePage} tabName='cancellation' /></Link>
            </Tabs>
        </div>
    )
}

export default PageLinks