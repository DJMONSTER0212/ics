import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
const Unauth = () => {
  const { data: session } = useSession() // Next Auth
  return (
    <div className='h-full min-h-screen flex flex-col gap-2 items-center justify-center'>
      <h1 className='text-xl lg:text-2xl text-black-500 dark:text-white font-semibold text-center'>Oops! You are not allowed to view this.</h1>
      <Link href='/' className='text-primary-500 hover:underline dark:text-primary-300'>Go back to homepage</Link>
      {session && <p onClick={() => signOut({ callbackUrl: '/auth/signin' })} className='text-primary-500 hover:underline dark:text-primary-300'>Log Out and Sign in back with different account</p>}
    </div>
  )
}

export default Unauth