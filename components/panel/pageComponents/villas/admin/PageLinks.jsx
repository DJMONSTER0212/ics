import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ villaType, settings, updateVillaType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updateVillaType('all')} label='All' activeTab={villaType} tabName='all' />
            {settings.tnit.multiVendorAllowed && <TabButton onClick={() => updateVillaType('verified')} label='Verified' activeTab={villaType} tabName='verified' />}
            {settings.tnit.multiVendorAllowed && <TabButton onClick={() => updateVillaType('notVerified')} label='Not verified' activeTab={villaType} tabName='notVerified' />}
            {settings.tnit.multiVendorAllowed && <TabButton onClick={() => updateVillaType('submitForVerification')} label='Pending verification' activeTab={villaType} tabName='submitForVerification' />}
            {settings.tnit.multiVendorAllowed && <TabButton onClick={() => updateVillaType('blocked')} label='Blocked' activeTab={villaType} tabName='blocked' />}
        </Tabs>
    )
}

export default PageLinks