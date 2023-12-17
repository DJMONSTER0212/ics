import React, { useState } from 'react'
import Link from 'next/link'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'
const PageLinks = ({ activePage, villaId, settings }) => {
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <div className='flex gap-5 justify-between items-center bg-white dark:bg-black-600 mb-5 relative'>
            <Tabs>
                <div className="bg-gray-200 dark:bg-black-400 rounded-md p-1 cursor-pointer">
                    {openMenu && <span onClick={() => { setOpenMenu(!openMenu) }} className={`transition-all duration-500 block w-4 h-4 m-0.5 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>' }}></span>}
                    {!openMenu && <span onClick={() => { setOpenMenu(!openMenu) }} className={`transition-all duration-500 block w-5 h-5 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>' }}></span>}
                </div>
                <div className='absolute left-0 top-10 z-30'>
                    <div className={`h-0 pl-2 pr-4 overflow-hidden transition-all duration-200 ${openMenu && 'grid h-auto py-3 transition-all duration-200 border border-black-100'} dark:border-black-400 grid-cols-1 gap-4 mt-3 bg-white dark:bg-dimBlack rounded-md w-fit min-w-max`}>
                        <Link href={`/panel/admin/villas/${villaId}/addons`}><TabButton activeTab={activePage} label='Addons' tabName='addons' /></Link>
                        <Link href={`/panel/admin/villas/${villaId}/seasonal-pricings`}><TabButton activeTab={activePage} label='Seasonal Pricings' tabName='seasonalPricings' /></Link>
                        <Link href={`/panel/admin/villas/${villaId}/seo`}><TabButton activeTab={activePage} label='SEO' tabName='seo' /></Link>
                        {settings.tnit.multiVendorAllowed && settings.admin.cancellation.letOwnerManageCancellation && <Link href={`/panel/admin/villas/${villaId}/cancellation`}><TabButton activeTab={activePage} label='Cancellation' tabName='cancellation' /></Link>}
                        <Link href={`/panel/admin/villas/${villaId}/ical`}><TabButton activeTab={activePage} label='iCal Links' tabName='ical' /></Link>
                        {settings.tnit.multiVendorAllowed && <Link href={`/panel/admin/villas/${villaId}/ownership`}><TabButton activeTab={activePage} label='Ownership' tabName='ownership' /></Link>}
                        <Link href={`/panel/admin/villas/${villaId}/promotions`}><TabButton activeTab={activePage} label='Promotions' tabName='promotions' /></Link>
                    </div>
                </div>
                <Link href={`/panel/admin/villas/${villaId}/general`}><TabButton activeTab={activePage} label='General' tabName='general' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/details`}><TabButton activeTab={activePage} label='Villa details' tabName='details' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/amenities`}><TabButton activeTab={activePage} label='Amenities' tabName='amenities' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/host`}><TabButton activeTab={activePage} label='Host' tabName='host' /></Link>
                {settings.tnit.multiVendorAllowed && <Link href={`/panel/admin/villas/${villaId}/verification`}><TabButton activeTab={activePage} label='Verification' tabName='verification' /></Link>}
            </Tabs>
        </div>
    )
}

export default PageLinks