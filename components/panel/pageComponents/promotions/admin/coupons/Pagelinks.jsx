import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings, updateCouponType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updateCouponType('all')} label='All' activeTab={activePage} tabName='all' />
            <TabButton onClick={() => updateCouponType('active')} label='Active' activeTab={activePage} tabName='active' />
            <TabButton onClick={() => updateCouponType('inActive')} label='Inactive' activeTab={activePage} tabName='inActive' />
        </Tabs>
    )
}

export default PageLinks