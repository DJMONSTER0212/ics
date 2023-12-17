import React from 'react'
import { twMerge } from 'tailwind-merge'
import { PropagateLoader } from 'react-spinners'
import config from '@/tailwind.config.js';
const primaryColor = config.theme.extend.colors.primary['500']; // Primary color of website

const Loader = ({ className }) => {
  return (
    <div className={twMerge('flex justify-center my-3', className)}>
      <PropagateLoader color={primaryColor} />
    </div>
  )
}

export default Loader