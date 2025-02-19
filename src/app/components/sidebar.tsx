'use client'
import React from 'react'
import Image from 'next/image'
import 'tippy.js/dist/tippy.css';import Link from 'next/link';
import { tv } from 'tailwind-variants';
import { usePathname } from 'next/navigation';


export default function Sidebar(){

    const pathname = usePathname();

    const linkStyles = tv({
        base: 'relative rounded-lg flex p-2 items-center justify-center overflow-hidden hover:text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue before:duration-500 hover:before:h-56 hover:before:w-56',
        variants: {
          active: {
            true: 'text-white bg-blue pointer-events-none',
          },
        },
      });

  return (
    <>
    <section className='lg:left-0 bottom-0 z-10 lg:h-screen px-6 w-full lg:w-fit py-6 bg-white fixed'>
        <div className='flex lg:flex-col items-center h-full justify-between'>
            {/* logo */}
            <div className="img">
                <Image alt='Logo' className=' lg:max-w-10 max-h-6 max-w-6 lg:max-h-10 ' src="/lg.svg" width={100} height={100} />
            </div>
            {/* navlink */}
            <div className='flex lg:flex-col items-center gap-8 text-2xl text-greey'>
              <Link href={'/'} className={linkStyles({ active: pathname === '/' })}>
                <i className='bx bxs-dashboard z-10'></i>
              </Link>
              <Link className={linkStyles({ active: pathname === '/projects' })} href='/projects'><i className='bx bx-line-chart z-10' ></i></Link>
              <Link className={linkStyles({ active: pathname === '/donetask' })} href='/donetask'><i className='bx bx-task z-10' ></i></Link>
            </div>
            {/* log out */}
            <button><i className='bx bx-log-out text-2xl'></i></button>
        </div>
    </section>
    </>
  )
}
