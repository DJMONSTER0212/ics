import React from 'react'
import Success from '@/components/website/design/Success';

const VerifyLink = () => {
  return (
    <>
      {/* Message  */}
      <Success success={'We have sent you a verifcation link on your email. Please click on that link to get your account verified.'} className='mt-5 mb-3' />
    </>
  )
}

export default VerifyLink