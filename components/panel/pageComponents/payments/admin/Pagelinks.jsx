import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings, updatePaymentType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updatePaymentType('all')} label='All' activeTab={activePage} tabName='all' />
            <TabButton onClick={() => updatePaymentType('confirmed')} label='Confirmed' activeTab={activePage} tabName='confirmed' />
            <TabButton onClick={() => updatePaymentType('pending')} label='Pending' activeTab={activePage} tabName='pending' />
            <TabButton onClick={() => updatePaymentType('failed')} label='Failed' activeTab={activePage} tabName='failed' />
            <TabButton onClick={() => updatePaymentType('refund')} label='Refunds' activeTab={activePage} tabName='refund' />
        </Tabs>
    )
}

export default PageLinks