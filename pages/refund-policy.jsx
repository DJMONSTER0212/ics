import React from 'react'
import connectDB from "@/conf/database/dbConfig";
import settingsModel from '@/models/settings.model';
import Head from 'next/head';

const about = ({ settings }) => {
    return (
        <>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{`Refund policy - ${settings.website?.name}`}</title>
                <meta name="description" content={'Refund policy'} />
                {settings.website?.fevicon && <link rel="shortcut icon" href={settings.website?.fevicon} type="image/x-icon" />}
                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Refund policy - ${settings.website?.name}`} />
                <meta property="og:description" content={'Refund policy'} />
                <meta property="og:image" content={settings.website?.lightLogo} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content={window.location.host} />
                <meta property="twitter:url" content={window.location.href} />
                <meta name="twitter: title" content={`Refund policy - ${settings.website?.name}`} />
                <meta name="twitter:description" content={'Refund policy'} />
                <meta name="twitter:image" content={settings.website?.lightLogo} />
            </Head>
            {/* //  Content */}
            <div className="section-lg mt-20 xs:mt-28">
                <h1 className="text-2xl xs:text-3xl lg:text-4xl text-black-500 font-semibold text-center">Refund Policy</h1>
                <div className='mt-14 xs:mt-20 prose prose-base w-full max-w-full prose-headings:p-0 prose-headings:m-0 prose-p:m-0 space-y-[-5px]' dangerouslySetInnerHTML={{ __html: settings.policy?.refundPolicy }}></div>
            </div>
        </>
    )
}

// Layout
about.layout = 'websiteLayout'

export default about;

export async function getServerSideProps(context) {
    // Connect to DB
    await connectDB();
    // Fetch settings
    const fetchSettings = await settingsModel.findOne().select({ website: 1, policy: 1 }).lean();
    const settings = JSON.parse(JSON.stringify(fetchSettings));
    // Get domain name
    const { req } = context;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domainName = `${protocol}://${req.headers.host}`;
    return {
        props: {
            settings,
            seo: {
                title: `Refund Policy | ${settings.website?.name}`,
                desc: settings.website?.seoInfo?.metaDesc,
                fevicon: settings.website?.fevicon,
                image: settings.website?.lightLogo,
                url: domainName,
            }
        },
    }
}