import React, { useContext, useState, useEffect } from 'react'
import { SettingsContext } from '@/conf/context/SettingsContext'
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/website/design/Button';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { settings } = useContext(SettingsContext);
  // For user menu
  const [openUserMenu, setOpenUserMenu] = useState(false)
  // For navbar open
  const [isOpen, setIsOpen] = useState(false)
  // For navbar sticky
  const [isScrolled, setIsSScrolled] = useState(false);

  // Next auth
  const { data: session, status } = useSession();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSScrolled(true);
      } else {
        setIsSScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`py-2 fixed left-0 right-0 z-20 top-0 ${isScrolled ? 'bg-white backdrop-blur-md border-b border-gray-300 transition-all duration-600' : `${isOpen ? 'bg-white' : 'bg-transparent'} backdrop-blur-md transition-all duration-600`}`}>
        <div className="section-lg flex flex-wrap lg:flex-nowrap justify-between items-center">
          {/* // Logo */}
          <div className="block">
            <Link href='/'><Image src={settings.website?.lightLogo} alt='Logo' height={50} width={200} className='basis-1 lg:basis-0 order-1 block max-h-12 max-w-10 lg:max-h-12 w-auto xs:mr-10' /></Link>
          </div>
          {/* // Nav Items */}
          <div className="hidden lg:flex gap-6 items-center whitespace-nowrap">
            <Link href='/' className='text-lg text-black-500 font-medium'>Home</Link>
            <Link href='/explore' className='text-lg text-black-500 font-medium'>Explore villas</Link>
            <Link href='/about-us' className='text-lg text-black-500 font-medium'>About us</Link>
            {/* // Call button */}
            {settings.website?.info?.inquiryPhone && <a href={`tel:${settings.website?.info?.inquiryPhone}`} className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-primary-500/80 to-secondary-500 rounded-full py-1.5 px-3 -mr-2">
              <span className={`transition-all duration-500 w-3 h-3 text-white block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>' }}></span>
              <p className='text-sm text-white font-medium'>{settings.website?.info?.inquiryPhone}</p>
            </a>}
            {/* // Search */}
            {/* <div className={`${isScrolled ? 'transition-all duration-150 px-3 w-fit' : 'transition-all duration-150 p-0 w-0 overflow-hidden h-0'} transition-all flex gap-2 justify-center items-center border border-black-500 rounded-full py-1.5 -mr-2`}>
              <span className='block text-black-500 h-4 w-4' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>' }}></span>
              <input className='w-40 text-sm text-black-500 font-normal outline-none border-none bg-transparent placeholder:text-black-400' placeholder='Where are you going?' />
            </div> */}
            {/* // Profile section */}
            {session ?
              <div className='relative group select-none'>
                {/* // Name and image */}
                <div className="flex items-center gap-2 cursor-pointer border border-black-500 rounded-full p-1 pr-2" onClick={() => { setOpenUserMenu(!openUserMenu) }}>
                  <Image src={session.user.image} alt='User image' width={35} height={35} className='w-7 h-7 rounded-full object-cover' />
                  <p className='text-sm text-black-500 font-semibold'>Profile</p>
                </div>
                {/* // Menu */}
                <div className='absolute top-12 -mt-0.5 right-0 z-30'>
                  <div className={`bg-white h-0 py-0 overflow-hidden transition-all duration-200 grid-cols-1 rounded-md w-fit min-w-max px-1 ${openUserMenu && 'grid h-auto transition-all duration-200 border border-black-500 py-1'}`}>
                    {session?.user.role != 'user' && <Link href='/auth/callback' onClick={() => setOpenUserMenu(false)} className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                      Dashboard
                    </Link>}
                    <Link href='/user/account' onClick={() => setOpenUserMenu(false)} className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                      Account Settings
                    </Link>
                    <Link href='/user/bookings' onClick={() => setOpenUserMenu(false)} className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                      Bookings
                    </Link>
                    <p onClick={() => { signOut({ callbackUrl: '/' }) }} className="cursor-pointer rounded-md hover:bg-red-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                      Logout
                    </p>
                  </div>
                </div>
              </div> :
              // Sign in section
              <Link href='/auth/signin'><Button label='Sign in' className='h-fit w-fit bg-black-500 hover:bg-black-500/90' /></Link>
            }
          </div>
          {/* Mobile actions */}
          <div className="lg:basis-0 order-2 flex lg:hidden gap-3 items-center">
            {settings.website?.info?.inquiryPhone && <a href={`tel:${settings.website?.info?.inquiryPhone}`} className="flex lg:hidden items-center gap-3 cursor-pointer bg-gradient-to-r from-primary-500/80 to-secondary-500 rounded-full py-1 px-3">
              <span className={`transition-all duration-500 w-3 h-3 text-white block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>' }}></span>
              <p className='text-sm text-white font-medium flex gap-1.5'>Call <span className='block xs:hidden'>Us</span> <span className='hidden xs:block'>Now</span></p>
            </a>}
            <span onClick={() => setIsOpen(!isOpen)} className={`${isOpen ? 'block' : 'hidden'} transition-all duration-500 w-7 h-7 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>' }}></span>
            <span onClick={() => setIsOpen(!isOpen)} className={`${!isOpen ? 'block' : 'hidden'} transition-all duration-500 w-7 h-7 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>' }}></span>
          </div>
          {/* // Mobile Nav Items */}
          <div className={`${isOpen ? 'flex h-fit py-3 transition-all duration-200' : 'h-0 overflow-hidden py-0 transition-all duration-200'} basis-full lg:hidden flex-col gap-3 items-start whitespace-nowrap order-3`}>
            <Link href='/about-us' onClick={() => setIsOpen(false)} className='text-lg text-black-500 font-medium'>About Us</Link>
            <Link href='/contact-us' onClick={() => setIsOpen(false)} className='text-lg text-black-500 font-medium'>Contact Us</Link>
          </div>
        </div>
      </div>
      {/* // Mobile bottom nav */}
      <div className={`lg:hidden py-2 fixed left-0 right-0 z-20 bottom-0 bg-white backdrop-blur-md border-t border-gray-300 transition-all duration-200`}>
        {/* // Nav Items */}
        <div className="section-lg flex justify-between items-center whitespace-nowrap">
          <Link href='/'>
            <div className="flex items-center gap-3 cursor-pointer border border-black-500 bg-black-500 rounded-full py-2 px-4">
              <span className={`transition-all duration-500 w-5 h-5 text-white block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z"/></svg>' }}></span>
              <p className='text-sm text-white font-semibold'>Home</p>
            </div>
          </Link>
          <Link href='/explore'>
            <div className="flex items-center gap-3 cursor-pointer">
              <span className={`transition-all duration-500 w-7 h-7 p-1 text-black-400 block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>' }}></span>
              <p className='hidden xs:block text-sm text-black-400 font-semibold'>Search</p>
            </div>
          </Link>
          <Link href='/explore'>
            <div className="flex items-center gap-3 cursor-pointer">
              <span className={`transition-all duration-500 w-7 h-7 p-1 text-black-400 block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-compass" viewBox="0 0 16 16"><path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/><path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/></svg>' }}></span>
              <p className='hidden xs:block text-sm text-black-400 font-semibold'>Explore</p>
            </div>
          </Link>
          {/* // Profile section */}
          {session ?
            <div className='relative group select-none'>
              {/* // Name and image */}
              <div className="w-fit flex items-center gap-2 cursor-pointer border border-black-500 rounded-full p-1" onClick={() => { setOpenUserMenu(!openUserMenu) }}>
                <Image src={session.user.image} alt='User image' width={35} height={35} className='w-5 h-5 rounded-full object-cover' />
                <p className='hidden xs:block text-sm text-black-400 font-semibold'>Profile</p>
              </div>
              {/* // Menu */}
              <div className='absolute pt-3 bottom-14 -mb-1 right-0 z-30'>
                <div className={`bg-white h-0 py-0 overflow-hidden transition-all duration-200 grid-cols-1 mt-3 rounded-md w-fit min-w-max px-1 ${openUserMenu && 'grid h-auto transition-all duration-200 border border-black-500 py-1'}`}>
                  {session?.user.role != 'user' && <Link href='/auth/callback' onClick={() => setOpenUserMenu(false)} className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                    Dashboard
                  </Link>}
                  <Link href='/user/account' onClick={() => setOpenUserMenu(false)} className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                    Account settigs
                  </Link>
                  <Link href='/user/bookings' onClick={() => setOpenUserMenu(false)} className="rounded-md hover:bg-black-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                    Bookings
                  </Link>
                  <p onClick={() => { signOut({ callbackUrl: '/' }) }} className="cursor-pointer rounded-md hover:bg-red-500 flex items-center text-sm text-black-500 hover:text-white font-regular py-1.5 px-3">
                    Logout
                  </p>
                </div>
              </div>
            </div> :
            // Sign in section
            <Link href='/auth/signin'>
              <span className={`transition-all duration-500 w-7 h-7 p-1 text-black-400 block`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28"><g clip-path="url(#a)"><path fill="currentColor" d="M14 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm4.667-7a4.666 4.666 0 1 1-9.333 0 4.666 4.666 0 0 1 9.333 0ZM28 25.667C28 28 25.667 28 25.667 28H2.333S0 28 0 25.667c0-2.334 2.333-9.334 14-9.334s14 7 14 9.334Zm-2.333-.01c-.003-.574-.36-2.3-1.942-3.882-1.521-1.522-4.384-3.108-9.725-3.108-5.343 0-8.204 1.586-9.725 3.108-1.582 1.582-1.937 3.308-1.942 3.882h23.334Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h28v28H0z"/></clipPath></defs></svg>' }}></span>
            </Link>
          }
        </div>
      </div>
    </>
  )
}

export default Navbar
