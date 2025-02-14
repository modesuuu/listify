import React from 'react'
import Image from 'next/image'

export default function User(){
  return (
    <>
    <section>
        <div className='flex gap-4'>
            <Image alt='avatar' className='rounded-full max-w-12 max-h-12 w-full' src="/produk/Arief _Poconggg_ Muhammad gabung Baso Aci Akang.jpeg" width={100} height={100} />
            <div className='flex flex-col items-start justify-center gap-3'>
                <h1 className='font-semibold text-sm leading-[0.8]'>Username</h1>
                <h2 className='font-semibold text-sm text-greey leading-[0.8]'>Role</h2>
            </div>
        </div>
    </section>
    </>
  )
}
