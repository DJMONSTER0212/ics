import React from 'react'
import SettingProvider from "@/conf/context/SettingsContext";
import Head from 'next/head';

// This layout doesn't contain any header and footer
const Default = ({ children }) => {
    return (
        <>
            {children.props.seo && <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{children.props.seo.title || ''}</title>
                <meta name="description" content={children.props.seo.desc || ''} />
                {children.props.seo.fevicon && <link rel="shortcut icon" href={children.props.seo.fevicon || ''} type="image/x-icon" />}
                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={children.props.seo.url || ''} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={children.props.seo.title || ''} />
                <meta property="og:description" content={children.props.seo.desc || ''} />
                <meta property="og:image" content={children.props.seo.image || ''} />
                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content={children.props.seo.url || ''} />
                <meta property="twitter:url" content={children.props.seo.url || ''} />
                <meta name="twitter: title" content={children.props.seo.title || ''} />
                <meta name="twitter:description" content={children.props.seo.desc || ''} />
                <meta name="twitter:image" content={children.props.seo.image || ''} />
            </Head>}
            <SettingProvider>
                {children}
            </SettingProvider>
        </>
    )
}

export default Default