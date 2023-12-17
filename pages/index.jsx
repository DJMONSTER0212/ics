import React from 'react'
import Locations from '@/components/website/pageComponents/homepage/Locations';
import BestVillas from '@/components/website/pageComponents/homepage/BestVillas';
import PopularVillas from '@/components/website/pageComponents/homepage/PopularVillas';
import Offers from '@/components/website/common/Offers';
import homepageBannersModel from "@/models/homepageBanners.model";
import settingsModel from "@/models/settings.model";
import connectDB from "@/conf/database/dbConfig";
import Search from '@/components/website/pageComponents/homepage/Search';
import Banners from '@/components/website/pageComponents/homepage/Banners';
import NewVillas from '@/components/website/pageComponents/homepage/NewVillas';
import Head from 'next/head';
const Homepage = ({ homepageBanners, settings }) => {

  return (
    <>
      <Head>
        {/* <!-- HTML Meta Tags --> */}
        <title>{settings.website?.seoInfo?.title || 'TNIT Hotel Management website'}</title>
        <meta name="description" content={settings.website?.seoInfo?.metaDesc || 'TNIT Hotel Management website'} />
        {settings.website?.fevicon && <link rel="shortcut icon" href={settings.website?.fevicon} type="image/x-icon" />}
        {/* <!-- Facebook Meta Tags --> */}
        {/* <meta property="og:url" content={window.location.href} /> */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={settings.website?.seoInfo?.title || 'TNIT Hotel Management website'} />
        <meta property="og:description" content={settings.website?.seoInfo?.metaDesc || 'TNIT Hotel Management website'} />
        <meta property="og:image" content={settings.website?.lightLogo} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:domain" content={window.location.host} /> */}
        {/* <meta property="twitter:url" content={window.location.href} /> */}
        <meta name="twitter: title" content={settings.website?.seoInfo?.title || 'TNIT Hotel Management website'} />
        <meta name="twitter:description" content={settings.website?.seoInfo?.metaDesc || 'TNIT Hotel Management website'} />
        <meta name="twitter:image" content={settings.website?.lightLogo} />
      </Head>
      {/* // Banners >>>> */}
      <Banners banners={JSON.parse(homepageBanners)} />
      {/* // Search >>>> */}
      <Search />
      {/* // Location >>>> */}
      <Locations />
      {/* // Best villas >>>> */}
      <BestVillas />
      {/* // New villas >>>> */}
      <NewVillas />
      {/* // Rooms >>>> */}
      <PopularVillas />
      {/* // Offers */}
      <Offers />
    </>
  )
}

// Layout
Homepage.layout = 'websiteLayout'

export default Homepage;

export async function getServerSideProps(context) {
  connectDB();
  // Fetch banners >>>>>>>>>>>>>>
  const homepageBanners = await homepageBannersModel.find().lean();
  // Fetch settings >>>>>>>>>>>>>>
  const settings = await settingsModel.findOne().lean();
  // Get domain name
  const { req } = context;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const domainName = `${protocol}://${req.headers.host}`;
  return {
    props: {
      homepageBanners: JSON.stringify(homepageBanners),
      settings: JSON.parse(JSON.stringify(settings)),
      seo: {
        title: settings.website?.seoInfo?.title,
        desc: settings.website?.seoInfo?.metaDesc,
        fevicon: settings.website?.fevicon,
        image: settings.website?.lightLogo,
        url: domainName,
      }
    },
  }
}