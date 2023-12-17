import React, { useState, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeSwitch from '@/components/panel/layout/topbar/ThemeSwitch'

const Topbar = ({ toggleSidebar, sidebarOpen, settings, session, signOut }) => {
  const [open, setOpen] = useState(false) // To handle sticky topbar
  const [openMenu, setOpenMenu] = useState(false)
  // To handle sticky topbar & toggling sidebar
  const click = () => {
    if (!sidebarOpen) {
      setTimeout(() => {
        setOpen(true)
      }, 100)
    } else {
      setOpen(false);
    }
    toggleSidebar()
  }
  return (
    <div className={`z-20 flex sm:hidden justify-between items-center gap-7 py-2 px-4 sm:px-8 w-full border-b-[0.5px] bg-white dark:bg-black-600 border-gray-300 dark:border-black-400 ${!open && 'sticky top-0'}`}>
      {/* // Toggle button */}
      <div className='block sm:hidden'>
        {sidebarOpen && <span onClick={click} className={`${sidebarOpen && 'fixed right-8 top-5 z-50 transition-all duration-500'} transition-all duration-500 block sm:hidden w-7 h-7 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>' }}></span>}
        <span onClick={click} className={`transition-all duration-500 block sm:hidden w-7 h-7 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>' }}></span>
      </div>
      {/* // Logo */}
      <div className='flex-1'>
        <Image src={settings.website.darkLogo} alt='Logo' height={50} width={200} className='hidden dark:block max-h-10 w-auto max-w-[70%]' />
        <Image src={settings.website.lightLogo} alt='Logo' height={50} width={200} className='block dark:hidden max-h-10 w-auto max-w-[70%]' />
      </div>
      {/* // Icons */}
      <div className="flex items-center gap-5 border-r pr-5 py-1 border-black-400 dark:border-black-200">
        {/* // Light and dark mode */}
        <ThemeSwitch />
      </div>
      {/* // Profile section */}
      <div className='relative group'>
        {/* // Name and image */}
        <div className="flex items-center gap-5 cursor-pointer" onClick={() => { setOpenMenu(!openMenu) }}>
          <div className="hidden lg:flex flex-col items-end">
            <p className='text-black-500 dark:text-white text-base font-medium'>{session.user.name}</p>
            <span className='text-black-300 dark:text-black-300 text-sm font-regular'>{session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}</span>
          </div>
          <Image src={session.user.image} alt='User image' width={35} height={35} style={{ 'height': '35px' }} className='rounded-full object-cover' />
        </div>
        {/* // Menu */}
        <div className='absolute pt-3 top-8 right-0 z-30'>
          <div className={`h-0 py-0 overflow-hidden transition-all duration-200 ${openMenu && 'grid h-auto py-3 transition-all duration-200 border border-black-100'} dark:border-black-400 grid-cols-1 gap-4 mt-3 bg-white dark:bg-dimBlack rounded-md w-fit min-w-max`}>
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

export default Topbar