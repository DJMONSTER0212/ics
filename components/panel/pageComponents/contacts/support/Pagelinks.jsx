import React from 'react'
import Tabs from '@/components/panel/design/Tabs'
import TabButton from '@/components/panel/design/TabButton'

const PageLinks = ({ activePage, settings, updateContactType }) => {
    return (
        <Tabs>
            <TabButton onClick={() => updateContactType('all')} label='All' activeTab={activePage} tabName='all' />
            <TabButton onClick={() => updateContactType('student')} label='Student' activeTab={activePage} tabName='student' />
            <TabButton onClick={() => updateContactType('normal')} label='Normal' activeTab={activePage} tabName='normal' />
            <TabButton onClick={() => updateContactType('unreplied ')} label='Unreplied' activeTab={activePage} tabName='unreplied' />
        </Tabs>
    )
}

export default PageLinks