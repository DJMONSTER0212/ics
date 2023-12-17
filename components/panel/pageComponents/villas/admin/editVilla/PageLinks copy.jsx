import React from 'react'
import Link from 'next/link'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'
const PageLinks = ({ activePage, villaId, settings }) => {
    return (
        <div className='flex gap-5 justify-between items-center bg-white dark:bg-black-600 mb-5'>
            <Tabs>
                <Link href={`/panel/admin/villas/${villaId}/general`}><TabButton activeTab={activePage} label='General' tabName='general' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/details`}><TabButton activeTab={activePage} label='Villa details' tabName='details' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/ical`}><TabButton activeTab={activePage} label='iCal Links' tabName='ical' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/amenities`}><TabButton activeTab={activePage} label='Amenities' tabName='amenities' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/host`}><TabButton activeTab={activePage} label='Host' tabName='host' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/addons`}><TabButton activeTab={activePage} label='Addons' tabName='addons' /></Link>
                <Link href={`/panel/admin/villas/${villaId}/seasonal-pricings`}><TabButton activeTab={activePage} label='Seasonal Pricings' tabName='seasonalPricings' /></Link>
                {settings.tnit.multiVendorAllowed && settings.admin.cancellation.letOwnerManageCancellation && <Link href={`/panel/admin/villas/${villaId}/cancellation`}><TabButton activeTab={activePage} label='Cancellation' tabName='cancellation' /></Link>}
                {settings.tnit.multiVendorAllowed && <Link href={`/panel/admin/villas/${villaId}/verification`}><TabButton activeTab={activePage} label='Verification' tabName='verification' /></Link>}
                {settings.tnit.multiVendorAllowed && <Link href={`/panel/admin/villas/${villaId}/ownership`}><TabButton activeTab={activePage} label='Ownership' tabName='ownership' /></Link>}
            </Tabs>
        </div>
    )
}

export default PageLinks