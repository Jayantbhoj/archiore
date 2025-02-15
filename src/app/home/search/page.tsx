"use client"
import Navbar from '@/components/Navbar'
import SearchBody from '@/components/SearchBody'
import React from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

const page = () => {
  return (
    <>
    <Navbar shadow="shadow-sm"/>
    <ParallaxProvider>
      <SearchBody/>
    </ParallaxProvider>
    </>
  )
}

export default page
