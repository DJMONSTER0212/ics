import React, { useContext } from 'react'
import '@splidejs/react-splide/css';
import Image from 'next/image';
import { SettingsContext } from '@/conf/context/SettingsContext'
import Head from 'next/head';

const About = () => {
  const { settings } = useContext(SettingsContext);
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
      {/* // Banner */}
      <div className="pt-36 pb-20 bg-white">
        <div className="section-lg">
          <p className='text-xl text-black-500 font-semibold'>About Us</p>
          <h1 className='text-2xl xs:text-3xl lg:text-4xl text-black-500 font-bold'><span className='text-primary-500'>Crafting Extraordinary Experiences:</span> Unveiling Our Story of Connecting You to Unforgettable Villa Retreats.</h1>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-16">
            <div className="flex gap-5 flex-col justify-start">
              <Image src='/website/images/Homes.png' alt='homes' width={50} height={50} />
              <p className='text-base text-black-500 font-semibold'>Discover 15+ Homes for Your Perfect Getaway</p>
            </div>
            <div className="flex gap-5 flex-col justify-start">
              <Image src='/website/images/Happy.png' alt='homes' width={50} height={50} />
              <p className='text-base text-black-500 font-semibold'>500+ Happy Guests: Unforgettable stay experiences.</p>
            </div>
            <div className="flex gap-5 flex-col justify-start">
              <Image src='/website/images/Safe.png' alt='homes' width={50} height={50} />
              <p className='text-base text-black-500 font-semibold'>Your Trust: Our Uncompromising Commitment to Safety</p>
            </div>
            <div className="flex gap-5 flex-col justify-start">
              <Image src='/website/images/Love.png' alt='homes' width={50} height={50} />
              <p className='text-base text-black-500 font-semibold'>Empowering Hospitality: Our Dedicated and Helpful Staff</p>
            </div>
          </div>
        </div>
      </div>
      {/* // About */}
      <div className="bg-gradient-to-r from-gray-100 to-primary-100 py-16">
        <div className="section-lg">
          <h2 className='text-2xl xs:text-3xl text-black-500 font-bold'>About {settings.website?.name}</h2>
          <p className='mt-3 text-base xs:text-lg text-black-500 font-normal'>Once upon a time, nestled amidst picturesque landscapes, our passion for creating extraordinary experiences was born. At the heart of our story lies a commitment to craft unforgettable memories for each and every guest. With a team of dedicated and friendly staff, we strive to ensure your stay surpasses expectations. From the moment you arrive, our helpful staff is at your service, ready to assist with any request, ensuring your comfort and enjoyment throughout your villa retreat. We take pride in curating a collection of exceptional homes, providing a sanctuary where you can unwind, rejuvenate, and create cherished moments that will forever resonate in your heart. Welcome to our world of warm hospitality and enchanting journeys.</p>
          <p className='mt-3 text-base xs:text-lg text-black-500 font-normal'>Once upon a time, nestled amidst picturesque landscapes, our passion for creating extraordinary experiences was born. At the heart of our story lies a commitment to craft unforgettable memories for each and every guest.</p>
        </div>
      </div>
    </>
  )
}

// Layout
About.layout = 'websiteLayout'

export default About;