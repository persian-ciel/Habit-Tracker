
import Link from 'next/link'
import React from 'react'

const GetStart = () => {
  return (
    <Link href="/signup">
    <button className='bg-[#DA498D] text-[#F9E6CF]  font-medium px-7 py-2 rounded-md hover:opacity-90 transition-opacity'>
        Get Started
    </button>
    </Link>
  )
}

export default GetStart