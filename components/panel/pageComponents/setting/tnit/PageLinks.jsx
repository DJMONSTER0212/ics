import React from 'react'
import Link from 'next/link'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings }) => {
    return (
        <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5'>
            <Tabs>
                <Link href={`/panel/tnit/settings`}><TabButton label='Vendor' activeTab={activePage} tabName='vendor' /></Link>
                <Link href={`/panel/tnit/settings/activation`}><TabButton label='Activation' activeTab={activePage} tabName='activation' /></Link>
            </Tabs>
        </div>
    )
}

export default PageLinks