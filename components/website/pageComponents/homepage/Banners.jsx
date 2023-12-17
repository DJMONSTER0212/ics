import React from 'react'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';
import Button from '../../design/Button';
import Link from 'next/link';

const Banners = ({ banners }) => {
    return (
        <div className="section-lg rounded-md pt-20 relative">
            <div className="w-full bg-black-500 rounded-lg overflow-hidden">
                <Splide hasTrack={false} options={{
                    rewind: true,
                    width: '100%',
                    arrows: false,
                    classes: {
                        pagination: 'splide__pagination your-class-pagination',
                        page: 'splide__pagination__page dot',
                    },
                    autoplay: true,
                    interval: 5000
                }}>
                    <SplideTrack>
                        {banners && banners.map((banner, index) => (
                            <SplideSlide key={index}>
                                <Image src={banner.image} alt='Banner Image' width={'1440'} height={500} className='object-cover bg-blend-darken opacity-60 h-[500px] xs:h-[500px]'></Image>
                                <div className="flex flex-col text-left xs:text-center justify-start xs:justify-center items-start xs:items-center absolute right-0 left-0 top-[25%] xs:top-[40%] md:top-[60%] -translate-y-1/2 max-w-[85%] mx-auto">
                                    <h1 className='text-3xl xs:text-3xl md:text-5xl text-white font-bold md:leading-normal'>{banner.title}</h1>
                                    {banner.ctaUrl && <Link href={banner.ctaUrl} className='mt-3' passHref><Button variant="secondary" label={banner.ctaName} /></Link>}
                                </div>
                            </SplideSlide>
                        ))}
                    </SplideTrack>
                </Splide>
            </div>
        </div>
    )
}

export default Banners