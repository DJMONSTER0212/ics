import React, { useEffect, useState, useContext } from 'react';
import { useSession, signOut } from "next-auth/react"
import Loader from '@/components/panel/design/Loader';
import { SettingsContext } from '@/conf/context/SettingsContext';
import Sidebar from '@/layouts/panel/Sidebar';
import Topbar from '@/layouts/panel/Topbar';
import Unauth from '@/components/panel/design/Unauth';
import Footer from './Footer';
import Head from 'next/head';

const Layout = ({ children }) => {
    const { settings } = useContext(SettingsContext); // Setting
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession() // Next Auth

    // For sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    // Checking for user [Blocked/Deleted/Not Verified]
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/auth/status', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: session.user._id })
            })
            const data = await response.json()
            if (data.error || data.role == 'user') {
                signOut({ callbackUrl: '/auth/signin' })
            }
            setLoading(false)
        }
        if (session) {
            fetchData();
        }
    }, [session])

    // For auth
    if (status === "loading") {
        return <div className='h-screen w-full flex items-center justify-center'><Loader /></div>
    }

    if (status === "unauthenticated" || session.user.role == 'user') {
        return <Unauth />
    }
    return (
        <>
            <Head>
                <title>{settings.website.name} Dashboard</title>
                <meta name="description" content={settings.website.name + 'Dashboard'} />
                <link rel="shortcut icon" href={settings.website.fevicon} type="image/x-icon" />
            </Head>
            {loading ? <div className='h-screen w-full flex items-center justify-center'><Loader /></div> :
                <div className="w-full min-h-screen relative flex">
                    {/* // Sidebar */}
                    <Sidebar settings={settings} role={session.user.role} signOut={signOut} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} session={session} />
                    {/* // Main */}
                    <div className="w-full sm:w-[calc(100%_-_18rem)] absolute right-0 min-h-screen bg-background dark:bg-black-500">
                        {/* // Topbar >>>> */}
                        <Topbar settings={settings} session={session} signOut={signOut} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        {/* // Main section >>>> */}
                        {children}
                        <Footer />
                    </div>
                </div>
            }
        </>
    )
}

export default Layout