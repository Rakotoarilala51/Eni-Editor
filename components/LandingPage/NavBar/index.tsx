'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {}

const NavBar = (props: Props) => {
    const NavItem:string[] = ['Acceuil','A propos','Contribution','Devellopeur']
    const [Item,setItem] = useState('Acceuil')
  return (
    <div className='flex w-full py-8  items-center justify-center sticky'>
        <div className='flex items-center justify-between w-6xl border px-12 py-2 rounded-4xl'>
            <Image src={'/image/LogoENI-editor.png'} alt='logo' width={50} height={100} />
            <div>
                <ul className='flex gap-8 font-bold font-mono'>
                    {
                        NavItem && NavItem.map((item,idx)=>(
                            <li onClick={()=>setItem(item)} key={idx} className={` ${Item === item ? 'text-blue-500':""} hover:text-blue-500 transition-colors duration-200 cursor-pointer`}>{item}</li>
                        ))
                    }
                </ul>
            </div>
             <Link href={'/pseudo-algo'}>
            <button className=' px-4 py-1 rounded-2xl bg-blue-500 font-bold cursor-pointer'>Commencer</button>
            </Link>
        </div>
    </div>
  )
}

export default NavBar