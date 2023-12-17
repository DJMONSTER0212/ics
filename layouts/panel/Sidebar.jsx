import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitch from '@/components/panel/layout/topbar/ThemeSwitch';
// Components
import MenuItem from '@/components/panel/layout/sidebar/MenuItem';
import sidebarItems from './sidebarItems';
// Context

const Sidebar = ({ sidebarOpen, role, setSidebarOpen, session, signOut, settings }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const router = useRouter();
  var items = sidebarItems[role]
  return (
    <div className={`${sidebarOpen ? 'opacity-100 w-full transition-all duration-200 px-8 py-5' : 'opacity-0 sm:opacity-100 w-0 transition-all duration-200 py-5 px-0 sm:py-5 sm:px-8'} sm:flex flex-col bg-gray-50 dark:bg-dimBlack h-screen overflow-auto sm:w-72 fixed top-0 left-0 z-40`}>
      {/* //Logo */}
      <div className='w-full'>
        <Image src={settings.website.darkLogo} alt='Logo' height={50} width={200} className='hidden dark:block max-h-10 w-auto max-w-[70%]' />
        <Image src={settings.website.lightLogo} alt='Logo' height={50} width={200} className='block dark:hidden max-h-10 w-auto max-w-[70%]' />
      </div>
      {/* // Sidebar items */}
      <div className="grid grid-cols-1 gap-6 mt-10">
        {/* // Normal Item */}
        {items.map((item, index) => (
          item.variant == 'normal' ?
            <MenuItem key={index} setSidebarOpen={setSidebarOpen} variant={item.variant} title={item.title} path={item.path} routerPath={router.pathname} icon={item.icon} />
            :
            item.variant == 'withMessage' ?
              <MenuItem key={index} setSidebarOpen={setSidebarOpen} variant={item.variant} title={item.title} message={item.message} path={item.path} routerPath={router.pathname} icon={item.icon} />
              :
              item.variant == 'dropdown' &&
              <MenuItem key={index} setSidebarOpen={setSidebarOpen} variant={item.variant} title={item.title} subItems={item.subItems} path={item.path} routerPath={router.pathname} icon={item.icon} />

        ))}
      </div>
      <div className="flex-1"></div>
      {/* // Profile section */}
      <div className={`${openMenu ? 'border border-gray-300 dark:border-black-400' : 'border-none'} select-none hidden sm:block relative group bg-white dark:bg-black-600 -mx-4 mt-4 rounded-md py-2 px-3`}>
        {/* // Name and image */}
        <div className={`flex items-center gap-5`}>
          <Image onClick={() => { setOpenMenu(!openMenu) }} src={session.user.image} alt='User image' width={35} height={35} style={{ 'height': '35px' }} className='rounded-full object-cover cursor-pointer' />
          <div onClick={() => { setOpenMenu(!openMenu) }} className="cursor-pointer flex flex-col items-start flex-1">
            <p className='text-black-500 dark:text-white text-base font-medium line-clamp-1'>{session.user.name}</p>
            <span className='text-black-300 dark:text-black-300 text-sm font-regular'>{session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}</span>
          </div>
          <ThemeSwitch />
        </div>
        {/* // Menu */}
        <div className='absolute pt-3 bottom-16 right-0 z-30 w-full'>
          <div className={`h-0 py-0 overflow-hidden transition-all duration-200 ${openMenu && 'grid h-auto py-3 transition-all duration-200 border border-gray-300'} dark:border-black-400 grid-cols-1 gap-4 mt-3 bg-white dark:bg-dimBlack rounded-md w-full min-w-full`}>
            <Link href='/' className="px-5 flex items-center text-base text-black-300 dark:text-black-200 hover:text-black-500 dark:hover:text-white font-regular">
              Go back to website
            </Link>
            <p onClick={() => { signOut({ callbackUrl: '/' }) }} className="cursor-pointer px-5 flex items-center text-base text-black-300 dark:text-black-200 hover:text-black-500 dark:hover:text-white font-regular">
              Logout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar