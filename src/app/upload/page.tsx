import Navbar from '@/components/Navbar'
import UploadCard from '@/components/uploadCard'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar shadow="shadow-sm" />
      <div className='mt-1'>
      <UploadCard/>
      </div>
    </div>
  )
}

export default page
