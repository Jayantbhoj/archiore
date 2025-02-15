"use client"
import Body from '@/components/Body'

import Navbar from '@/components/Navbar'
import React from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

export default function Home() {
    return <div>
      <ParallaxProvider>
      <Navbar shadow="shadow-sm" />
      <Body/>
      </ParallaxProvider>
    </div>
  }
