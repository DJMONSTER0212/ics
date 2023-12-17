import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings, updateVillaBookingType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updateVillaBookingType('all')} label='All' activeTab={activePage} tabName='all' />
            <TabButton onClick={() => updateVillaBookingType('confirmed')} label='Confirmed' activeTab={activePage} tabName='confirmed' />
            <TabButton onClick={() => updateVillaBookingType('pending')} label='Pending' activeTab={activePage} tabName='pending' />
            <TabButton onClick={() => updateVillaBookingType('cancelled')} label='Cancelled' activeTab={activePage} tabName='cancelled' />
        </Tabs>
    )
}

export default PageLinks