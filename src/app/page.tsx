'use client'

import { data } from '@/data';
import dynamic from 'next/dynamic';
const Pano = dynamic(() => import("@/components/Pano"), { ssr: false });


export default function Home() {
  return (
    <div className='App'>
      <Pano data={data} />
    </div>
  )
}
