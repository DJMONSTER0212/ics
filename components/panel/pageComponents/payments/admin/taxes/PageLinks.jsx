import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ taxType, settings, updateTaxType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updateTaxType('all')} label='All' activeTab={taxType} tabName='all' />
            <TabButton onClick={() => updateTaxType('onVillas')} label='Applied on villas' activeTab={taxType} tabName='onVillas' />
            <TabButton onClick={() => updateTaxType('onHotels')} label='Applied on hotels' activeTab={taxType} tabName='onHotels' />
            <TabButton onClick={() => updateTaxType('inActive')} label='Not active' activeTab={taxType} tabName='inActive' />
        </Tabs>
    )
}

export default PageLinks