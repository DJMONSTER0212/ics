import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings, updateUserType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updateUserType('all')} label='All' activeTab={activePage} tabName='all' />
            {settings.tnit.multiVendorAllowed && <TabButton onClick={() => updateUserType('adminVendor')} label='Admins or Vendors' activeTab={activePage} tabName='adminVendor' />}
            <TabButton onClick={() => updateUserType('blocked')} label='Blocked' activeTab={activePage} tabName='blocked' />
            <TabButton onClick={() => updateUserType('support_admin')} label='Admin support team' activeTab={activePage} tabName='support_admin' />
        </Tabs>
    )
}

export default PageLinks