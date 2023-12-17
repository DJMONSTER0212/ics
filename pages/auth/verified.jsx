import React from 'react'
import Success from '@/components/panel/design/Success';
import { useRouter } from 'next/router'

const Verified = () => {
  const router = useRouter(); // Next router

  setTimeout(() => {
    router.push('/auth/signin');
  }, 3000)

  return (
    <Success success={'Your account has been successfully verified. Redirecting to sign in page.'} className='mt-5 mb-3' />
  )
}

export default Verified