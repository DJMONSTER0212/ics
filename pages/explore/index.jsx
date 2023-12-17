import React, { useState } from 'react'
import '@splidejs/react-splide/css';
import Offers from '@/components/website/common/Offers';
import Villas from '@/components/website/pageComponents/explore/Villas';
import Search from '@/components/website/common/Search';
import { useRouter } from 'next/router';
import connectDB from "@/conf/database/dbConfig";
import settingsModel from '@/models/settings.model';

const Explore = () => {
  // Router
  const router = useRouter();
  // To set villas
  const [villas, setVillas] = useState([])
  // To set current location
  const [currentLocation, setCurrentLocation] = useState({ id: router.query?.location || '', name: router.query?.city || '' })
  // Loading
  const [loading, setLoading] = useState(true)
  return (
    <>
      <Search setVillas={setVillas} setCurrentLocation={setCurrentLocation} setLoading={setLoading} query={router.query} />
      {/* // Villas >>>> */}
      <Villas villas={villas} currentLocation={currentLocation} loading={loading} />
      <Offers />
    </>
  )
}

// Layout
Explore.layout = 'websiteLayout'

export default Explore;

export async function getServerSideProps(context) {
  // Connect to DB
  await connectDB();
  // Fetch settings
  const fetchSettings = await settingsModel.findOne().lean();
  const settings = JSON.parse(JSON.stringify(fetchSettings));
  // Get domain name
  const { req } = context;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const domainName = `${protocol}://${req.headers.host}`;
  return {
    props: {
      settings,
      seo: {
        title: `Discover the Enchanting World of Luxury Villas | ${settings.website?.name}`,
        desc: settings.website?.seoInfo?.metaDesc,
        fevicon: settings.website?.fevicon,
        image: settings.website?.lightLogo,
        url: domainName,
      }
    },
  }
}