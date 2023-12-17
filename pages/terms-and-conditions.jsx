import React from 'react'
import connectDB from "@/conf/database/dbConfig";
import settingsModel from '@/models/settings.model';
import Head from 'next/head';
const about = ({ settings }) => {
    return (
        <div className="section-lg mt-20 xs:mt-28">
            <h1 className="text-2xl xs:text-3xl lg:text-4xl text-black-500 font-semibold text-center">Terms and Conditions</h1>
            <div className='mt-14 xs:mt-20 prose prose-base w-full max-w-full prose-p:m-0 prose-headings:p-0 prose-headings:m-0 space-y-[-5px]' dangerouslySetInnerHTML={{ __html: settings.policy?.TermAndConditions }}></div>
        </div>
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
                title: `Terms and Conditions | ${settings.website?.name}`,
                desc: settings.website?.seoInfo?.metaDesc,
                fevicon: settings.website?.fevicon,
                image: settings.website?.lightLogo,
                url: domainName,
            }
        },
    }
}