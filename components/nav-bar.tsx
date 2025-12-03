import Image from 'next/image'
import React from 'react'
import GetStart from './getStart'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex z-50 fixed justify-between items-center w-screen py-4 px-10 bg-[#292935] text-white'>
        <div className='flex flex-row items-center gap-2'>
            <Image src="/ciel-logo.png" alt="Logo" height={50} width={50} />
            <span className='text-xl font-bold'>Ciel</span>
        </div>
        <div>
            <GetStart />
            <Link href="/login" className='ml-4 text-white font-medium hover:underline'>Login</Link>
        </div>
    </div>
  )
}

export default Navbar