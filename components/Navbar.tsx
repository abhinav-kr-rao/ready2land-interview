import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav>
            <Link href='/' className='flex  gap-4'>
                <Image
                    src='/logo.svg' width={38} height={32} alt='logo'
                />
                <h2>
                    Ready2Land
                </h2>
            </Link>
        </nav>
    )
}

export default Navbar