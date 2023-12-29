'use client'

import Pano from '@/components/Pano';
import { data } from '@/data';
import dynamic from 'next/dynamic';


export default function Home() {
  return (
    <div className='w-screen h-full'>
      <h1>Demo</h1>
      <Pano data={data} />
    </div>
  )
}
