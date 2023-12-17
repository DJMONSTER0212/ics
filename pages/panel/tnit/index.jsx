import React from 'react'
import { useSession } from 'next-auth/react';
import Unauth from '@/components/panel/design/Unauth';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'

const Index = ({ settings }) => {
    const { data: session, status } = useSession() // Next Auth

    // Auth
    if (status === "loading") {
        return <p>Loading...</p>
    }

    if (status === "unauthenticated" || session.user.role !== 'tnit') {
        return <Unauth />
    }

    return (
        <>
            TNIT
        </>
    )
}

Index.layout = 'panelLayout';
export default Index

// Passing props
export async function getServerSideProps(context) {
    // Connect to DB
    await connectDB();
    // Fetch settings
    const fetchSettings = await settingsModel.findOne().lean();
    const settings = JSON.parse(JSON.stringify(fetchSettings));
    return {
        props: {
            settings
        },
    }
}